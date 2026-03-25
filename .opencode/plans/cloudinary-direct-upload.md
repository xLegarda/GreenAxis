# Plan: Upload directo a Cloudinary (bypass límite 4.5MB de Vercel)

## Problema
Vercel serverless functions tienen un hard limit de 4.5MB en el body del request. Esto impide subir videos o archivos grandes a través de `/api/upload` ya que el archivo pasa por la función antes de llegar a Cloudinary.

## Solución
Upload directo del frontend a Cloudinary usando signed upload. El backend solo genera credenciales temporales y guarda la URL en DB. El archivo nunca toca Vercel.

## Flujo

```
1. Frontend → POST /api/upload/sign  (body: { key, label, category })
   ← Backend responde: { signature, timestamp, api_key, cloud_name, public_id }

2. Frontend → POST https://api.cloudinary.com/v1_1/{cloud_name}/auto/upload
   (FormData: file, signature, timestamp, api_key, public_id, folder)
   ← Cloudinary responde: { secure_url, public_id, ... }

3. Frontend → POST /api/upload/callback  (body: { key, url, label, category })
   ← Backend guarda en DB con SiteImage.create()
```

## Archivos a modificar

### 1. NUEVO: `src/lib/cloudinary-config.ts`
Extraer la configuración de Cloudinary a un módulo compartido para reutilizar entre endpoints.

```typescript
// export function getCloudinaryConfig(): { cloud_name, api_key, api_secret }
// export function generateSignature(params: Record<string, string>): string
```

### 2. NUEVO: `src/app/api/upload/sign/route.ts`
Endpoint que genera los parámetros firmados para upload directo.

- Verifica autenticación admin (`getCurrentAdmin`)
- Genera `timestamp` (Unix seconds)
- Genera `signature` = SHA-1 de `public_id=X&timestamp=X&folder=X` + API_SECRET
- Retorna: `{ signature, timestamp, api_key, cloud_name, public_id, folder }`

### 3. NUEVO: `src/app/api/upload/callback/route.ts`
Endpoint que recibe la URL del archivo subido directamente y la guarda en DB.

- Verifica autenticación admin
- Crea/actualiza registro `SiteImage` (igual que el upload actual)
- Retorna: `{ success, url, key }`

### 4. MODIFICAR: `src/app/api/upload/route.ts`
Extraer la configuración de Cloudinary al módulo compartido. Mantener el endpoint actual como fallback para compatibilidad.

### 5. MODIFICAR: `src/components/media-picker.tsx`
Reemplazar la función `handleFileUpload` para usar upload directo:

```
async handleFileUpload(file):
  1. POST /api/upload/sign → obtiene { signature, timestamp, api_key, cloud_name, public_id, folder }
  2. POST a Cloudinary con XMLHttpRequest (para progress tracking)
  3. POST /api/upload/callback → guarda en DB
  4. onChange(url)
```

Mantener la lógica de:
- Progress tracking (XMLHttpRequest tiene soporte nativo para upload a URLs externas)
- Duplicate detection (antes del upload directo, verificar en el backend)
- Error handling

### 6. MODIFICAR: `src/components/media-picker-compact.tsx`
Mismo cambio que `media-picker.tsx`.

### 7. MODIFICAR: `src/components/editor-js-image-tool.ts`
Mismo cambio para el upload desde Editor.js.

## Detalle de implementación

### Cloudinary Signed Upload (generación de firma)

La firma se genera con HMAC-SHA1 sobre los parámetros ordenados:

```typescript
import crypto from 'crypto'

function generateSignature(params: Record<string, string>, apiSecret: string): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return crypto.createHash('sha1')
    .update(sortedParams + apiSecret)
    .digest('hex')
}
```

Parámetros a firmar: `folder`, `public_id`, `timestamp`

### Upload directo desde frontend

```typescript
const xhr = new XMLHttpRequest()
xhr.upload.addEventListener('progress', (e) => { /* progress tracking */ })

const formData = new FormData()
formData.append('file', file)
formData.append('signature', signData.signature)
formData.append('timestamp', signData.timestamp)
formData.append('api_key', signData.api_key)
formData.append('public_id', signData.public_id)
formData.append('folder', signData.folder)

xhr.open('POST', `https://api.cloudinary.com/v1_1/${signData.cloud_name}/auto/upload`)
xhr.send(formData)
```

### Callback para guardar en DB

```typescript
// POST /api/upload/callback
{
  key: string,        // identificador del archivo
  url: string,        // secure_url de Cloudinary
  label: string,      // nombre descriptivo
  category: string    // categoría del archivo
}
```

## Verificación

1. Subir una imagen pequeña (< 1MB) → debe funcionar igual que antes
2. Subir un video grande (> 10MB) → debe subirse sin error 413
3. Verificar que el progress bar funcione durante el upload
4. Verificar que la URL se guarde correctamente en DB
5. Verificar que la biblioteca de medios se actualice después del upload
6. Verificar que el duplicate check funcione antes del upload directo

## Notas

- `api_key` de Cloudinary es público (no es secreto), se puede exponer al frontend
- `api_secret` NUNCA se expone al frontend, solo se usa en el backend para firmar
- El endpoint actual `/api/upload` se mantiene como fallback para compatibilidad
- La firma tiene un `timestamp` que Cloudinary usa para expirar la credencial
