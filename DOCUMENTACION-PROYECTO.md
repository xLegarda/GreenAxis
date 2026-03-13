# 📘 Documentación Técnica - Green Axis S.A.S.

**Versión**: 0.3.0  
**Fecha**: Marzo 12, 2026  
**Framework**: Next.js 16.1.1 (App Router)  
**Base de Datos**: Turso (LibSQL) con Prisma ORM 6.19.2  
**Lenguaje**: TypeScript 5  
**Runtime**: Node.js / Bun compatible  

---

## 🎯 Resumen Ejecutivo

Green Axis S.A.S. es una plataforma web corporativa completa para una empresa de servicios ambientales en Colombia. La aplicación incluye un sitio público optimizado con información de servicios, noticias, contacto y un panel de administración robusto para gestionar todo el contenido del sitio sin necesidad de conocimientos técnicos.

**Características Principales**:
- Sitio público responsive con información corporativa
- Panel de administración con autenticación segura (bcrypt 12 rounds)
- Sistema de gestión de contenido (CMS) integrado con 9 secciones
- Editor de texto enriquecido (Editor.js) con 15+ herramientas
- Gestión de imágenes con Cloudinary y sistema de keys únicas
- Base de datos distribuida con Turso (réplicas edge)
- Sistema de contacto con rate limiting (5 req/min)
- Carrusel de imágenes configurable con drag & drop
- Páginas legales editables con Editor.js
- Recuperación de contraseña con tokens de un solo uso
- Modo oscuro/claro con persistencia
- Headers de seguridad completos (CSP, HSTS, etc.)
- Middleware de protección de rutas
- Sistema de gestión de imágenes con reemplazo automático
- Analytics con Google Analytics
- Integración con WhatsApp (botón flotante)
- Scripts de backup y restauración de datos

**Estado Actual**: Producción ready con puntuación de seguridad de 8.5/10. Sistema de biblioteca de medios completo implementado con detección de duplicados, gestión de referencias y eliminación segura.

---

## 📊 Estado Actual del Proyecto

**Versión**: 0.3.0  
**Estado**: ✅ **Producción Ready**  
**Última Actualización**: Marzo 12, 2026  
**Puntuación de Seguridad**: 8.5/10 (Enterprise Ready)

### Resumen de Implementación

| Componente | Estado | Notas |
|------------|--------|-------|
| Sitio Público | ✅ Completo | 8 páginas responsive |
| Panel Admin | ✅ Completo | 9 secciones funcionales |
| Autenticación | ✅ Completo | Bcrypt, sesiones, recuperación |
| Base de Datos | ✅ Completo | Turso + Prisma, 11 modelos |
| Editor de Contenido | ✅ Completo | Editor.js con 15+ herramientas |
| Gestión de Imágenes | ✅ Completo | Biblioteca de medios con detección de duplicados |
| Seguridad | ✅ Completo | Headers, rate limiting, validación |
| Caché | ⚠️ Bug Conocido | Workaround disponible, fix diseñado |
| Testing | ❌ Pendiente | Recomendado para v0.3.0 |
| CI/CD | ❌ Pendiente | Guía disponible en specs |

### Funcionalidades Implementadas

✅ **Sitio Público**:
- Landing page con carrusel animado (gradientes configurables)
- Página de servicios con grid responsive
- Blog de noticias con paginación (6 por página)
- Página "Quiénes Somos" completa (historia, misión, visión, valores, equipo)
- Formulario de contacto con rate limiting
- Páginas legales (términos y privacidad)
- Modo oscuro/claro con persistencia
- WhatsApp flotante con modal
- Integración con Google Maps
- Feeds de redes sociales (Facebook, Instagram)

✅ **Panel de Administración**:
- Dashboard con resumen de contenido
- Configuración general del sitio
- CRUD de servicios con drag & drop
- CRUD de noticias con Editor.js
- CRUD de carrusel con drag & drop
- Biblioteca de medios completa con:
  - Detección de duplicados por hash SHA-256
  - Gestión de referencias automática
  - Metadatos completos (tamaño, dimensiones, duración)
  - Eliminación segura con verificación de uso
  - Soporte para imágenes, audio y video
  - Integración con Cloudinary
- Editor de páginas legales
- Editor de página "About" completa
- Editor de sección "About" del home
- Bandeja de mensajes de contacto

✅ **Seguridad**:
- Autenticación con bcrypt (12 rounds)
- Sesiones con cookies seguras (httpOnly, secure, sameSite)
- Rate limiting en login (5 intentos, 15 min lockout)
- Rate limiting en contacto (5 req/min)
- Headers de seguridad completos (CSP, HSTS, X-Frame-Options, etc.)
- Validación de inputs en todos los endpoints
- Protección contra path traversal
- Validación de magic bytes en uploads
- XSS protection disponible (configurable)
- Middleware de protección de rutas

✅ **Infraestructura**:
- Base de datos Turso con réplicas edge
- Cloudinary para imágenes (CDN global)
- Resend para emails transaccionales
- Scripts de backup y restauración
- Output standalone para despliegue optimizado

### Issues Conocidos

⚠️ **Bug Crítico de Caché**:
- Los cambios administrativos no se reflejan automáticamente en el sitio público
- Workaround: Hard refresh manual (Ctrl+Shift+R)
- Fix diseñado y documentado en `.kiro/specs/nextjs-cache-invalidation-fix/`
- Pendiente de implementación

### Próximos Pasos

1. **Inmediato**: Implementar fix de caché (prioridad crítica)
2. **Corto plazo**: 
   - Mejorar logging y monitoreo
   - Testing automatizado de biblioteca de medios
3. **Mediano plazo**: 
   - Testing automatizado completo
   - Autenticación de dos factores (2FA)
   - Internacionalización (i18n)
4. **Largo plazo**: 
   - Analytics interno
   - Búsqueda global en sitio
   - Sistema de roles y permisos granulares

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Frontend**:
- Next.js 16.1.1 (App Router)
- React 19.0.0
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (componentes basados en Radix UI)
- Framer Motion 12.23.2 (animaciones)
- Lucide React 0.525.0 (iconos)

**Backend**:
- Next.js API Routes
- Prisma ORM 6.19.2
- Turso Database (LibSQL) con adaptador @prisma/adapter-libsql
- bcryptjs (autenticación con 12 rounds)
- Server Actions y Server Components

**Servicios Externos**:
- Turso: Base de datos SQLite distribuida con réplicas edge
- Cloudinary: Gestión, optimización y CDN de imágenes
- Resend: Envío de emails transaccionales

**Gestión de Estado y Data Fetching**:
- Zustand 5.0.6 (state management del cliente)
- TanStack React Query 5.82.0 (data fetching y caché)
- React Hook Form 7.60.0 (formularios)

**UI y Experiencia**:
- next-themes 0.4.6 (modo oscuro/claro)
- Sonner 2.0.6 (notificaciones toast)
- dnd-kit (drag & drop para reordenar)
- Embla Carousel (carrusel de imágenes)

**Herramientas de Desarrollo**:
- ESLint 9
- Bun (runtime alternativo compatible)
- Prisma CLI
- tsx (ejecutar scripts TypeScript)

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     APLICACIÓN NEXT.JS                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────────────────┐      │
│  │   Sitio      │         │   Panel de               │      │
│  │   Público    │         │   Administración         │      │
│  │              │         │                          │      │
│  │ - Home       │         │ - Dashboard              │      │
│  │ - Servicios  │         │ - Configuración          │      │
│  │ - Noticias   │         │ - Servicios              │      │
│  │ - Quiénes    │         │ - Noticias               │      │
│  │   Somos      │         │ - Carrusel               │      │
│  │ - Contacto   │         │ - Imágenes               │      │
│  └──────┬───────┘         └──────────┬───────────────┘      │
│         │                            │                       │
│         └────────────┬───────────────┘                       │
│                      │                                       │
│         ┌────────────▼────────────────────┐                 │
│         │      API Routes + Actions       │                 │
│         │                                  │                 │
│         │ - /api/servicios                │                 │
│         │ - /api/noticias                 │                 │
│         │ - /api/contacto                 │                 │
│         │ - /api/admin/*                  │                 │
│         │ - /api/auth/*                   │                 │
│         └────────────┬────────────────────┘                 │
│                      │                                       │
└──────────────────────┼───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  Turso  │   │Cloudinary│   │ Resend  │
   │   DB    │   │   CDN    │   │  Email  │
   └─────────┘   └──────────┘   └─────────┘
```

---

## 📁 Estructura del Proyecto

### Directorios Principales

```
/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── admin/             # Panel de administración
│   │   ├── api/               # API Routes
│   │   ├── contacto/          # Página de contacto
│   │   ├── noticias/          # Blog/noticias
│   │   ├── servicios/         # Página de servicios
│   │   ├── quienes-somos/     # Página "About"
│   │   ├── portal-interno/    # Login y recuperación
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes shadcn/ui
│   │   └── *.tsx             # Componentes de página
│   └── lib/                   # Utilidades y lógica
│       ├── auth.ts           # Sistema de autenticación
│       ├── db.ts             # Cliente Prisma
│       ├── actions.ts        # Server Actions
│       ├── media-references.ts # Sistema de tracking de referencias de medios
│       └── utils.ts          # Utilidades generales
├── prisma/
│   └── schema.prisma         # Schema de base de datos
├── public/
│   └── uploads/              # Archivos subidos (local)
├── scripts/                  # Scripts de utilidad
├── .kiro/                    # Configuración de Kiro
│   ├── specs/               # Especificaciones técnicas
│   └── security-audit-report.md
└── package.json
```

### Rutas de la Aplicación

**Sitio Público**:
- `/` - Página principal con hero carousel
- `/servicios` - Listado de servicios
- `/noticias` - Blog de noticias
- `/noticias/[slug]` - Detalle de noticia
- `/quienes-somos` - Página "About"
- `/contacto` - Formulario de contacto
- `/terminos` - Términos y condiciones
- `/privacidad` - Política de privacidad

**Panel de Administración** (requiere autenticación):
- `/admin` - Dashboard principal
- `/admin/configuracion` - Configuración general
- `/admin/servicios` - Gestión de servicios
- `/admin/noticias` - Gestión de noticias
- `/admin/carrusel` - Gestión del carrusel
- `/admin/imagenes` - Gestión de imágenes
- `/admin/legal` - Páginas legales
- `/admin/quienes-somos` - Contenido "About" (página completa)
- `/admin/seccion-about` - Sección "About" del home
- `/admin/mensajes` - Mensajes de contacto

**Autenticación**:
- `/portal-interno` - Login de administradores
- `/portal-interno/recuperar-clave` - Recuperación de contraseña
- `/portal-interno/restablecer` - Restablecer contraseña

---

## 🗄️ Modelo de Datos

### Entidades Principales


#### 1. PlatformConfig
Configuración general del sitio (singleton).

**Campos clave**:
- `siteName`, `siteSlogan`, `siteDescription` - Información básica
- `logoUrl`, `faviconUrl` - Branding
- `companyName`, `companyAddress`, `companyPhone`, `companyEmail` - Datos de contacto
- `notificationEmail` - Email para recibir mensajes de contacto
- `facebookUrl`, `instagramUrl`, `twitterUrl`, `linkedinUrl`, etc. - Redes sociales
- `whatsappNumber`, `whatsappMessage`, `whatsappShowBubble` - Configuración WhatsApp
- `aboutImageUrl`, `aboutTitle`, `aboutDescription` - Sección "About"
- `aboutStats`, `aboutFeatures` - Estadísticas y características (JSON)
- `googleAnalytics`, `googleMapsEmbed` - Integraciones
- `primaryColor` - Color principal del tema

#### 2. Service
Servicios que ofrece la empresa.

**Campos**:
- `title`, `description`, `content` - Información del servicio
- `icon` - Nombre del icono de Lucide
- `imageUrl` - Imagen del servicio
- `order` - Orden de visualización
- `active` - Visible/oculto
- `featured` - Destacado en home

#### 3. News
Noticias/blog posts.

**Campos**:
- `title`, `slug`, `excerpt`, `content` - Contenido
- `imageUrl`, `author` - Metadatos
- `published`, `featured` - Estado
- `blocks` - Contenido en formato Editor.js (JSON)
- `showCoverInContent`, `imageCaption` - Opciones de visualización

#### 4. CarouselSlide
Slides del carrusel principal con personalización avanzada.

**Campos**:
- `title`, `subtitle`, `description` - Textos del slide
- `imageUrl` - Imagen de fondo (optimizada con Cloudinary)
- `buttonText`, `buttonUrl` - Botón de acción (CTA)
- `linkUrl` - Link de toda la imagen/título (opcional)
- `gradientEnabled` - Mostrar/ocultar degradado sobre imagen
- `animationEnabled` - Habilitar animación de zoom
- `gradientColor` - Color del degradado (hex sin #, default: negro)
- `order` - Orden de visualización (drag & drop en admin)
- `active` - Visible/oculto en sitio público

**Características**:
- Transiciones suaves con Embla Carousel
- Animaciones con Framer Motion
- Autoplay configurable
- Responsive en todos los dispositivos
- Gradientes personalizables por slide

#### 5. SiteImage
Sistema de gestión de imágenes con biblioteca de medios completa.

**Campos**:
- `key` - Identificador único (opcional, para imágenes específicas del sistema)
- `label` - Nombre descriptivo del archivo
- `description` - Descripción opcional del archivo
- `url` - URL del archivo (Cloudinary o local)
- `alt` - Texto alternativo para accesibilidad
- `category` - Categoría (hero, services, news, gallery, general)
- `mimeType` - Tipo MIME del archivo (image/jpeg, audio/mp3, video/mp4, etc.)
- `fileSize` - Tamaño del archivo en bytes
- `width`, `height` - Dimensiones (solo para imágenes)
- `duration` - Duración en segundos (solo para audio/video)
- `hash` - Hash SHA-256 del contenido del archivo (para detección de duplicados)
- `createdAt`, `updatedAt` - Timestamps

**Características de la Biblioteca de Medios**:

1. **Detección de Duplicados**:
   - Calcula hash SHA-256 del contenido del archivo
   - Detecta archivos idénticos antes de subir
   - Ofrece reutilizar archivo existente o subir nuevo
   - Ahorra espacio de almacenamiento y ancho de banda

2. **Gestión de Referencias**:
   - Sistema de tracking de uso de archivos
   - Detecta dónde se usa cada archivo (servicios, noticias, carrusel, etc.)
   - Previene eliminación accidental de archivos en uso
   - Opción de eliminación forzada con limpieza de referencias

3. **Metadatos Completos**:
   - Información detallada de cada archivo (tamaño, dimensiones, duración)
   - Categorización flexible
   - Búsqueda y filtrado por categoría
   - Edición de metadatos (label, description, alt, category)

4. **Eliminación Segura**:
   - Verifica referencias antes de eliminar
   - Muestra lista de lugares donde se usa el archivo
   - Elimina archivo de Cloudinary automáticamente
   - Modo forzado para eliminar y limpiar referencias

5. **Soporte Multi-formato**:
   - Imágenes: jpg, jpeg, png, gif, webp, svg
   - Audio: mp3, wav, ogg
   - Video: mp4, webm, mov
   - Validación de magic bytes para seguridad

**API Endpoints**:
- `GET /api/admin/media` - Listar archivos con filtros
- `POST /api/admin/media` - Registrar nuevo archivo
- `PUT /api/admin/media/:id` - Actualizar metadatos
- `DELETE /api/admin/media/:id` - Eliminar archivo (con verificación de referencias)
- `GET /api/admin/media/check-references` - Verificar uso de archivo

**Componentes UI**:
- `media-library-browser.tsx` - Navegador de biblioteca con grid responsive
- `media-card.tsx` - Card de archivo con preview y acciones
- `media-picker.tsx` - Selector de archivos para formularios
- `image-selector.tsx` - Selector específico para imágenes (legacy, migrado a media-picker)

#### 6. ContactMessage
Mensajes del formulario de contacto con bandeja de entrada en admin.

**Campos**:
- `name`, `email`, `phone`, `company` - Datos del contacto
- `subject`, `message` - Contenido del mensaje
- `consent` - Consentimiento de privacidad (HABEAS DATA)
- `read` - Estado de lectura (marca como leído en bandeja)
- `createdAt` - Fecha y hora de envío

**Funcionalidades**:
- Validación de email con regex
- Sanitización de inputs (límites de longitud)
- Rate limiting (5 mensajes por minuto por IP)
- Notificación por email opcional (vía Resend)
- Bandeja de entrada en `/admin/mensajes`
- Marcar como leído/no leído
- Ordenamiento por fecha (más recientes primero)

**Validaciones**:
- Nombre: 2-100 caracteres
- Email: formato válido
- Teléfono: máximo 20 caracteres (opcional)
- Mensaje: 10-2000 caracteres
- Consentimiento: obligatorio (checkbox)

#### 7. Admin
Usuarios administradores del sistema con límite configurable.

**Campos**:
- `email` - Email único (usado para login)
- `password` - Hash de la contraseña (bcrypt con 12 rounds)
- `name` - Nombre del administrador (opcional)
- `role` - Rol del usuario (developer, superadmin, admin)
- `status` - Estado de la cuenta (pendiente, aprobado, inactivo)
- `createdAt`, `updatedAt` - Timestamps

**Límite de Cuentas**: Máximo 2 cuentas por defecto (configurable con `MAX_ADMIN_ACCOUNTS`)

**Seguridad**:
- Passwords hasheados con bcrypt (12 rounds, ~250ms por hash)
- No se almacenan passwords en texto plano
- Verificación con `bcrypt.compare()` en login
- Sesiones con cookies seguras (httpOnly, secure, sameSite)

**Roles** (preparado para futuro):
- `developer` - Acceso completo + configuración técnica
- `superadmin` - Acceso completo a todas las secciones
- `admin` - Acceso estándar al panel

**Nota**: Actualmente todos los roles tienen los mismos permisos. Sistema de permisos granulares es una mejora futura.

#### 8. LegalPage
Páginas legales (términos, privacidad).

**Campos**:
- `slug` - Identificador único (terminos, privacidad)
- `title`, `content` - Contenido en markdown
- `blocks` - Contenido en formato Editor.js (JSON)
- `manualDate` - Fecha manual de última actualización

#### 9. AboutPage
Contenido completo de la página "Quiénes Somos" (editable desde `/admin/quienes-somos`).

**Campos**:
- **Hero Section**: `heroTitle`, `heroSubtitle`, `heroImageUrl`
- **Historia**: `historyTitle`, `historyContent` (markdown), `historyImageUrl`
- **Misión**: `missionTitle`, `missionContent`
- **Visión**: `visionTitle`, `visionContent`
- **Valores**: `valuesTitle`, `valuesContent` (JSON array con title, description, icon)
- **Equipo**: `teamTitle`, `teamEnabled`, `teamMembers` (JSON array con name, role, image, bio)
- **Por qué elegirnos**: `whyChooseTitle`, `whyChooseContent` (JSON array)
- **CTA Final**: `ctaTitle`, `ctaSubtitle`, `ctaButtonText`, `ctaButtonUrl`
- **Estadísticas**: `statsEnabled`, `statsContent` (JSON array con value, label, icon)
- **Certificaciones**: `certificationsEnabled`, `certificationsContent` (JSON array)
- **Ubicación**: `showLocationSection` (mostrar/ocultar mapa)

**Nota**: Esta es la página completa "About". La sección "About" del home se configura desde `PlatformConfig` (campos `about*`).

#### 10. PasswordResetToken
Tokens para recuperación de contraseña (un solo uso).

**Campos**:
- `email` - Email del usuario que solicita recuperación
- `token` - Token único (UUID v4)
- `expiresAt` - Expiración (1 hora desde creación)
- `used` - Estado de uso (previene reutilización)

**Flujo de Seguridad**:
1. Token se genera con UUID v4 (criptográficamente seguro)
2. Se envía por email vía Resend
3. Expira en 1 hora
4. Se marca como usado después de restablecer contraseña
5. No se puede reutilizar el mismo token

#### 11. SocialFeedConfig
Configuración de feeds de redes sociales (Facebook, Instagram).

**Campos**:
- `platform` - Plataforma (facebook, instagram)
- `embedCode` - Código de embed proporcionado por la plataforma
- `accessToken` - Token de acceso (si se usa API)
- `pageId` - ID de la página/perfil
- `active` - Mostrar/ocultar feed en sitio público

**Nota**: Actualmente se usa código de embed. Para integración con API se requiere configuración adicional.

---

## 🔐 Sistema de Autenticación

### Implementación

**Archivo**: `src/lib/auth.ts`

**Características**:
- Hashing de contraseñas con bcrypt (12 rounds)
- Sesiones basadas en cookies (7 días de duración)
- Tokens de sesión seguros (32 bytes aleatorios)
- Rate limiting en login (implementado en middleware)
- Límite de cuentas admin (máximo 2)

### Funciones Principales

```typescript
// Hashear contraseña (12 rounds de bcrypt, ~250ms)
hashPassword(password: string): Promise<string>

// Verificar contraseña contra hash
verifyPassword(password: string, hashedPassword: string): Promise<boolean>

// Crear sesión (genera token único de 32 bytes)
createSession(adminId: string): Promise<string>

// Verificar sesión actual desde cookie
verifySession(): Promise<{ adminId: string } | null>

// Destruir sesión (elimina cookie)
destroySession(): Promise<void>

// Autenticar administrador (verifica email y password)
authenticateAdmin(email: string, password: string): Promise<Admin | null>

// Obtener administrador actual desde sesión
getCurrentAdmin(): Promise<Admin | null>

// Verificar si se puede crear más admins (límite configurable)
canCreateAdmin(): Promise<boolean>
```

**Detalles de Implementación**:

**Hashing de Passwords**:
- Algoritmo: bcrypt con 12 rounds (salt rounds)
- Tiempo de hash: ~250ms (balance entre seguridad y UX)
- Salt único por password (generado automáticamente)
- Resistente a rainbow tables y brute force

**Tokens de Sesión**:
- Generados con `crypto.randomBytes(32)` (criptográficamente seguros)
- Convertidos a hex (64 caracteres)
- Almacenados en cookie junto con adminId y expiresAt
- Duración: 7 días desde creación
- No se almacenan en base de datos (stateless)

**Cookies de Sesión**:
- Nombre: `admin_session` (configurable)
- Formato: JSON stringificado con `{ adminId, token, expiresAt }`
- Flags de seguridad: httpOnly, secure (prod), sameSite=strict
- Path: `/` (disponible en toda la aplicación)
- Expiración: 7 días

### Configuración de Cookies

```typescript
{
  httpOnly: true,                              // Previene acceso desde JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS en producción
  sameSite: 'strict',                          // Previene CSRF
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
  path: '/'
}
```

### Flujo de Autenticación

```
1. Usuario ingresa email y password en /portal-interno
2. POST /api/auth/login valida credenciales
3. Sistema busca admin por email en DB
4. Si existe: verifica password con bcrypt.compare()
5. Si válido: createSession() genera token único (32 bytes random)
6. Sistema crea cookie segura con adminId, token y expiresAt
7. Cookie se envía al cliente con flags de seguridad
8. Redirect a /admin (dashboard)
9. Middleware verifica cookie en cada request a /admin/*
10. getCurrentAdmin() obtiene datos del admin desde DB
11. Si sesión expirada o inválida: redirect a /portal-interno
12. Si válido: permite acceso a ruta protegida
```

**Rate Limiting en Login**:
- Máximo 5 intentos fallidos por email
- Lockout de 15 minutos después de 5 intentos
- Contador se resetea después del lockout
- Implementado en memoria (Map)
- Mensaje claro al usuario sobre tiempo de espera

---

## 🛡️ Seguridad

### Puntuación General: 8.5/10 (Producción Ready)

El proyecto ha pasado por un audit de seguridad completo documentado en `.kiro/security-audit-report.md`. La aplicación cumple con los estándares de OWASP Top 10 2021 y está lista para producción.

### Middleware de Seguridad

**Archivo**: `src/middleware.ts`

**Funcionalidades Implementadas**:

1. **Headers de Seguridad** (aplicados a todas las rutas):
   - `X-Frame-Options: DENY` - Previene clickjacking
   - `X-Content-Type-Options: nosniff` - Previene MIME sniffing
   - `X-XSS-Protection: 1; mode=block` - Filtro XSS legacy
   - `Referrer-Policy: strict-origin-when-cross-origin` - Control de referrer
   - `Permissions-Policy` - Deshabilita APIs sensibles (camera, microphone, geolocation)
   - `Strict-Transport-Security` - Fuerza HTTPS (max-age=31536000; includeSubDomains)
   - `Content-Security-Policy` - Políticas detalladas de contenido

2. **Rate Limiting**:
   - `/api/contacto` (POST): 5 requests por minuto por IP
   - `/api/auth/login` (POST): 5 intentos, 15 minutos de lockout
   - Implementado con Map en memoria (resetea con restart del servidor)

3. **Protección de Rutas**:
   - Verifica autenticación en todas las rutas `/admin/*`
   - Redirect a `/portal-interno` si no hay sesión válida
   - Permite acceso público a rutas no protegidas

**Content Security Policy (CSP)**:
```typescript
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: https: blob:
font-src 'self' data:
connect-src 'self' https://www.google-analytics.com
frame-src 'self' https://www.google.com https://www.youtube.com
media-src 'self' blob: data:
```

### Headers de Seguridad (Implementados)

**Archivo**: `src/middleware.ts`

```typescript
'X-Frame-Options': 'DENY'                    // Previene clickjacking
'X-Content-Type-Options': 'nosniff'          // Previene MIME sniffing
'X-XSS-Protection': '1; mode=block'          // Filtro XSS legacy
'Referrer-Policy': 'strict-origin-when-cross-origin'
'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
'Content-Security-Policy': [políticas detalladas]
```

### Rate Limiting

**Implementado en**: `src/middleware.ts`

**Endpoints Protegidos**:

1. **Login** (`/api/auth/login`):
   - Límite: 5 intentos fallidos por email
   - Ventana: 15 minutos
   - Almacenamiento: Map en memoria (por email)
   - Mensaje: "Demasiados intentos de login. Intenta de nuevo en X minutos"
   - Reset: Automático después de 15 minutos

2. **Contacto** (`/api/contacto`):
   - Límite: 5 requests por IP
   - Ventana: 1 minuto (60 segundos)
   - Almacenamiento: Map en memoria (por IP)
   - Mensaje: "Demasiadas solicitudes. Por favor espera un momento"
   - Reset: Automático después de 1 minuto

**Implementación**:
```typescript
// Rate limit para contacto
const contactRateLimit = new Map<string, { count: number; resetTime: number }>()

if (request.nextUrl.pathname === '/api/contacto' && request.method === 'POST') {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  
  const limit = contactRateLimit.get(ip)
  if (limit && now < limit.resetTime) {
    if (limit.count >= 5) {
      return NextResponse.json({ error: 'Demasiadas solicitudes' }, { status: 429 })
    }
    limit.count++
  } else {
    contactRateLimit.set(ip, { count: 1, resetTime: now + 60000 })
  }
}
```

**Limitaciones**:
- Almacenamiento en memoria (se pierde con restart)
- No distribuido (cada instancia tiene su propio contador)
- Para producción con múltiples instancias, considerar Redis

**Mejoras Futuras**:
- Implementar rate limiting con Redis para persistencia
- Rate limiting distribuido para múltiples instancias
- Diferentes límites por rol de usuario
- Whitelist de IPs confiables

### Protección XSS

**Estado**: ✅ Disponible pero deshabilitado por diseño

**Ubicación**: `src/components/editor-js.tsx`

**Configuración Actual**:
```typescript
const ENABLE_HTML_SANITIZATION = false  // Cambiar a true para habilitar
```

**Implementación**:
```typescript
import DOMPurify from 'isomorphic-dompurify'

function renderHTML(html: string): { __html: string } {
  if (ENABLE_HTML_SANITIZATION) {
    return { 
      __html: DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre', 'img', 'video', 'audio', 'source', 'figure', 'figcaption', 'mark', 'u', 's', 'span'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'controls', 'width', 'height', 'target', 'rel'],
        ALLOW_DATA_ATTR: false
      })
    }
  }
  return { __html: html }  // Sin sanitización (actual)
}
```

**Para Habilitar Protección**:
1. Instalar DOMPurify: `npm install isomorphic-dompurify`
2. Cambiar flag a `true` en `editor-js.tsx`
3. Reiniciar servidor de desarrollo
4. Probar con contenido que incluya scripts

**Cuándo Habilitar**:
- Si hay múltiples administradores (> 2)
- Si los administradores no son completamente confiables
- Si hay requisitos de seguridad altos
- Si se implementa sistema de roles con permisos limitados

**Recomendación Actual**: 
- Deshabilitado es aceptable para 2 admins confiables
- Habilitar si se agregan más administradores
- Considerar habilitar antes de producción si hay dudas

### Prevención de SQL Injection

**Estado**: ✅ Protegido automáticamente

**Implementación**:
- Prisma ORM previene SQL injection automáticamente
- No se usan queries SQL raw en ninguna parte del código
- Todas las consultas son parametrizadas y compiladas
- Prisma escapa automáticamente todos los inputs

**Ejemplo de Query Segura**:
```typescript
// ✅ SEGURO - Prisma parametriza automáticamente
await db.service.findMany({
  where: { title: { contains: userInput } }
})

// ❌ INSEGURO - No usado en este proyecto
await db.$executeRaw`SELECT * FROM Service WHERE title = ${userInput}`
```

**Verificación**:
- Búsqueda en código: No hay uso de `$executeRaw` o `$queryRaw`
- Todas las queries usan métodos de Prisma Client
- Inputs de usuario siempre pasan por validación antes de queries

### Validación de Entrada

**Implementado en todos los endpoints**:
- Validación de tipos de datos
- Límites de longitud de strings
- Validación de formato de email
- Sanitización de inputs

**Ejemplo** (`/api/contacto`):
```typescript
function sanitizeInput(input: string, maxLength: number): string {
  return input.trim().substring(0, maxLength)
}

const sanitizedData = {
  name: sanitizeInput(name, 100),
  email: sanitizeInput(email, 100),
  phone: phone ? sanitizeInput(phone, 20) : null,
  message: sanitizeInput(message, 2000),
}
```

### Seguridad en Subida de Archivos

**Archivo**: `src/app/api/upload/route.ts`

**Protecciones Implementadas**:

1. **Validación de MIME Type**:
   - Verifica Content-Type del request
   - Compara con tipos permitidos

2. **Validación de Magic Bytes** (firma del archivo):
   - Lee los primeros bytes del archivo
   - Verifica que coincidan con el tipo declarado
   - Previene archivos maliciosos disfrazados

3. **Límites de Tamaño**:
   - Imágenes: 10 MB
   - Audio: 20 MB
   - Video: 100 MB
   - Configurable por tipo de archivo

4. **Tipos de Archivo Permitidos**:
   - Imágenes: jpg, jpeg, png, gif, webp, svg
   - Audio: mp3, wav, ogg
   - Video: mp4, webm, mov

5. **Nombres de Archivo Seguros**:
   - Generados por servidor (timestamp + random)
   - Previene path traversal
   - Formato: `{timestamp}-{random}.{ext}`

6. **Validación de Path en Eliminación**:
   - Verifica que path comience con `/uploads/`
   - Usa `path.join()` para normalización
   - Previene eliminación de archivos fuera de uploads

**Magic Bytes Validados**:
```typescript
const magicBytes = {
  'image/jpeg': ['ffd8ff'],
  'image/png': ['89504e47'],
  'image/gif': ['474946'],
  'image/webp': ['52494646'],
  'audio/mpeg': ['494433', 'fffb'],
  'video/mp4': ['66747970'],
  // ... más tipos
}
```

**Flujo de Validación**:
```
1. Recibir archivo del cliente
2. Validar MIME type declarado
3. Leer primeros bytes del archivo
4. Comparar con magic bytes esperados
5. Si no coincide → rechazar (400 Bad Request)
6. Validar tamaño del archivo
7. Generar nombre seguro
8. Guardar en /public/uploads/ o Cloudinary
9. Retornar URL al cliente
```

---

## 🔌 API Endpoints

### Endpoints Públicos

#### GET /api/config
Obtiene configuración general del sitio (pública).

**Response**:
```json
{
  "siteName": "Green Axis S.A.S.",
  "siteSlogan": "Comprometidos con el medio ambiente",
  "siteDescription": "Servicios ambientales integrales",
  "logoUrl": "https://...",
  "whatsappNumber": "+573001234567",
  "whatsappMessage": "¡Hola! Me gustaría...",
  "facebookUrl": "https://facebook.com/...",
  "instagramUrl": "https://instagram.com/...",
  "primaryColor": "#6BBE45",
  "aboutTitle": "Comprometidos con el futuro del planeta",
  "aboutDescription": "...",
  "aboutStats": "[{\"value\":\"500+\",\"label\":\"Clientes\"}]",
  "googleMapsEmbed": "<iframe src='...'></iframe>",
  "showMapSection": true
}
```

**Uso**: Cargado en layout principal para configuración global del sitio.

#### GET /api/servicios
Lista servicios activos ordenados.

**Query params**: Ninguno

**Response**:
```json
[
  {
    "id": "clx...",
    "title": "Consultoría Ambiental",
    "description": "Asesoría especializada...",
    "content": "Contenido detallado en markdown...",
    "icon": "Leaf",
    "imageUrl": "https://res.cloudinary.com/...",
    "order": 0,
    "active": true,
    "featured": true,
    "createdAt": "2026-03-01T...",
    "updatedAt": "2026-03-12T..."
  }
]
```

**Filtros Aplicados**: Solo servicios con `active: true`, ordenados por `order` ASC.

#### GET /api/noticias
Lista noticias publicadas con paginación.

**Query params**:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Items por página (default: 6, max: 50)

**Response**:
```json
{
  "news": [
    {
      "id": "clx...",
      "title": "Nueva certificación ISO 14001",
      "slug": "nueva-certificacion-iso-14001",
      "excerpt": "Nos complace anunciar...",
      "imageUrl": "https://...",
      "author": "Green Axis Team",
      "publishedAt": "2026-03-10T...",
      "featured": true
    }
  ],
  "total": 15,
  "pages": 3,
  "currentPage": 1
}
```

**Filtros Aplicados**: Solo noticias con `published: true`, ordenadas por `publishedAt` DESC.

#### POST /api/contacto
Envía mensaje de contacto (rate limited).

**Body**:
```json
{
  "name": "string (2-100 chars)",
  "email": "string (formato email válido)",
  "phone": "string (opcional, max 20 chars)",
  "company": "string (opcional, max 100 chars)",
  "subject": "string (opcional, max 200 chars)",
  "message": "string (10-2000 chars)",
  "consent": true
}
```

**Validaciones**:
- Nombre: requerido, 2-100 caracteres
- Email: requerido, formato válido
- Mensaje: requerido, 10-2000 caracteres
- Consentimiento: requerido (true)

**Rate limit**: 5 requests por minuto por IP

**Response Success** (200):
```json
{
  "success": true,
  "message": "Mensaje enviado correctamente"
}
```

**Response Error** (400/429/500):
```json
{
  "error": "Mensaje de error descriptivo"
}
```

### Endpoints de Administración

Todos requieren autenticación (cookie de sesión válida). Retornan 401 si no hay sesión.

#### PUT /api/admin/config
Actualiza configuración general del sitio.

**Body**: Objeto con campos de PlatformConfig (parcial o completo)

**Ejemplo**:
```json
{
  "siteName": "Green Axis S.A.S.",
  "siteSlogan": "Nuevo slogan",
  "primaryColor": "#6BBE45",
  "whatsappNumber": "+573001234567"
}
```

**Response**: Configuración actualizada completa

**⚠️ Bug**: No invalida caché automáticamente

#### POST/PUT/DELETE /api/servicios
CRUD de servicios.

**POST** - Crear servicio:
```json
{
  "title": "Nuevo Servicio",
  "description": "Descripción corta",
  "content": "Contenido detallado en markdown",
  "icon": "Leaf",
  "imageUrl": "https://...",
  "order": 0,
  "active": true,
  "featured": false
}
```

**PUT** - Actualizar servicio:
```json
{
  "id": "clx...",
  "title": "Título actualizado",
  ...
}
```

**DELETE** - Eliminar servicio:
```json
{
  "id": "clx..."
}
```

**⚠️ Bug**: No invalida caché automáticamente

#### POST/PUT/DELETE /api/noticias
CRUD de noticias.

**POST** - Crear noticia:
```json
{
  "title": "Nueva Noticia",
  "slug": "nueva-noticia",  // Auto-generado si no se provee
  "excerpt": "Resumen corto",
  "content": "Contenido markdown (fallback)",
  "blocks": "{\"blocks\":[...]}",  // Editor.js JSON
  "imageUrl": "https://...",
  "author": "Green Axis Team",
  "published": true,
  "featured": false,
  "showCoverInContent": true,
  "imageCaption": "Descripción de imagen"
}
```

**PUT** - Actualizar noticia (similar a POST con id)

**DELETE** - Eliminar noticia (requiere id)

**⚠️ Bug**: No invalida caché automáticamente

#### POST/PUT/DELETE /api/carrusel
CRUD de slides del carrusel.

**POST** - Crear slide:
```json
{
  "title": "Título del slide",
  "subtitle": "Subtítulo",
  "description": "Descripción",
  "imageUrl": "https://...",
  "buttonText": "Ver más",
  "buttonUrl": "/servicios",
  "linkUrl": "/servicios",  // Link de toda la imagen
  "gradientEnabled": true,
  "animationEnabled": true,
  "gradientColor": "000000",  // Hex sin #
  "order": 0,
  "active": true
}
```

**PUT** - Actualizar slide (similar a POST con id)

**DELETE** - Eliminar slide (requiere id)

**⚠️ Bug**: No invalida caché automáticamente

#### PUT /api/legal
Actualiza páginas legales (términos, privacidad).

**Body**:
```json
{
  "slug": "terminos",  // o "privacidad"
  "title": "Términos y Condiciones",
  "content": "Contenido markdown (fallback)",
  "blocks": "{\"blocks\":[...]}",  // Editor.js JSON
  "manualDate": "Marzo 12, 2026"  // Fecha manual (opcional)
}
```

**Response**: Página legal actualizada

**⚠️ Bug**: No invalida caché automáticamente

#### GET /api/about
Obtiene contenido completo de página "About" (público).

**Response**: Objeto AboutPage con todos los campos

#### PUT /api/about
Actualiza contenido de página "About" (admin).

**Body**: Objeto AboutPage (parcial o completo)

**⚠️ Bug**: No invalida caché automáticamente

#### GET/POST/DELETE /api/admin/images
Gestión de imágenes del sitio (legacy, migrado a /api/admin/media).

**GET** - Listar imágenes por categoría:
```
GET /api/admin/images?category=hero
```

**POST** - Registrar nueva imagen (después de upload):
```json
{
  "key": "hero-1",
  "label": "Imagen Hero Principal",
  "description": "Imagen de fondo del carrusel",
  "url": "https://res.cloudinary.com/...",
  "alt": "Descripción de imagen",
  "category": "hero"
}
```

**DELETE** - Eliminar imagen:
```json
{
  "id": "clx..."
}
```

**Nota**: Este endpoint está siendo reemplazado por `/api/admin/media` que ofrece más funcionalidades.

#### GET /api/admin/media
Lista archivos de la biblioteca de medios con filtros avanzados.

**Query params**:
- `category` (opcional): Filtrar por categoría (hero, services, news, gallery, general)
- `type` (opcional): Filtrar por tipo MIME (image/*, audio/*, video/*)
- `search` (opcional): Buscar en label y description
- `limit` (opcional): Número de resultados (default: 50)
- `offset` (opcional): Offset para paginación

**Response**:
```json
{
  "media": [
    {
      "id": "clx...",
      "label": "Logo de la empresa",
      "description": "Logo principal en formato PNG",
      "url": "https://res.cloudinary.com/...",
      "alt": "Logo Green Axis",
      "category": "general",
      "mimeType": "image/png",
      "fileSize": 45678,
      "width": 800,
      "height": 600,
      "hash": "abc123...",
      "createdAt": "2026-03-12T10:00:00Z",
      "updatedAt": "2026-03-12T10:00:00Z"
    }
  ],
  "total": 25,
  "hasMore": false
}
```

#### POST /api/admin/media
Registra nuevo archivo en la biblioteca después de upload.

**Body**:
```json
{
  "label": "Imagen de servicio",
  "description": "Foto de consultoría ambiental",
  "url": "https://res.cloudinary.com/...",
  "alt": "Consultoría ambiental",
  "category": "services",
  "mimeType": "image/jpeg",
  "fileSize": 123456,
  "width": 1920,
  "height": 1080,
  "hash": "sha256_hash_here"
}
```

**Detección de Duplicados**:
Si el hash ya existe en la biblioteca, retorna:
```json
{
  "duplicate": true,
  "existingMedia": {
    "id": "clx...",
    "label": "Archivo existente",
    "url": "https://...",
    ...
  }
}
```

**Response Success**:
```json
{
  "success": true,
  "media": {
    "id": "clx...",
    "label": "Imagen de servicio",
    ...
  }
}
```

#### PUT /api/admin/media/:id
Actualiza metadatos de un archivo existente.

**Body**:
```json
{
  "label": "Nuevo nombre",
  "description": "Nueva descripción",
  "alt": "Nuevo texto alternativo",
  "category": "news"
}
```

**Response**:
```json
{
  "success": true,
  "media": {
    "id": "clx...",
    "label": "Nuevo nombre",
    ...
  }
}
```

#### DELETE /api/admin/media/:id
Elimina archivo de la biblioteca con verificación de referencias.

**Query params**:
- `force` (opcional): "true" para forzar eliminación incluso si está en uso

**Proceso de Eliminación**:
1. Verifica si el archivo está siendo usado (servicios, noticias, carrusel, config)
2. Si está en uso y no es forzado: retorna lista de referencias
3. Si no está en uso o es forzado: elimina de Cloudinary y base de datos
4. Si es forzado: limpia referencias en otros registros

**Response - Archivo en Uso** (sin force):
```json
{
  "success": false,
  "deleted": false,
  "message": "Este archivo está siendo usado en 3 lugares",
  "references": [
    {
      "table": "Service",
      "id": "clx...",
      "field": "imageUrl",
      "displayName": "Consultoría Ambiental"
    },
    {
      "table": "News",
      "id": "clx...",
      "field": "imageUrl",
      "displayName": "Nueva certificación ISO"
    }
  ]
}
```

**Response - Eliminación Exitosa**:
```json
{
  "success": true,
  "deleted": true,
  "message": "Archivo eliminado correctamente"
}
```

**Nota Importante**: La eliminación también borra el archivo de Cloudinary automáticamente, intentando con diferentes tipos de recursos (image, video, raw) para asegurar la eliminación completa.

#### GET /api/admin/media/check-references
Verifica dónde se está usando un archivo específico.

**Query params**:
- `url` (requerido): URL del archivo a verificar

**Response**:
```json
{
  "inUse": true,
  "references": [
    {
      "table": "Service",
      "id": "clx...",
      "field": "imageUrl",
      "displayName": "Consultoría Ambiental",
      "url": "/admin/servicios"
    },
    {
      "table": "CarouselSlide",
      "id": "clx...",
      "field": "imageUrl",
      "displayName": "Slide 1",
      "url": "/admin/carrusel"
    }
  ]
}
```

**Tablas Verificadas**:
- Service (imageUrl)
- News (imageUrl, blocks de Editor.js)
- CarouselSlide (imageUrl)
- PlatformConfig (logoUrl, faviconUrl, aboutImageUrl)
- AboutPage (heroImageUrl, historyImageUrl, teamMembers, certificationsContent)
- LegalPage (blocks de Editor.js)

#### GET /api/admin/mensajes
Lista mensajes de contacto (solo lectura, admin).

**Query params**:
- `unreadOnly` (opcional): "true" para solo no leídos

**Response**:
```json
[
  {
    "id": "clx...",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "+573001234567",
    "company": "Empresa XYZ",
    "subject": "Consulta sobre servicios",
    "message": "Me gustaría información sobre...",
    "consent": true,
    "read": false,
    "createdAt": "2026-03-12T10:30:00Z"
  }
]
```

**Funcionalidad**: Marcar como leído se hace con PUT al mismo endpoint.

### Endpoints de Autenticación

#### POST /api/auth/login
Autentica administrador y crea sesión.

**Body**:
```json
{
  "email": "admin@greenaxis.com",
  "password": "password123"
}
```

**Validaciones**:
- Email: formato válido
- Password: mínimo 8 caracteres
- Rate limiting: 5 intentos, 15 min lockout

**Response Success** (200):
```json
{
  "success": true,
  "admin": {
    "id": "clx...",
    "email": "admin@greenaxis.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

**Response Error** (401):
```json
{
  "error": "Credenciales inválidas"
}
```

**Response Rate Limited** (429):
```json
{
  "error": "Demasiados intentos. Intenta de nuevo en X minutos"
}
```

**Side Effects**: Crea cookie `admin_session` con token de sesión.

#### POST /api/auth/logout
Cierra sesión del administrador.

**Body**: Ninguno (usa cookie)

**Response** (200):
```json
{
  "success": true
}
```

**Side Effects**: Elimina cookie `admin_session`.

#### GET /api/auth/check
Verifica si hay sesión activa.

**Response** (200):
```json
{
  "authenticated": true,
  "admin": {
    "id": "clx...",
    "email": "admin@greenaxis.com",
    "name": "Admin Name",
    "role": "admin"
  }
}
```

**Response No Autenticado** (200):
```json
{
  "authenticated": false
}
```

**Uso**: Verificar estado de autenticación en cliente.

#### POST /api/auth/setup
Crea primer administrador (solo si no existe ninguno).

**Body**:
```json
{
  "email": "admin@greenaxis.com",
  "password": "securepassword123",
  "name": "Admin Name"
}
```

**Validaciones**:
- Solo funciona si no hay admins en DB
- Email: formato válido, único
- Password: mínimo 8 caracteres
- Nombre: opcional

**Response Success** (200):
```json
{
  "success": true,
  "admin": {
    "id": "clx...",
    "email": "admin@greenaxis.com",
    "name": "Admin Name"
  }
}
```

**Response Error** (400):
```json
{
  "error": "Ya existe un administrador"
}
```

**Side Effects**: Crea admin y hace login automático (crea sesión).

#### POST /api/auth/reset-password
Solicita recuperación de contraseña (envía email).

**Body**:
```json
{
  "email": "admin@greenaxis.com"
}
```

**Proceso**:
1. Verifica que email existe en DB
2. Genera token único (UUID v4)
3. Guarda token en DB con expiración de 1 hora
4. Envía email vía Resend con link de recuperación
5. Link: `/portal-interno/restablecer?token=...`

**Response Success** (200):
```json
{
  "success": true,
  "message": "Se ha enviado un email con instrucciones"
}
```

**Response Error** (404):
```json
{
  "error": "Email no encontrado"
}
```

**Seguridad**: Siempre retorna success (no revela si email existe) para prevenir enumeración.

#### POST /api/auth/delete-account
Elimina cuenta de administrador (requiere autenticación).

**Body**:
```json
{
  "password": "currentpassword"
}
```

**Validaciones**:
- Requiere sesión activa
- Verifica password actual
- No permite eliminar si es el único admin

**Response Success** (200):
```json
{
  "success": true,
  "message": "Cuenta eliminada correctamente"
}
```

**Response Error** (400/401):
```json
{
  "error": "No puedes eliminar el único administrador"
}
```

**Side Effects**: Elimina admin de DB y destruye sesión.

### Endpoint de Upload

#### POST /api/upload
Sube archivo (imagen, audio o video).

**Content-Type**: `multipart/form-data`

**Body** (FormData):
- `file`: Archivo a subir

**Validaciones**:
- **MIME Type**: Verifica Content-Type
- **Magic Bytes**: Verifica firma del archivo
- **Tamaño**: 
  - Imágenes: max 10 MB
  - Audio: max 20 MB
  - Video: max 100 MB
- **Tipos Permitidos**:
  - Imágenes: jpg, jpeg, png, gif, webp, svg
  - Audio: mp3, wav, ogg
  - Video: mp4, webm, mov

**Response Success** (200):
```json
{
  "url": "/uploads/1773106817688-abc123.png",
  "filename": "1773106817688-abc123.png"
}
```

**Response Error** (400):
```json
{
  "error": "Tipo de archivo no permitido"
}
```

**Almacenamiento**:
- Desarrollo: `/public/uploads/` (local)
- Producción: Cloudinary (configurar en código)

**Seguridad**:
- Nombre generado por servidor (timestamp + random)
- Validación de magic bytes previene archivos maliciosos
- Path traversal prevenido

#### DELETE /api/upload
Elimina archivo subido.

**Query params**:
- `url`: URL del archivo a eliminar (ej: `/uploads/file.png`)

**Validaciones**:
- URL debe comenzar con `/uploads/`
- Path traversal prevenido con `path.join()`

**Response Success** (200):
```json
{
  "success": true,
  "message": "Archivo eliminado"
}
```

**Response Error** (400/404):
```json
{
  "error": "Archivo no encontrado"
}
```

**Nota**: Solo elimina archivos locales. Para Cloudinary, usar API de Cloudinary.

---

## 🎨 Componentes Principales

### Componentes Interactivos con Drag & Drop

**Tecnología**: @dnd-kit (core + sortable + utilities)

**Implementado en**:
- `/admin/servicios` - Reordenar servicios arrastrando
- `/admin/carrusel` - Reordenar slides del carrusel
- Actualización automática del campo `order` en base de datos
- Feedback visual durante el arrastre
- Compatible con touch (móviles y tablets)

**Uso**:
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

// Componente con drag & drop para reordenar items
```

### Componentes de Página


### Componentes de Página

- `hero-carousel.tsx` - Carrusel principal con animaciones y gradientes configurables
  - Embla Carousel para transiciones suaves
  - Framer Motion para animaciones de zoom
  - Autoplay con pausa en hover
  - Indicadores de navegación (dots)
  - Botones prev/next
  - Gradientes personalizables por slide
  - Responsive con aspect ratio adaptativo
  
- `services-section.tsx` - Sección de servicios destacados en home
  - Grid responsive (1→2→3 columnas)
  - Cards con hover effects
  - Iconos de Lucide React
  - Link a página de servicios completa
  
- `news-section.tsx` - Sección de noticias recientes en home
  - Últimas 3 noticias destacadas
  - Cards con imagen, título y excerpt
  - Fecha de publicación formateada
  - Link a detalle de noticia
  
- `about-section.tsx` - Sección "About" resumida en home
  - Configurable desde PlatformConfig
  - Estadísticas animadas
  - Features con iconos
  - Imagen destacada
  - Badge personalizable
  
- `cta-section.tsx` - Call-to-action section
  - Fondo con gradiente
  - Botón destacado
  - Texto personalizable
  
- `map-section.tsx` - Mapa de Google embebido
  - Iframe responsive
  - Lazy loading
  - Aspect ratio 16:9
  - Mostrar/ocultar desde config
  
- `social-feed-section.tsx` - Feeds de redes sociales (Facebook, Instagram)
  - Embeds de plataformas sociales
  - Configurable desde admin
  - Lazy loading
  
- `whatsapp-bubble.tsx` - Botón flotante de WhatsApp con modal
  - Fixed position (bottom-right)
  - Modal con mensaje editable
  - Animación de entrada
  - Icono animado
  
- `header.tsx` - Navegación principal responsive
  - Menú hamburguesa en móvil
  - Navegación completa en desktop
  - Logo con link a home
  - Toggle de tema
  - Sticky en scroll
  
- `footer.tsx` - Footer con links, redes sociales y mapa del sitio
  - Links a páginas principales
  - Iconos de redes sociales (solo si hay URL)
  - Copyright dinámico
  - Responsive en 3 columnas
  
- `theme-toggle.tsx` - Selector de tema claro/oscuro
  - Icono de sol/luna
  - Transición suave
  - Persistencia automática
  
- `theme-provider.tsx` - Provider de next-themes
  - Envuelve toda la aplicación
  - Previene flash de contenido incorrecto
  - Detección de preferencia del sistema

### Componentes de Contenido

- `services-page-content.tsx` - Página completa de servicios con grid responsive
  - Grid adaptativo (1→2→3 columnas)
  - Cards con imagen, título, descripción
  - Iconos de Lucide React
  - Hover effects y transiciones
  - Ordenamiento por campo `order`
  
- `news-page-content.tsx` - Listado de noticias con paginación
  - Paginación con botones prev/next
  - 6 noticias por página (configurable)
  - Cards con imagen, título, excerpt, fecha
  - Filtrado de noticias publicadas
  - Ordenamiento por fecha (más recientes primero)
  
- `news-detail-content.tsx` - Detalle de noticia individual con renderizado de Editor.js
  - Imagen de portada con caption opcional
  - Renderizado de blocks de Editor.js
  - Metadata (autor, fecha)
  - Botón de volver a listado
  - Compartir en redes sociales (futuro)
  
- `about-page-content.tsx` - Página completa "Quiénes Somos" con todas las secciones
  - Hero section con imagen
  - Historia con imagen y contenido markdown
  - Misión y Visión en cards
  - Valores con iconos (grid responsive)
  - Equipo con fotos y bios (opcional)
  - Por qué elegirnos con features
  - Estadísticas animadas
  - Certificaciones (opcional)
  - CTA final con botón
  - Sección de ubicación con mapa
  
- `contact-page-content.tsx` - Formulario de contacto con validación y rate limiting
  - React Hook Form para gestión de formulario
  - Validación en tiempo real
  - Mensajes de error claros
  - Checkbox de consentimiento (HABEAS DATA)
  - Rate limiting (5 envíos por minuto)
  - Toast de confirmación/error
  - Campos: nombre, email, teléfono, empresa, asunto, mensaje
  
- `legal-page-content.tsx` - Páginas legales con renderizado de Editor.js
  - Renderizado de blocks de Editor.js
  - Fecha de última actualización (manual o automática)
  - Tabla de contenidos (futuro)
  - Impresión optimizada

### Componentes de Biblioteca de Medios

- `media-library-browser.tsx` - Navegador principal de biblioteca de medios
  - Grid responsive con cards de archivos
  - Filtrado por categoría (hero, services, news, gallery, general)
  - Búsqueda por label y description
  - Upload de archivos con drag & drop
  - Preview de imágenes, audio y video
  - Paginación automática
  - Indicadores de archivos en uso
  - Acciones: editar metadatos, eliminar, copiar URL
  
- `media-card.tsx` - Card individual de archivo multimedia
  - Preview según tipo de archivo:
    - Imágenes: thumbnail optimizado
    - Audio: icono con indicador de duración
    - Video: thumbnail con indicador de duración
  - Información: label, tamaño, dimensiones
  - Badge de categoría
  - Indicador visual si está en uso
  - Menú de acciones (editar, eliminar, copiar URL)
  - Modal de edición de metadatos
  - Confirmación antes de eliminar
  - Muestra referencias si está en uso
  
- `media-picker.tsx` - Selector modal de archivos para formularios
  - Modal fullscreen responsive
  - Tabs: "Biblioteca" y "Subir Nuevo"
  - Navegación por biblioteca existente
  - Upload directo con validación
  - Detección de duplicados en tiempo real
  - Filtrado por tipo de archivo (imágenes, audio, video)
  - Búsqueda y filtrado por categoría
  - Preview antes de seleccionar
  - Callback con archivo seleccionado
  
- `image-selector.tsx` - Selector de imágenes (legacy, migrado a media-picker)
  - Preview en tiempo real
  - Drag & drop para subir
  - Integración con Cloudinary
  - Validación de tipos de archivo
  - Nota: Se recomienda usar `media-picker` para nuevos desarrollos
  - Grid adaptativo (1→2→3 columnas)
  - Cards con imagen, título, descripción
  - Iconos de Lucide React
  - Hover effects y transiciones
  - Ordenamiento por campo `order`
  
- `news-page-content.tsx` - Listado de noticias con paginación
  - Paginación con botones prev/next
  - 6 noticias por página (configurable)
  - Cards con imagen, título, excerpt, fecha
  - Filtrado de noticias publicadas
  - Ordenamiento por fecha (más recientes primero)
  
- `news-detail-content.tsx` - Detalle de noticia individual con renderizado de Editor.js
  - Imagen de portada con caption opcional
  - Renderizado de blocks de Editor.js
  - Metadata (autor, fecha)
  - Botón de volver a listado
  - Compartir en redes sociales (futuro)
  
- `about-page-content.tsx` - Página completa "Quiénes Somos" con todas las secciones
  - Hero section con imagen
  - Historia con imagen y contenido markdown
  - Misión y Visión en cards
  - Valores con iconos (grid responsive)
  - Equipo con fotos y bios (opcional)
  - Por qué elegirnos con features
  - Estadísticas animadas
  - Certificaciones (opcional)
  - CTA final con botón
  - Sección de ubicación con mapa
  
- `contact-page-content.tsx` - Formulario de contacto con validación y rate limiting
  - React Hook Form para gestión de formulario
  - Validación en tiempo real
  - Mensajes de error claros
  - Checkbox de consentimiento (HABEAS DATA)
  - Rate limiting (5 envíos por minuto)
  - Toast de confirmación/error
  - Campos: nombre, email, teléfono, empresa, asunto, mensaje
  
- `legal-page-content.tsx` - Páginas legales con renderizado de Editor.js
  - Renderizado de blocks de Editor.js
  - Fecha de última actualización (manual o automática)
  - Tabla de contenidos (futuro)
  - Impresión optimizada

### Componentes de Layout

- `header.tsx` - Navegación principal con menú responsive y modo oscuro
  - Logo con link a home
  - Navegación con links a todas las páginas
  - Menú hamburguesa en móvil (< md)
  - Toggle de tema (sol/luna)
  - Sticky header en scroll
  - Backdrop blur en scroll
  - Animaciones suaves con Framer Motion
  
- `footer.tsx` - Footer con links, redes sociales y mapa del sitio
  - 3 columnas responsive (1→2→3)
  - Links a páginas principales
  - Iconos de redes sociales (solo si hay URL configurada)
  - Copyright dinámico con año actual
  - Texto personalizable desde config
  - Separador visual
  
- `public-layout.tsx` - Layout para sitio público (header + children + footer)
  - Estructura consistente en todas las páginas públicas
  - WhatsApp bubble incluido
  - Google Analytics incluido
  - Theme provider
  
- `admin-layout.tsx` - Layout para panel admin con sidebar de navegación
  - Sidebar con links a todas las secciones admin
  - Indicador de sección activa
  - Botón de logout
  - Información del admin actual
  - Responsive (sidebar colapsable en móvil)
  
- `google-analytics.tsx` - Script de Google Tag Manager
  - Carga condicional (solo si hay ID configurado)
  - Script de gtag.js
  - Tracking de pageviews automático
  - Compatible con CSP
  
- `analytics-loader.tsx` - Carga condicional de analytics
  - Verifica si hay ID de Google Analytics
  - Carga script solo en producción (opcional)
  - No bloquea renderizado de página

### Componentes de Editor

- `editor-js.tsx` - Wrapper de Editor.js con todas las herramientas configuradas
  - Soporte para 15+ herramientas de edición
  - Sanitización HTML opcional con DOMPurify
  - Internacionalización con `editorjs-i18n.json`
  - Upload de imágenes, audio y video
  - Renderizado de blocks a HTML
- `editor-js-header-tools.ts` - Herramientas de encabezado con colores personalizables
- `editor-js-color-tool.ts` - Herramienta de color de texto
- `editor-js-marker-tool.ts` - Herramienta de marcador/resaltado
- `editor-js-strikethrough-tool.ts` - Herramienta de tachado
- `editor-js-audio-tool.ts` - Herramienta de audio (upload y reproducción HTML5)
- `editor-js-video-tool.ts` - Herramienta de video (upload y reproducción HTML5)
- `image-selector.tsx` - Selector de imágenes con preview, upload y gestión
  - Preview en tiempo real
  - Drag & drop para subir
  - Integración con Cloudinary
  - Validación de tipos de archivo

### Componentes UI (shadcn/ui)

Más de 30 componentes reutilizables en `src/components/ui/`:
- **Buttons & Inputs**: Button, Input, Textarea, Label
- **Forms**: Form, Select, Checkbox, Radio Group, Switch, Slider
- **Layout**: Card, Separator, Aspect Ratio, Scroll Area, Resizable
- **Navigation**: Tabs, Accordion, Menubar, Navigation Menu, Command
- **Overlays**: Dialog, Alert Dialog, Popover, Tooltip, Hover Card, Drawer (Vaul)
- **Feedback**: Toast (Sonner), Progress, Badge, Avatar
- **Data**: Table (TanStack Table), Calendar, Date Picker
- **Utilities**: Toggle, Toggle Group, Collapsible

Todos basados en Radix UI con estilos de Tailwind CSS y completamente accesibles (ARIA).

**Características**:
- Totalmente personalizables con Tailwind
- Accesibilidad integrada (WCAG 2.1)
- Soporte para teclado y screen readers
- Animaciones suaves con Tailwind Animate
- Variantes de color y tamaño
- Modo oscuro/claro automático

---

## ⚙️ Configuración y Variables de Entorno

### Variables Requeridas

```bash
# Base de Datos
DATABASE_URL="file:./db/custom.db"              # SQLite local (desarrollo)
TURSO_DATABASE_URL="libsql://tu-db.turso.io"    # Turso (producción)
TURSO_AUTH_TOKEN="tu_token_aqui"                # Token de autenticación Turso

# Cloudinary (Gestión de Imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu_cloud_name"  # Variable pública para cliente

# Resend (Envío de Emails)
RESEND_API_KEY="re_tu_resend_api_key"
RESEND_FROM_EMAIL="noreply@tudominio.com"       # Email verificado en Resend

# Configuración de Aplicación
MAX_ADMIN_ACCOUNTS=2                            # Límite de cuentas admin (default: 2)
NODE_ENV="production"                           # Entorno (development/production)

# Opcional - Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"                # Google Analytics ID
```

**Notas Importantes**:
- `DATABASE_URL` se usa en desarrollo (SQLite local)
- `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` se usan en producción
- Todas las variables `NEXT_PUBLIC_*` son accesibles desde el cliente
- `RESEND_FROM_EMAIL` debe estar verificado en Resend
- `MAX_ADMIN_ACCOUNTS` controla el límite de cuentas (default: 2 si no se especifica)

### Obtención de Credenciales

**Turso**:
```bash
# Instalar CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Autenticarse
turso auth login

# Crear base de datos
turso db create greenaxis

# Obtener URL
turso db show greenaxis --url

# Crear token
turso db tokens create greenaxis
```

**Cloudinary**:
1. Crear cuenta en https://cloudinary.com/
2. Ir al Dashboard
3. Copiar credenciales de "Account Details"

**Resend**:
1. Crear cuenta en https://resend.com/
2. Crear API Key en el dashboard
3. Verificar dominio de email

---

## 🚀 Despliegue

### Opciones de Despliegue

**1. Vercel (Recomendado para Next.js)**:
- Integración nativa con Next.js
- Configuración automática
- Preview deployments en cada PR
- Edge functions automáticas
- Analytics integrado

**2. Railway**:
- Soporte excelente para Turso
- Fácil configuración de variables
- Despliegue automático desde Git
- Logs en tiempo real

**3. VPS con Caddy (Configurado)**:
- Control total del servidor
- Caddy como reverse proxy (puerto 81)
- Configuración en `Caddyfile`
- HTTPS automático con Let's Encrypt
- Proxy a localhost:3000 (Next.js)

**4. Docker (Preparado)**:
- `.dockerignore` configurado
- Output standalone compatible con Docker
- Requiere Dockerfile (no incluido actualmente)
- Recomendado para despliegue en Kubernetes o Docker Swarm

**Ejemplo de Dockerfile** (para crear):
```dockerfile
FROM node:18-alpine AS base

# Instalar dependencias
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build de aplicación
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Imagen de producción
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiar archivos necesarios
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Build y Run**:
```bash
# Build de imagen
docker build -t greenaxis:latest .

# Run de contenedor
docker run -p 3000:3000 --env-file .env greenaxis:latest
```

### Configuración de Caddy

**Archivo**: `Caddyfile`

**Características**:
- Escucha en puerto 81
- Reverse proxy a localhost:3000 (Next.js)
- Headers de forwarding (X-Forwarded-For, X-Real-IP)
- Soporte para transformación de puerto con query param
- HTTPS automático (cuando se configura dominio)

**Uso**:
```bash
# Iniciar Caddy
caddy run --config Caddyfile

# O como servicio
caddy start --config Caddyfile
```

**Configuración con Dominio**:
```caddyfile
tudominio.com {
  reverse_proxy localhost:3000
}
```

### Preparación

1. **Actualizar .gitignore**:
```gitignore
extra/
.kiro/
.vscode/
scripts/
README.md
public/uploads/
public/logo.svg
.z
```

2. **Configurar variables de entorno** en el servidor de producción

3. **Verificar package.json**:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log"
  }
}
```

### Proceso de Build

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente Prisma
npx prisma generate

# 3. Build de Next.js (genera output standalone)
npm run build

# 4. Verificar output
ls .next/standalone
# Debe contener: server.js, package.json, node_modules/, .next/

# 5. Copiar archivos estáticos (Next.js lo hace automáticamente)
# .next/standalone/public/ - Archivos públicos
# .next/standalone/.next/static/ - Assets estáticos

# 6. Iniciar servidor
npm run start
# O directamente: bun .next/standalone/server.js
```

**Output Standalone**:
- Contiene todo lo necesario para ejecutar la aplicación
- Incluye solo dependencias de producción
- Tamaño reducido (~50% vs node_modules completo)
- Servidor Node.js independiente
- No requiere instalación adicional en servidor

**Verificación de Build**:
```bash
# Verificar que el build fue exitoso
ls -la .next/standalone/server.js

# Probar servidor localmente
NODE_ENV=production node .next/standalone/server.js

# Verificar que responde
curl http://localhost:3000
```

### Configuración de Next.js

**Archivo**: `next.config.ts`

```typescript
{
  output: "standalone",           // Genera servidor independiente optimizado para producción
  typescript: {
    ignoreBuildErrors: true       // Ignora errores de TS en build (útil para despliegue rápido)
  },
  reactStrictMode: false,         // Deshabilitado para compatibilidad con algunas librerías
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.unsplash.com' }
      // Nota: Cloudinary se agrega dinámicamente si se usa
    ]
  }
}
```

**Características del Output Standalone**:
- Bundle optimizado con solo las dependencias necesarias
- Servidor Node.js independiente en `.next/standalone/`
- Reduce tamaño de despliegue significativamente
- Compatible con Docker y VPS
- Incluye todas las dependencias necesarias

### Migraciones de Base de Datos

**Desarrollo**:
```bash
npx prisma db push
```

**Producción**:
```bash
npx prisma migrate deploy
```

### Plataformas de Hosting Recomendadas

**1. Vercel** (Más Fácil):
- ✅ Integración nativa con Next.js
- ✅ Configuración automática de build
- ✅ Preview deployments en cada PR
- ✅ Edge functions automáticas
- ✅ Analytics integrado
- ✅ SSL automático
- ⚠️ Límites en plan gratuito (100 GB bandwidth)

**Configuración**:
1. Conectar repositorio de Git
2. Configurar variables de entorno
3. Deploy automático en cada push

**2. Railway** (Recomendado para Turso):
- ✅ Soporte excelente para Turso
- ✅ Fácil configuración de variables
- ✅ Despliegue automático desde Git
- ✅ Logs en tiempo real
- ✅ Escalado automático
- ⚠️ Costo por uso (después de créditos gratuitos)

**Configuración**:
1. Crear proyecto en Railway
2. Conectar repositorio
3. Configurar variables de entorno
4. Deploy automático

**3. VPS con Caddy** (Máximo Control):
- ✅ Control total del servidor
- ✅ Caddy como reverse proxy (configurado en `Caddyfile`)
- ✅ HTTPS automático con Let's Encrypt
- ✅ Sin límites de bandwidth
- ✅ Logs completos en servidor
- ⚠️ Requiere más configuración
- ⚠️ Mantenimiento manual del servidor

**Configuración Completa en VPS**:

```bash
# 1. Preparar servidor (Ubuntu 22.04+)
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Instalar Bun (opcional, para mejor performance)
curl -fsSL https://bun.sh/install | bash

# 4. Instalar Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy

# 5. Clonar repositorio
cd /var/www
sudo git clone <repo-url> greenaxis
cd greenaxis

# 6. Configurar variables de entorno
sudo nano .env
# Pegar variables de producción

# 7. Instalar dependencias y build
npm install
npx prisma generate
npm run build

# 8. Configurar Caddy con dominio
sudo nano /etc/caddy/Caddyfile
```

**Caddyfile para Producción**:
```caddyfile
tudominio.com {
  reverse_proxy localhost:3000 {
    header_up Host {host}
    header_up X-Forwarded-For {remote_host}
    header_up X-Forwarded-Proto {scheme}
    header_up X-Real-IP {remote_host}
  }
  
  # Logs
  log {
    output file /var/log/caddy/greenaxis.log
  }
  
  # Compresión
  encode gzip
}
```

**Configurar Systemd para Auto-Restart**:
```bash
# Crear servicio
sudo nano /etc/systemd/system/greenaxis.service
```

```ini
[Unit]
Description=Green Axis Next.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/greenaxis
Environment="NODE_ENV=production"
ExecStart=/usr/bin/bun /var/www/greenaxis/.next/standalone/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar servicios
sudo systemctl enable greenaxis
sudo systemctl start greenaxis
sudo systemctl enable caddy
sudo systemctl restart caddy

# Verificar estado
sudo systemctl status greenaxis
sudo systemctl status caddy
```

**Comandos de Gestión**:
```bash
# Ver logs de aplicación
sudo journalctl -u greenaxis -f

# Ver logs de Caddy
sudo tail -f /var/log/caddy/greenaxis.log

# Restart de aplicación
sudo systemctl restart greenaxis

# Actualizar código
cd /var/www/greenaxis
sudo git pull
npm install
npx prisma generate
npm run build
sudo systemctl restart greenaxis
```

**4. Netlify** (Alternativa):
- ✅ Buen soporte para Next.js
- ✅ SSL automático
- ✅ Preview deployments
- ⚠️ Funciones serverless (no standalone)
- ⚠️ Límites en plan gratuito

**Recomendación**: 
- **Vercel** para simplicidad y mejor integración con Next.js
- **Railway** si usas Turso y necesitas más control
- **VPS** si necesitas control total y sin límites

---

## 🧪 Testing y Calidad

### Estado Actual

**Testing**: ❌ No implementado (recomendado para v0.3.0)

**Linting**: ✅ Configurado con ESLint 9

**Type Checking**: ✅ TypeScript 5 (ignoreBuildErrors: true en build)

### Scripts de Testing

```json
{
  "scripts": {
    "lint": "eslint .",              // Linter de código
    "db:push": "prisma db push",     // Sincronizar schema
    "db:migrate": "prisma migrate dev" // Crear migraciones
  }
}
```

### Áreas de Testing Recomendadas

**1. Autenticación** (Prioridad Alta):
- Login con credenciales válidas/inválidas
- Expiración de sesión (7 días)
- Rate limiting en login (5 intentos, 15 min lockout)
- Recuperación de contraseña (token válido/expirado/usado)
- Creación de primer admin
- Límite de cuentas admin (MAX_ADMIN_ACCOUNTS)
- Logout y destrucción de sesión

**2. CRUD de Contenido** (Prioridad Alta):
- Crear, editar, eliminar servicios
- Crear, editar, eliminar noticias
- Actualizar configuración general
- Gestión de carrusel (crear, editar, eliminar, reordenar)
- Gestión de imágenes (upload, reemplazo, eliminación)
- Actualizar páginas legales
- Actualizar contenido "About"

**3. Formulario de Contacto** (Prioridad Alta):
- Envío exitoso con datos válidos
- Validación de campos (nombre, email, mensaje)
- Rate limiting (5 mensajes por minuto)
- Sanitización de inputs
- Consentimiento obligatorio
- Envío de email de notificación (opcional)

**4. Seguridad** (Prioridad Crítica):
- XSS protection (si habilitado)
- Path traversal en uploads
- CSRF protection (sameSite=strict)
- Headers de seguridad presentes
- SQL injection (Prisma previene automáticamente)
- Validación de magic bytes en uploads
- Rate limiting efectivo

**5. Caché** (Prioridad Alta - Bug Conocido):
- Invalidación después de mutaciones (⚠️ actualmente falla)
- Preservación de caché en lecturas
- Revalidación manual funciona
- Testing del fix cuando se implemente

**6. API Endpoints** (Prioridad Media):
- Todos los endpoints públicos retornan datos correctos
- Endpoints admin requieren autenticación
- Validación de inputs en todos los endpoints
- Manejo de errores apropiado (500, 400, 401, 404)
- Rate limiting en endpoints críticos

**7. Componentes UI** (Prioridad Baja):
- Renderizado correcto en diferentes tamaños
- Accesibilidad (navegación por teclado)
- Modo oscuro/claro funciona
- Animaciones no causan errores
- Drag & drop funciona en touch devices

### Frameworks de Testing Recomendados

**Unit Testing**:
- **Vitest** - Rápido, compatible con Vite
- **Jest** - Estándar de la industria
- Testing de funciones puras (utils, helpers)
- Testing de Server Actions

**Integration Testing**:
- **Vitest** con supertest
- Testing de API Routes
- Testing de flujos completos
- Testing de base de datos

**E2E Testing**:
- **Playwright** - Recomendado para Next.js
- **Cypress** - Alternativa popular
- Testing de flujos de usuario completos
- Testing cross-browser
- Testing de responsive design

**Ejemplo de Test (Vitest)**:
```typescript
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '@/lib/auth'

describe('Authentication', () => {
  it('should hash and verify password correctly', async () => {
    const password = 'testpassword123'
    const hash = await hashPassword(password)
    
    expect(hash).not.toBe(password)
    expect(await verifyPassword(password, hash)).toBe(true)
    expect(await verifyPassword('wrongpassword', hash)).toBe(false)
  })
})
```

### Calidad de Código

**ESLint**:
- Configurado con `eslint.config.mjs`
- Reglas de Next.js incluidas
- Ejecutar con `npm run lint`

**TypeScript**:
- Strict mode deshabilitado (para flexibilidad)
- Type checking en desarrollo
- Build ignora errores (ignoreBuildErrors: true)

**Convenciones**:
- Nombres de archivos en kebab-case
- Componentes en PascalCase
- Variables y funciones en camelCase
- Constantes en UPPER_CASE

**Code Review Checklist**:
- [ ] Código sigue convenciones del proyecto
- [ ] No hay credenciales hardcodeadas
- [ ] Inputs están validados
- [ ] Errores se manejan apropiadamente
- [ ] Componentes son responsive
- [ ] Accesibilidad considerada
- [ ] Performance optimizada
- [ ] Comentarios en código complejo
- [ ] Tests agregados (cuando se implemente testing)

---

## 🐛 Issues Conocidos

### 1. Bug de Caché de Next.js (CRÍTICO)

**Estado**: Identificado, diseño de fix completado, pendiente de implementación

**Descripción**: Cuando los administradores actualizan datos desde el panel de administración, los cambios se guardan en la base de datos pero no se reflejan en las páginas públicas debido a que Next.js cachea los datos indefinidamente sin revalidación.

**Impacto**: Los usuarios públicos ven contenido desactualizado hasta que hacen hard refresh manual.

**Workaround Temporal**: Hard refresh manual del navegador (Ctrl+Shift+R o Ctrl+F5)

**Solución Planificada**:
- Agregar `revalidatePath()` en todos los endpoints de mutación administrativa
- Revalidar rutas específicas después de cada cambio exitoso
- Implementar estrategia conservadora de invalidación para preservar performance

**Archivos a Modificar**:
- `src/app/api/admin/config/route.ts` - Configuración general
- `src/app/api/servicios/route.ts` - CRUD de servicios
- `src/app/api/noticias/route.ts` - CRUD de noticias
- `src/app/api/carrusel/route.ts` - CRUD de carrusel
- `src/app/api/legal/route.ts` - Páginas legales
- `src/app/api/about/route.ts` - Contenido "About"
- `src/app/api/admin/images/route.ts` - Gestión de imágenes

**Documentación Completa**: Ver `.kiro/specs/nextjs-cache-invalidation-fix/bugfix.md` y `design.md`

### 2. Mejoras de Logging Recomendadas

**Estado**: Mejora futura

**Descripción**: El sistema usa console.log/console.error básico. Se recomienda implementar logging estructurado.

**Recomendación**:
- Implementar Pino o Winston
- Redactar campos sensibles (password, token, email)
- Configurar agregación de logs (Datadog, Sentry)

---

## 📦 Dependencias Clave

### Producción

```json
{
  "next": "^16.1.1",                    // Framework principal
  "react": "^19.0.0",                   // UI library
  "react-dom": "^19.0.0",               // React DOM renderer
  "prisma": "6.19.2",                   // ORM
  "@prisma/client": "6.19.2",           // Cliente de Prisma
  "@prisma/adapter-libsql": "^7.5.0",   // Adaptador para Turso
  "@libsql/client": "^0.17.0",          // Cliente LibSQL
  "bcryptjs": "^3.0.3",                 // Hashing de passwords
  "cloudinary": "^2.9.0",               // Gestión de imágenes
  "resend": "^6.9.3",                   // Envío de emails
  "zod": "^4.0.2",                      // Validación de schemas
  "zustand": "^5.0.6",                  // State management
  "@tanstack/react-query": "^5.82.0",  // Data fetching y caché
  "@tanstack/react-table": "^8.21.3",  // Tablas de datos
  "react-hook-form": "^7.60.0",         // Gestión de formularios
  "@hookform/resolvers": "^5.1.1",     // Resolvers para validación
  "framer-motion": "^12.23.2",          // Animaciones
  "lucide-react": "^0.525.0",           // Iconos
  "tailwindcss": "^4",                  // Estilos
  "next-themes": "^0.4.6",              // Tema claro/oscuro
  "sonner": "^2.0.6",                   // Notificaciones toast
  "@dnd-kit/core": "^6.3.1",            // Drag & drop core
  "@dnd-kit/sortable": "^10.0.0",       // Drag & drop sortable
  "embla-carousel-react": "^8.6.0",     // Carrusel
  "date-fns": "^4.1.0",                 // Utilidades de fechas
  "react-markdown": "^10.1.0",          // Renderizado de markdown
  "sharp": "^0.34.3",                   // Optimización de imágenes
  "uuid": "^11.1.0"                     // Generación de UUIDs
}
```

### Editor.js y Plugins

```json
{
  "@editorjs/header": "^2.8.8",           // Encabezados H1-H6
  "@editorjs/paragraph": "^2.11.7",       // Párrafos
  "@editorjs/list": "^2.0.9",             // Listas ordenadas/desordenadas
  "@editorjs/image": "^2.10.3",           // Imágenes con caption
  "@editorjs/link": "^2.6.2",             // Links embebidos
  "@editorjs/quote": "^2.7.6",            // Citas
  "@editorjs/embed": "^2.8.0",            // Embeds (YouTube, etc.)
  "@editorjs/marker": "^1.4.0",           // Resaltado de texto
  "@editorjs/inline-code": "^1.5.2",      // Código inline
  "@editorjs/underline": "^1.2.1",        // Subrayado
  "editorjs-strikethrough": "^1.0.0"      // Tachado
}
```

**Herramientas Personalizadas** (implementadas en el proyecto):
- `editor-js-header-tools.ts` - Headers con colores personalizables
- `editor-js-color-tool.ts` - Color de texto
- `editor-js-marker-tool.ts` - Marcador/resaltado
- `editor-js-strikethrough-tool.ts` - Texto tachado
- `editor-js-audio-tool.ts` - Subida y reproducción de audio
- `editor-js-video-tool.ts` - Subida y reproducción de video

### UI Components (Radix UI)

Más de 30 componentes primitivos de Radix UI para construir la interfaz:
- **Overlays**: Dialog, Alert Dialog, Popover, Tooltip, Hover Card, Context Menu
- **Navigation**: Tabs, Accordion, Collapsible, Navigation Menu, Menubar
- **Forms**: Select, Checkbox, Radio Group, Switch, Slider, Label
- **Data Display**: Table, Avatar, Progress, Aspect Ratio, Separator
- **Feedback**: Toast (con Sonner)
- **Utilities**: Scroll Area, Resizable Panels, Toggle, Toggle Group

Todos los componentes están en `src/components/ui/` y son completamente personalizables.

---

## 🛠️ Utilidades y Helpers

### Sistema de Referencias de Medios

**Archivo**: `src/lib/media-references.ts`

Sistema completo para rastrear y gestionar el uso de archivos multimedia en toda la aplicación.

**Funciones Principales**:

```typescript
// Encuentra todas las referencias a un archivo por URL
findMediaReferences(url: string): Promise<MediaReference[]>

// Actualiza todas las referencias de una URL a otra
updateMediaReferences(oldUrl: string, newUrl: string): Promise<void>
```

**Tipo MediaReference**:
```typescript
{
  table: string        // Nombre de la tabla (Service, News, etc.)
  id: string          // ID del registro
  field: string       // Campo que contiene la URL
  displayName: string // Nombre descriptivo del registro
  url?: string        // URL de edición (opcional)
}
```

**Tablas Verificadas**:
- `Service` - Campo `imageUrl`
- `News` - Campo `imageUrl` y blocks de Editor.js
- `CarouselSlide` - Campo `imageUrl`
- `PlatformConfig` - Campos `logoUrl`, `faviconUrl`, `aboutImageUrl`
- `AboutPage` - Campos `heroImageUrl`, `historyImageUrl`, `teamMembers` (JSON), `certificationsContent` (JSON)
- `LegalPage` - Blocks de Editor.js (JSON)

**Características**:
- Búsqueda en campos de texto plano
- Búsqueda en campos JSON (Editor.js blocks, arrays de objetos)
- Búsqueda recursiva en estructuras anidadas
- Actualización masiva de referencias
- Manejo de errores graceful

**Uso en Eliminación de Archivos**:
```typescript
// Verificar si un archivo está en uso
const references = await findMediaReferences(fileUrl)

if (references.length > 0) {
  // Mostrar referencias al usuario
  console.log(`Archivo usado en ${references.length} lugares`)
  references.forEach(ref => {
    console.log(`- ${ref.table}: ${ref.displayName}`)
  })
} else {
  // Seguro eliminar
  await deleteFile(fileUrl)
}
```

**Uso en Reemplazo de Archivos**:
```typescript
// Reemplazar todas las referencias de un archivo
await updateMediaReferences(oldUrl, newUrl)

// Todas las referencias se actualizan automáticamente
// en servicios, noticias, carrusel, configuración, etc.
```

**Limitaciones**:
- Solo busca en tablas conocidas (no es dinámico)
- Requiere actualización manual si se agregan nuevas tablas
- No detecta referencias en código o templates
- Búsqueda case-sensitive en URLs

**Mejoras Futuras**:
- Caché de referencias para mejor performance
- Búsqueda case-insensitive
- Detección automática de nuevas tablas
- Índices de base de datos para búsquedas más rápidas

---

## 🔧 Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Inicia servidor de desarrollo en puerto 3000
npm run lint         # Ejecuta ESLint para verificar código
```

### Build y Producción

```bash
npm run build        # Build de producción (prisma generate + next build)
npm run start        # Inicia servidor de producción con Bun (standalone)
```

### Base de Datos

```bash
npm run db:push      # Sincroniza schema con DB (desarrollo, sin migraciones)
npm run db:generate  # Genera cliente Prisma (necesario después de cambios en schema)
npm run db:migrate   # Crea y aplica migraciones (producción)
npm run db:reset     # Resetea base de datos (⚠️ elimina todos los datos)
npm run db:export    # Exporta datos a JSON (backup)
npm run db:import    # Importa datos desde JSON (restauración)
```

**Nota sobre el script start**: Usa Bun como runtime para mejor performance. El output se guarda en `server.log` para debugging.

---

## 🎯 Flujos de Usuario

### Flujo de Visitante Público

```
1. Usuario visita / (home)
2. Ve carrusel de imágenes con animaciones y gradientes
3. Scroll para ver servicios destacados, noticias recientes, sección "About"
4. Navega a /servicios para ver todos los servicios disponibles
5. Lee detalles de servicios específicos (contenido markdown)
6. Navega a /noticias para ver blog con paginación
7. Lee noticia completa en /noticias/[slug] (renderizado de Editor.js)
8. Visita /quienes-somos para conocer la empresa (historia, misión, visión, valores)
9. Usa /contacto para enviar mensaje (con validación y rate limiting)
10. Hace clic en botón flotante de WhatsApp para contacto directo
11. Revisa /terminos y /privacidad para información legal
12. Cambia entre modo claro/oscuro con toggle en header
```

### Flujo de Administrador

```
1. Admin visita /portal-interno
2. Ingresa email y password
3. Sistema valida credenciales con bcrypt.compare()
4. Si válido: createSession() genera token único y cookie segura
5. Redirect a /admin (dashboard)
6. Admin navega a sección específica:
   - /admin/configuracion - Actualiza datos generales del sitio
   - /admin/servicios - Gestiona servicios (CRUD con drag & drop)
   - /admin/noticias - Gestiona noticias con Editor.js
   - /admin/carrusel - Gestiona slides del carrusel (drag & drop)
   - /admin/imagenes - Gestiona imágenes por categorías
   - /admin/legal - Edita páginas legales con Editor.js
   - /admin/quienes-somos - Edita contenido completo de "About"
   - /admin/seccion-about - Edita sección "About" del home
   - /admin/mensajes - Revisa mensajes de contacto (marca como leído)
7. Realiza cambios y guarda
8. Sistema guarda en DB vía Prisma
9. ⚠️ Bug conocido: No invalida caché automáticamente
10. Admin cierra sesión desde botón de logout (llama /api/auth/logout)
```

### Flujo de Recuperación de Contraseña

```
1. Admin olvida contraseña
2. Visita /portal-interno/recuperar-clave
3. Ingresa email registrado
4. Sistema genera token único (UUID) con expiración de 1 hora
5. Sistema envía email vía Resend con link de recuperación
6. Admin hace clic en link del email
7. Redirect a /portal-interno/restablecer?token=...
8. Sistema valida token (no expirado, no usado)
9. Admin ingresa nueva contraseña (mínimo 8 caracteres)
10. Sistema hashea nueva contraseña con bcrypt
11. Sistema actualiza password en DB y marca token como usado
12. Redirect a /portal-interno para login con nueva contraseña
```

---

## 🗂️ Gestión de Contenido

### Editor de Texto Enriquecido

**Tecnología**: Editor.js (block-style editor)

**Herramientas Disponibles**:
- Header (H1-H6) con colores personalizables (verde, azul, rojo, etc.)
- Párrafo con formato de texto
- Lista (ordenada/desordenada)
- Imagen con caption y upload
- Video (embed de YouTube/Vimeo o upload directo)
- Audio (upload directo con reproductor HTML5)
- Link (embeds automáticos con preview)
- Quote (citas con estilo)
- Embed (YouTube, Twitter, Instagram, Vimeo, etc.)
- Inline code (código en línea con estilo)
- Marker (resaltado de texto)
- Underline (subrayado)
- Strikethrough (tachado)
- Color de texto (paleta personalizable)

**Formato de Almacenamiento**: JSON (Editor.js blocks format)

**Renderizado**: Componente `editor-js.tsx` convierte blocks a HTML con sanitización opcional (DOMPurify)

**Internacionalización**: Configurado con `editorjs-i18n.json` para español

**Seguridad**: 
- XSS protection disponible (configurable con flag `ENABLE_HTML_SANITIZATION`)
- DOMPurify sanitiza HTML cuando está habilitado
- Validación de uploads de imágenes, audio y video

### Gestión de Imágenes

**Sistema de Biblioteca de Medios Completo**:

La aplicación cuenta con una biblioteca de medios profesional que permite gestionar todos los archivos multimedia (imágenes, audio, video) de forma centralizada y eficiente.

**Características Principales**:

1. **Detección Inteligente de Duplicados**:
   - Calcula hash SHA-256 del contenido de cada archivo
   - Detecta archivos idénticos antes de subirlos
   - Ofrece reutilizar archivo existente o subir como nuevo
   - Ahorra espacio de almacenamiento y costos de Cloudinary
   - Previene archivos duplicados innecesarios

2. **Gestión de Referencias Automática**:
   - Sistema de tracking que detecta dónde se usa cada archivo
   - Verifica uso en: servicios, noticias, carrusel, configuración, páginas legales, about
   - Previene eliminación accidental de archivos en uso
   - Muestra lista detallada de referencias con links directos
   - Opción de eliminación forzada con limpieza automática de referencias

3. **Metadatos Completos**:
   - Label (nombre descriptivo)
   - Description (descripción opcional)
   - Alt text (para accesibilidad)
   - Category (hero, services, news, gallery, general)
   - MIME type (image/jpeg, audio/mp3, video/mp4, etc.)
   - File size (tamaño en bytes)
   - Dimensions (ancho x alto para imágenes)
   - Duration (duración para audio/video)
   - Hash (SHA-256 para detección de duplicados)
   - Timestamps (creación y última actualización)

4. **Interfaz de Usuario Intuitiva**:
   - Grid responsive con previews de archivos
   - Búsqueda y filtrado por categoría
   - Edición inline de metadatos
   - Drag & drop para subir archivos
   - Preview de imágenes, audio y video
   - Indicadores visuales de archivos en uso
   - Confirmación antes de eliminar

5. **Integración con Editor.js**:
   - Selector de medios integrado en herramientas de imagen, audio y video
   - Reutilización fácil de archivos existentes
   - Upload directo desde el editor
   - Preview en tiempo real

6. **Eliminación Segura con Cloudinary**:
   - Elimina archivos de Cloudinary automáticamente
   - Intenta con diferentes tipos de recursos (image, video, raw)
   - Manejo de errores graceful (continúa si el archivo ya fue eliminado)
   - Limpieza completa de base de datos y almacenamiento

**Categorías de Archivos**:
- `hero` - Imágenes del carrusel principal
- `services` - Imágenes de servicios
- `news` - Imágenes de noticias y blog
- `gallery` - Galería general de imágenes
- `general` - Archivos generales (logos, iconos, etc.)

**Tipos de Archivo Soportados**:
- **Imágenes**: jpg, jpeg, png, gif, webp, svg
- **Audio**: mp3, wav, ogg
- **Video**: mp4, webm, mov

**Almacenamiento**:
- **Desarrollo**: `/public/uploads/` (sistema de archivos local)
- **Producción**: Cloudinary (CDN global con optimización automática)

**Validación de Seguridad**:
- Validación de MIME type declarado
- Validación de magic bytes (firma real del archivo)
- Límites de tamaño por tipo:
  - Imágenes: 10 MB
  - Audio: 20 MB
  - Video: 100 MB
- Prevención de path traversal
- Nombres de archivo seguros (generados por servidor)

**Flujo de Trabajo**:

1. **Subir Archivo**:
   - Usuario arrastra archivo o hace clic en "Upload"
   - Sistema valida tipo y tamaño
   - Calcula hash SHA-256 del contenido
   - Verifica si ya existe archivo con mismo hash
   - Si es duplicado: ofrece reutilizar o subir nuevo
   - Si es nuevo: sube a Cloudinary y registra en biblioteca
   - Extrae metadatos automáticamente (dimensiones, duración, etc.)

2. **Usar Archivo**:
   - Usuario abre selector de medios en formulario
   - Navega por biblioteca con filtros y búsqueda
   - Selecciona archivo existente o sube nuevo
   - Sistema inserta URL en campo correspondiente

3. **Editar Metadatos**:
   - Usuario hace clic en "Edit" en card de archivo
   - Modifica label, description, alt, category
   - Sistema actualiza registro en base de datos
   - Cambios se reflejan inmediatamente

4. **Eliminar Archivo**:
   - Usuario hace clic en "Delete" en card de archivo
   - Sistema verifica referencias en toda la aplicación
   - Si está en uso: muestra lista de referencias con links
   - Usuario puede cancelar o forzar eliminación
   - Si fuerza: limpia referencias y elimina archivo
   - Sistema elimina de Cloudinary y base de datos

**Componentes de UI**:
- `media-library-browser.tsx` - Navegador principal de biblioteca
- `media-card.tsx` - Card individual de archivo con preview y acciones
- `media-picker.tsx` - Selector modal para formularios
- `image-selector.tsx` - Selector legacy (migrado a media-picker)

**API Endpoints**:
- `GET /api/admin/media` - Listar archivos con filtros
- `POST /api/admin/media` - Registrar nuevo archivo
- `PUT /api/admin/media/:id` - Actualizar metadatos
- `DELETE /api/admin/media/:id` - Eliminar archivo
- `GET /api/admin/media/check-references` - Verificar referencias

**Utilidades**:
- `src/lib/media-references.ts` - Sistema de tracking de referencias
  - `findMediaReferences(url)` - Encuentra dónde se usa un archivo
  - `updateMediaReferences(oldUrl, newUrl)` - Actualiza referencias masivamente

**Sistema de Keys Únicas (Legacy)**:

El sistema anterior de keys únicas sigue disponible para compatibilidad:
- Cada imagen puede tener un `key` único opcional (hero-1, about-us, etc.)
- Al subir nueva imagen con mismo key, reemplaza la anterior automáticamente
- Útil para imágenes específicas del sistema que deben actualizarse
- Elimina automáticamente la imagen anterior de Cloudinary

**Migración de Sistema Antiguo**:

Si tienes imágenes del sistema antiguo (`/api/admin/images`), puedes migrarlas a la nueva biblioteca:
1. Las imágenes existentes siguen funcionando
2. Nuevas subidas usan el sistema de biblioteca de medios
3. Gradualmente reemplazar referencias antiguas con nuevas
4. Ambos sistemas coexisten sin problemas

### Gestión de Servicios

**Campos Editables**:
- Título, descripción corta, contenido detallado (markdown)
- Icono (Lucide icons - más de 1000 iconos disponibles)
- Imagen (upload con Cloudinary)
- Orden de visualización (drag & drop en panel admin)
- Estado (activo/inactivo)
- Destacado (featured - aparece en home)

**Visualización**:
- Home: Servicios destacados (featured=true)
- /servicios: Todos los servicios activos ordenados

**Funcionalidades**:
- Reordenamiento con drag & drop
- Preview de iconos en tiempo real
- Eliminación con confirmación
- Búsqueda y filtrado en panel admin

### Gestión de Noticias

**Campos Editables**:
- Título, slug (URL amigable, auto-generado)
- Excerpt (resumen corto para listados)
- Contenido (Editor.js blocks con todas las herramientas)
- Imagen de portada con caption opcional
- Autor (texto libre)
- Estado (publicado/borrador)
- Destacado (featured - aparece en home)
- Fecha de publicación (auto o manual)

**Visualización**:
- Home: Noticias destacadas (últimas 3)
- /noticias: Listado paginado (6 por página)
- /noticias/[slug]: Detalle completo con renderizado de Editor.js

**Funcionalidades**:
- Generación automática de slug desde título
- Preview de imagen de portada
- Opción de mostrar/ocultar imagen en contenido
- Búsqueda y filtrado en panel admin
- Paginación automática

---

## 🎨 Personalización y Branding

### Sistema de Temas (Modo Oscuro/Claro)

**Tecnología**: next-themes v0.4.6

**Componentes**:
- `theme-provider.tsx` - Provider de next-themes que envuelve la aplicación
- `theme-toggle.tsx` - Botón para cambiar entre modos (sol/luna)

**Características**:
- Persistencia automática en localStorage
- Sin flash de contenido incorrecto (FOUC)
- Transiciones suaves entre temas
- Detección automática de preferencia del sistema
- Tres opciones: light, dark, system

**Implementación**:
```typescript
// Uso en componentes
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('dark') // 'light', 'dark', 'system'
```

**Variables CSS** (definidas en `src/app/globals.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 142 71% 45%;        /* Verde corporativo #6BBE45 */
  /* ... más variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... variables para modo oscuro */
}
```

### Configuración Visual

**Colores**:
- Color primario: `#6BBE45` (verde corporativo de Green Axis)
- Configurable desde panel admin (campo `primaryColor` en PlatformConfig)
- Sistema de colores semánticos (primary, secondary, accent, destructive, muted)
- Adaptación automática a modo oscuro

**Tipografía**:
- Sistema de fuentes de Tailwind (sans-serif stack)
- Escalas responsive (text-sm → text-5xl)
- Line heights optimizados para legibilidad
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

**Espaciado**:
- Sistema de spacing de Tailwind (0.25rem increments)
- Container con max-width responsive
- Padding y margin consistentes
- Gap en grids y flexbox

**Animaciones**:
- Framer Motion para animaciones complejas (carrusel, modales)
- Tailwind Animate para transiciones simples
- Animaciones de entrada/salida suaves
- Respeta preferencia de usuario (prefers-reduced-motion)

### Elementos Configurables

**Desde Panel Admin** (`/admin/configuracion`):
- Logo y favicon
- Nombre del sitio, slogan y descripción
- Colores del tema (color primario)
- Textos del footer y redes sociales
- Links de redes sociales (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube)
- Número de WhatsApp y mensaje predeterminado
- Email de notificaciones (para recibir mensajes de contacto)
- Datos de contacto (dirección, teléfono, email)
- Google Analytics ID
- Google Maps embed code
- Configuración de sección "About" del home
- Mostrar/ocultar sección de mapa

**Desde Otras Secciones Admin**:
- Contenido de todas las páginas (servicios, noticias, about, legales)
- Imágenes del sitio por categorías
- Carrusel principal (slides con gradientes y animaciones)
- Orden de servicios y slides (drag & drop)

---

## 📊 Rendimiento y Optimización

### Optimizaciones Implementadas

**Next.js 16**:
- Output standalone (bundle optimizado, ~50% más pequeño)
- Caché agresivo de páginas (⚠️ requiere invalidación manual - bug conocido)
- Optimización automática de imágenes con Sharp
- Code splitting automático por ruta
- Server Components por defecto (menos JavaScript al cliente)
- Streaming SSR para carga progresiva
- Prefetching automático de links visibles

**Cloudinary**:
- Transformación y optimización automática de imágenes
- Formatos modernos (WebP, AVIF) con fallback
- CDN global con 200+ puntos de presencia
- Lazy loading de imágenes
- Responsive images con srcset
- Compresión inteligente (quality: auto)

**Turso Database**:
- Base de datos distribuida con baja latencia
- Réplicas edge en múltiples regiones
- Conexiones desde el edge más cercano
- Queries optimizadas con Prisma
- Connection pooling automático

**Prisma ORM**:
- Queries optimizadas y compiladas
- Connection pooling eficiente
- Cliente generado optimizado
- Lazy loading de relaciones
- Batch queries cuando es posible

**Caché del Cliente**:
- TanStack React Query para data fetching
- Caché automático de requests
- Revalidación en background
- Optimistic updates
- Deduplicación de requests

**Bundle Optimization**:
- Tree shaking automático
- Minificación de JavaScript y CSS
- Compresión gzip/brotli
- Lazy loading de componentes pesados
- Dynamic imports para código no crítico

### Métricas Esperadas (Core Web Vitals)

**Objetivos**:
- **Time to First Byte (TTFB)**: < 200ms (con Turso edge)
- **Largest Contentful Paint (LCP)**: < 2.5s (bueno)
- **First Input Delay (FID)**: < 100ms (bueno)
- **Cumulative Layout Shift (CLS)**: < 0.1 (bueno)
- **First Contentful Paint (FCP)**: < 1.8s (bueno)

**Factores que Afectan Performance**:
- Tamaño de imágenes del carrusel (optimizar a < 500KB)
- Número de slides activos en carrusel (recomendado: 3-5)
- Cantidad de servicios destacados en home (recomendado: 3-6)
- Uso de Editor.js (carga diferida en admin)
- Conexión a Turso (latencia depende de región)

### Recomendaciones de Optimización

1. **Imágenes**:
   - Usar formato WebP/AVIF cuando sea posible
   - Comprimir imágenes antes de subir (< 500KB)
   - Usar dimensiones apropiadas (no subir 4K para mostrar 800px)
   - Habilitar blur placeholder en Next.js Image

2. **Contenido**:
   - Limitar número de noticias destacadas en home (3-4)
   - Paginar listados largos
   - Lazy load de componentes pesados (Editor.js, mapas)

3. **Caché**:
   - Implementar fix de caché (prioridad alta)
   - Configurar revalidación apropiada por ruta
   - Usar ISR (Incremental Static Regeneration) cuando sea posible

4. **Monitoreo**:
   - Configurar Vercel Analytics o similar
   - Monitorear Core Web Vitals
   - Identificar páginas lentas
   - Optimizar queries de base de datos lentasndimiento

### Optimizaciones Implementadas


**Next.js**:
- Output standalone (bundle optimizado)
- Caché agresivo de páginas (⚠️ requiere invalidación manual)
- Optimización automática de imágenes
- Code splitting automático
- Server Components por defecto

**Cloudinary**:
- Transformación y optimización automática de imágenes
- Formatos modernos (WebP, AVIF)
- CDN global
- Lazy loading

**Turso**:
- Base de datos distribuida con baja latencia
- Réplicas globales
- Conexiones edge

**Prisma**:
- Queries optimizadas
- Connection pooling
- Cliente generado optimizado

### Métricas Esperadas

- **Time to First Byte (TTFB)**: < 200ms (con Turso edge)
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

---

## 🔄 Flujo de Datos

### Lectura de Datos (Server Components)

```
1. Usuario solicita página pública (ej: /servicios)
2. Server Component ejecuta en servidor
3. Llama a Server Action (getServices())
4. Server Action consulta Prisma
5. Prisma consulta Turso DB
6. Datos retornan a Server Component
7. Next.js cachea resultado (⚠️ indefinidamente)
8. HTML se genera y envía al cliente
```

### Escritura de Datos (Admin)

```
1. Admin envía formulario desde panel admin
2. Request POST/PUT/DELETE a API Route
3. API Route verifica autenticación (getCurrentAdmin())
4. Valida y sanitiza datos de entrada
5. Ejecuta mutación en Prisma
6. Prisma actualiza Turso DB
7. ⚠️ BUG: No se invalida caché de Next.js
8. Response 200 OK al cliente
9. ⚠️ Páginas públicas siguen mostrando datos antiguos
```

### Flujo de Subida de Archivos

```
1. Admin selecciona archivo en panel
2. POST /api/upload con FormData
3. Validación de MIME type y magic bytes
4. Generación de nombre único
5. Guardado en /public/uploads/ (desarrollo)
6. O upload a Cloudinary (producción)
7. URL retornada al cliente
8. Admin guarda URL en DB (servicio, noticia, config, etc.)
```

---

## 🌐 Internacionalización

**Estado Actual**: Español (es-CO) como idioma principal

**Preparado para i18n**:
- Estructura compatible con `next-intl` (dependencia instalada: v4.3.4)
- Textos configurables desde panel admin (no hardcodeados)
- Editor.js con traducciones en `editorjs-i18n.json`
- Componentes preparados para recibir locale

**Para Agregar Idiomas Adicionales**:

1. **Configurar next-intl**:
```typescript
// src/app/layout.tsx
import { NextIntlClientProvider } from 'next-intl'

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale}>
        {children}
      </NextIntlClientProvider>
    </html>
  )
}
```

2. **Crear archivos de traducción**:
```
/messages/
  ├── es.json  # Español (actual)
  └── en.json  # Inglés (nuevo)
```

3. **Actualizar rutas**:
```
/[locale]/servicios
/[locale]/noticias
/[locale]/contacto
```

4. **Agregar selector de idioma**:
- Componente en header
- Persistencia en cookie o localStorage
- Cambio sin reload de página

**Textos Configurables** (no requieren traducción de código):
- Todos los textos del sitio se gestionan desde panel admin
- Servicios, noticias, páginas legales son editables
- Configuración general incluye todos los textos del sitio

---

## 📱 Responsive Design

### Breakpoints (Tailwind CSS 4)

```
sm: 640px   - Móviles grandes (landscape)
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Pantallas grandes
```

### Componentes Responsive

Todos los componentes están optimizados para móvil con enfoque mobile-first:

**Header**:
- Menú hamburguesa en móvil (< md)
- Navegación completa en desktop (≥ md)
- Logo responsive con tamaños adaptativos
- Toggle de tema visible en todos los tamaños

**Carrusel**:
- Imágenes adaptativas con object-fit
- Textos con tamaños responsive (text-2xl → text-5xl)
- Botones con padding adaptativo
- Controles de navegación ocultos en móvil

**Grids**:
- Servicios: 1 columna (móvil) → 2 (tablet) → 3 (desktop)
- Noticias: 1 columna (móvil) → 2 (tablet) → 3 (desktop)
- Valores/Features: 1 columna (móvil) → 2 (desktop)

**Formularios**:
- Inputs con tamaño touch-friendly (min 44px altura)
- Labels siempre visibles
- Mensajes de error claros
- Botones de tamaño adecuado para touch

**Imágenes**:
- Next.js Image con optimización automática
- Lazy loading nativo
- Placeholder blur (opcional)
- Formatos modernos (WebP, AVIF) vía Cloudinary

**Panel Admin**:
- Sidebar colapsable en móvil
- Tablas con scroll horizontal en móvil
- Formularios apilados en móvil
- Drag & drop compatible con touch

### Accesibilidad (WCAG 2.1)

**Implementado**:
- Todos los componentes shadcn/ui son accesibles por defecto (Radix UI)
- Atributos ARIA en componentes interactivos
- Navegación por teclado en todos los elementos
- Focus visible en todos los controles
- Contraste de colores adecuado (AA)
- Alt text en todas las imágenes
- Labels asociados a inputs
- Mensajes de error descriptivos
- Skip links para navegación rápida

**Recomendaciones**:
- Probar con screen readers (NVDA, JAWS)
- Validar contraste de colores con herramientas
- Realizar audit de accesibilidad con Lighthouse
- Considerar certificación WCAG si es requerido

---

## 🔍 SEO y Analytics

### Configuración SEO

**Metadatos Configurables** (desde `/admin/configuracion`):
- `siteName` - Nombre del sitio (usado en title tags)
- `siteDescription` - Descripción para meta description
- `metaKeywords` - Keywords para SEO (separadas por comas)
- `siteUrl` - URL pública del sitio (para Open Graph)
- Open Graph tags - Generados automáticamente en cada página
- Canonical URLs - Configurados en layout principal

**Optimizaciones SEO Implementadas**:
- Títulos descriptivos en todas las páginas
- Meta descriptions únicas por página
- URLs amigables (slugs) para noticias
- Imágenes con alt text
- Estructura semántica HTML5
- Sitemap.xml (recomendado agregar)
- robots.txt configurado en `/public/robots.txt`

### Google Analytics

**Configuración**: Variable `googleAnalytics` en PlatformConfig (campo en DB)

**Componentes**:
- `google-analytics.tsx` - Script de Google Tag Manager
- `analytics-loader.tsx` - Carga condicional de analytics

**Implementación**:
- Script de Google Tag Manager (gtag.js)
- Tracking automático de pageviews
- Eventos personalizados (configurables)
- Solo se carga si hay ID configurado
- Compatible con modo oscuro/claro

**Configuración en Admin**:
1. Ir a `/admin/configuracion`
2. Agregar Google Analytics ID (formato: G-XXXXXXXXXX)
3. Guardar configuración
4. El script se carga automáticamente en todas las páginas públicas

---

## 📧 Sistema de Emails

### Resend Integration

**Uso Actual**:
- Recuperación de contraseña
- Notificaciones de mensajes de contacto (opcional)

**Configuración**:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: email,
  subject: 'Recuperación de contraseña',
  html: emailTemplate
})
```

**Límites**:
- Plan gratuito: 100 emails/día
- Plan Pro: 50,000 emails/mes

---

## 🛠️ Desarrollo Local

### Requisitos

- Node.js 18+ o Bun 1.3.4+
- npm, pnpm o bun (package manager)
- Git
- Editor de código (VS Code recomendado)

### Setup Inicial

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd greenaxis

# 2. Instalar dependencias
npm install
# O con bun (más rápido)
bun install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de desarrollo

# 4. Generar cliente Prisma
npx prisma generate

# 5. Sincronizar base de datos
npx prisma db push

# 6. (Opcional) Importar datos de ejemplo
npm run db:import

# 7. Iniciar servidor de desarrollo
npm run dev
# O con bun
bun run dev
```

### Acceso Local

- **Sitio público**: http://localhost:3000
- **Panel admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/portal-interno
- **Prisma Studio**: http://localhost:5555 (después de `npx prisma studio`)

### Crear Primer Administrador

**Opción 1: Desde la aplicación** (Recomendado):
```bash
# 1. Iniciar servidor
npm run dev

# 2. Visitar http://localhost:3000/portal-interno
# Si no existe ningún admin, verás formulario de setup

# 3. Completar formulario con:
#    - Email
#    - Password (mínimo 8 caracteres)
#    - Nombre (opcional)

# 4. Sistema crea admin y hace login automático
```

**Opción 2: Desde Prisma Studio**:
```bash
# 1. Abrir Prisma Studio
npx prisma studio

# 2. Ir a tabla Admin
# 3. Crear nuevo registro con:
#    - email: tu@email.com
#    - password: [hash generado con bcrypt]
#    - role: admin
#    - status: aprobado

# Nota: Para generar hash de password, usar:
# node -e "console.log(require('bcryptjs').hashSync('tupassword', 12))"
```

### Herramientas de Desarrollo

**Prisma Studio** (GUI para base de datos):
```bash
npx prisma studio
# Abre en http://localhost:5555
# Permite ver y editar datos directamente
```

**ESLint** (linter):
```bash
npm run lint
# Verifica código según reglas de eslint.config.mjs
```

**Logs en Tiempo Real**:
```bash
# En desarrollo (console.log aparece en terminal)
npm run dev

# En producción (logs guardados en archivo)
tail -f server.log
```

**Hot Reload**:
- Next.js recarga automáticamente en cambios de código
- Fast Refresh preserva estado de React
- Recarga completa en cambios de configuración

---

## 🔐 Gestión de Credenciales

### Desarrollo

**Archivo**: `.env` (NO commitear)

```bash
DATABASE_URL="file:./db/custom.db"
TURSO_DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="..."
MAX_ADMIN_ACCOUNTS=2
```

### Producción

**Configurar en plataforma de hosting**:
- Vercel: Settings → Environment Variables
- Railway: Variables tab
- Netlify: Site settings → Environment variables

**Seguridad**:
- Nunca commitear .env al repositorio
- Usar secretos diferentes para dev y prod
- Rotar tokens periódicamente
- Limitar acceso a variables de entorno

---

## 📈 Monitoreo y Logs

### Logs del Servidor

**Ubicación**: `server.log` (generado por script start en producción)

**Contenido**:
- Requests HTTP con método, ruta y status code
- Queries de Prisma (en modo debug)
- Errores de servidor con stack traces
- Warnings y mensajes informativos
- Timestamps de cada evento

**Comando**:
```bash
# Ver logs en tiempo real
tail -f server.log

# Ver últimas 100 líneas
tail -n 100 server.log

# Buscar errores
grep "Error" server.log

# Buscar requests específicos
grep "POST /api/contacto" server.log
```

**Rotación de Logs** (Recomendado):
```bash
# Configurar logrotate en Linux
# /etc/logrotate.d/greenaxis
/path/to/greenaxis/server.log {
  daily
  rotate 7
  compress
  missingok
  notifempty
}
```

### Logging en Desarrollo

**Console Logs**:
- `console.log()` - Información general
- `console.error()` - Errores
- `console.warn()` - Advertencias

**Ubicación**: Terminal donde corre `npm run dev`

**Prisma Logs**:
```typescript
// Habilitar logs de queries en desarrollo
const db = new PrismaClient({
  log: ['query', 'error', 'warn']
})
```

### Monitoreo Recomendado

**Herramientas**:

1. **Sentry** (Error Tracking):
   - Tracking automático de errores
   - Stack traces completos
   - Contexto de usuario
   - Alertas en tiempo real
   - Performance monitoring

2. **Datadog** (Logs Aggregation):
   - Agregación de logs centralizados
   - Búsqueda y filtrado avanzado
   - Dashboards personalizados
   - APM (Application Performance Monitoring)

3. **Vercel Analytics** (Si se despliega en Vercel):
   - Core Web Vitals
   - Métricas de performance
   - Análisis de tráfico
   - Insights de usuarios

4. **Google Analytics** (Implementado):
   - Tracking de pageviews
   - Análisis de comportamiento
   - Conversiones y objetivos
   - Datos demográficos

5. **Uptime Monitoring**:
   - UptimeRobot (gratuito)
   - Pingdom
   - StatusCake
   - Alertas por email/SMS

### Métricas Clave a Monitorear

**Disponibilidad**:
- Uptime del servidor (objetivo: 99.9%)
- Tiempo de respuesta de health check
- Errores 5xx (objetivo: < 0.1%)

**Performance**:
- Tiempo de respuesta de APIs (objetivo: < 200ms)
- Core Web Vitals (LCP, FID, CLS)
- Tiempo de build (objetivo: < 5 min)
- Tamaño de bundle (objetivo: < 500 KB)

**Base de Datos**:
- Latencia de queries (objetivo: < 50ms con Turso)
- Número de conexiones activas
- Tamaño de base de datos
- Queries lentas (> 100ms)

**Tráfico**:
- Requests por minuto
- Páginas más visitadas
- Tasa de rebote
- Tiempo en sitio

**Errores**:
- Tasa de error (objetivo: < 1%)
- Errores más comunes
- Intentos de login fallidos
- Rate limit triggers

**Seguridad**:
- Intentos de acceso no autorizado
- Patrones de ataque (SQL injection, XSS)
- IPs bloqueadas por rate limiting
- Uploads sospechosos

---

## 🚨 Troubleshooting

### Error: No se puede conectar a Turso

**Síntomas**: Error de conexión a base de datos en producción

**Soluciones**:
1. Verificar `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` en variables de entorno
2. Comprobar que el token no haya expirado (tokens no expiran por defecto)
3. Regenerar token si es necesario: `turso db tokens create nombre-db`
4. Verificar conectividad de red del servidor
5. Verificar que la base de datos existe: `turso db list`
6. Fallback temporal a SQLite local cambiando `DATABASE_URL`

**Logs a Revisar**:
```
Error: SQLITE_CANTOPEN: unable to open database file
Error: LibsqlError: UNAUTHORIZED
```

### Error: Imágenes no se cargan

**Síntomas**: Imágenes rotas o no se muestran

**Soluciones**:
1. Verificar credenciales de Cloudinary en .env
2. Comprobar `remotePatterns` en next.config.ts incluye dominio de Cloudinary
3. Verificar que `res.cloudinary.com` esté permitido en CSP (middleware.ts)
4. Revisar logs de Cloudinary API en dashboard
5. Verificar que las URLs sean HTTPS (no HTTP)
6. Comprobar que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` esté configurado

**Debugging**:
```bash
# Ver logs de Next.js
npm run dev

# Verificar URL de imagen en navegador
# Debe retornar 200, no 403 o 404
```

### Error: Build falla

**Síntomas**: `npm run build` termina con error

**Soluciones**:
1. Verificar que `prisma generate` se ejecutó correctamente
2. Limpiar caché y reinstalar:
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run build
   ```
3. Verificar que todas las variables de entorno estén definidas
4. Revisar errores de TypeScript (aunque `ignoreBuildErrors: true`)
5. Verificar espacio en disco disponible
6. Verificar que no haya imports circulares
7. Comprobar que todas las dependencias estén instaladas

**Logs a Revisar**:
```
Error: Cannot find module '@prisma/client'
→ Ejecutar: npx prisma generate

Error: ENOSPC: no space left on device
→ Liberar espacio en disco

Error: Module not found
→ Verificar imports y dependencias
```

### Error: Cambios no se reflejan en sitio público

**Síntomas**: Actualizaciones desde admin no aparecen en páginas públicas

**Causa**: Bug conocido de caché de Next.js (ver sección Issues Conocidos)

**Workarounds**:
1. **Hard refresh** en navegador: Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac)
2. **Limpiar caché del navegador**: Ctrl+Shift+Delete
3. **Modo incógnito**: Abrir en ventana privada
4. **Restart del servidor** (desarrollo): Ctrl+C y `npm run dev`

**Solución Permanente**: 
- Implementar fix de invalidación de caché
- Ver documentación en `.kiro/specs/nextjs-cache-invalidation-fix/`
- Agregar `revalidatePath()` en endpoints de mutación

### Error: Rate limit en contacto

**Síntomas**: Formulario de contacto retorna error 429 "Demasiadas solicitudes"

**Causa**: Más de 5 envíos en 1 minuto desde misma IP

**Soluciones**:
1. **Esperar 1 minuto** y volver a intentar
2. **Ajustar límite** en `src/middleware.ts` (solo para desarrollo):
   ```typescript
   if (limit.count >= 10) {  // Cambiar de 5 a 10
   ```
3. **Limpiar rate limit** (restart del servidor resetea contadores)
4. **Usar IP diferente** (VPN, red móvil)

**Para Producción**:
- Mantener límite en 5 para prevenir spam
- Considerar whitelist de IPs confiables
- Implementar CAPTCHA si hay abuso

### Error: Session expirada

**Síntomas**: Redirect a /portal-interno después de estar en admin

**Causa**: Cookie de sesión expirada (7 días) o inválida

**Soluciones**:
1. **Login nuevamente** en /portal-interno
2. **Verificar cookies** en DevTools (Application → Cookies)
3. **Limpiar cookies** si están corruptas
4. **Verificar fecha/hora del sistema** (sesiones usan timestamps)

### Error: Editor.js no carga

**Síntomas**: Editor no aparece o muestra error en consola

**Soluciones**:
1. Verificar que todas las dependencias de Editor.js están instaladas
2. Limpiar caché de Next.js: `rm -rf .next`
3. Verificar que `editorjs-i18n.json` existe
4. Revisar consola del navegador para errores específicos
5. Verificar que el componente tiene `'use client'` directive

**Logs a Revisar**:
```
Error: Cannot find module '@editorjs/header'
→ Ejecutar: npm install

ReferenceError: window is not defined
→ Verificar 'use client' directive
```

---

## 🔒 Mejores Prácticas de Seguridad

### Para Desarrolladores

1. **Nunca commitear credenciales**:
   - Verificar que .env está en .gitignore
   - Usar .env.example como plantilla (sin valores reales)
   - Rotar secretos si se exponen accidentalmente
   - Usar diferentes credenciales para dev y prod
   - Nunca hardcodear API keys en código

2. **Validar todas las entradas**:
   - Validar tipo, formato y longitud de datos
   - Sanitizar antes de guardar en DB
   - Usar Zod para schemas complejos
   - Rechazar inputs inválidos con mensajes claros
   - Nunca confiar en datos del cliente

3. **Proteger endpoints de admin**:
   - Siempre llamar `getCurrentAdmin()` al inicio
   - Retornar 401 si no autenticado
   - Verificar permisos antes de mutaciones
   - Loggear accesos a endpoints sensibles
   - Implementar audit log (futuro)

4. **Manejar errores correctamente**:
   - No exponer stack traces al cliente
   - Usar mensajes genéricos en producción
   - Loggear detalles solo en servidor
   - Implementar logging estructurado
   - Monitorear errores con Sentry

5. **Actualizar dependencias**:
   - Ejecutar `npm audit` regularmente (semanal)
   - Actualizar paquetes con vulnerabilidades
   - Revisar changelogs antes de actualizar
   - Probar después de actualizaciones
   - Usar Dependabot o Renovate

6. **Seguir principio de mínimo privilegio**:
   - Dar solo permisos necesarios
   - Usar variables de entorno para secretos
   - No usar credenciales de superadmin en aplicación
   - Rotar tokens periódicamente

7. **Implementar defense in depth**:
   - Múltiples capas de seguridad
   - Validación en cliente Y servidor
   - Rate limiting + validación + sanitización
   - Headers de seguridad + CSP + HTTPS

### Para Administradores

1. **Usar contraseñas fuertes**:
   - Mínimo 12 caracteres (recomendado: 16+)
   - Mezcla de mayúsculas, minúsculas, números y símbolos
   - No reutilizar contraseñas de otros sitios
   - Usar gestor de contraseñas (1Password, Bitwarden)
   - Cambiar contraseña cada 90 días

2. **Proteger acceso al panel**:
   - No compartir credenciales
   - Cerrar sesión al terminar
   - No usar computadoras públicas
   - Habilitar 2FA cuando esté disponible
   - Revisar actividad sospechosa

3. **Revisar logs regularmente**:
   - Buscar intentos de login fallidos
   - Monitorear actividad sospechosa
   - Revisar mensajes de contacto
   - Verificar cambios en configuración
   - Reportar anomalías al equipo técnico

4. **Backup de datos**:
   - Exportar datos regularmente: `npm run db:export`
   - Guardar backups en ubicación segura (fuera del servidor)
   - Probar restauración periódicamente
   - Mantener al menos 3 backups (diario, semanal, mensual)
   - Versionar backups con fecha

5. **Gestión de contenido segura**:
   - Verificar URLs antes de agregar links
   - No subir archivos de fuentes no confiables
   - Revisar contenido antes de publicar
   - Usar imágenes con licencia apropiada
   - Mantener contenido legal actualizado

6. **Monitoreo de seguridad**:
   - Revisar audit de seguridad periódicamente
   - Reportar vulnerabilidades encontradas
   - Mantener software actualizado
   - Seguir recomendaciones del equipo técnico
   - Participar en capacitaciones de seguridad

---

## 📚 Recursos y Documentación

### Documentación Oficial

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Turso**: https://docs.turso.tech/
- **Cloudinary**: https://cloudinary.com/documentation
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Editor.js**: https://editorjs.io/

### Guías Internas

- **Audit de Seguridad**: `.kiro/security-audit-report.md` (Puntuación: 8.5/10)
- **Fix de Caché**: `.kiro/specs/nextjs-cache-invalidation-fix/` (bugfix spec)
- **Guía de Despliegue**: `.kiro/specs/deployment-automation-guide/` (feature spec)
- **Steering de Next.js**: `~/.kiro/steering/nextjs-deployment-guide.md`

### Especificaciones Técnicas (Specs)

El proyecto utiliza la metodología de **Spec-Driven Development** con documentación formal en `.kiro/specs/`:

**1. nextjs-cache-invalidation-fix** (Bugfix Spec):
- **Tipo**: Bugfix
- **Estado**: Diseño completado, pendiente de implementación
- **Archivos**: `bugfix.md`, `design.md`, `tasks.md`
- **Descripción**: Fix para el bug crítico de caché de Next.js que impide que los cambios administrativos se reflejen en el sitio público
- **Solución**: Implementar `revalidatePath()` en todos los endpoints de mutación

**2. deployment-automation-guide** (Feature Spec):
- **Tipo**: Feature
- **Estado**: Documentación completada
- **Archivos**: `requirements.md`, `design.md`, `tasks.md`
- **Descripción**: Guía completa de automatización de despliegue con scripts, CI/CD y configuración de producción
- **Objetivo**: Simplificar el proceso de despliegue a producción

---

## 🎓 Conceptos Clave para Nuevos Desarrolladores

### App Router de Next.js

**Server Components** (por defecto):
- Se ejecutan en el servidor
- No se envían al cliente (bundle más pequeño)
- Pueden acceder directamente a la base de datos
- No pueden usar hooks de React (useState, useEffect)

**Client Components** (con 'use client'):
- Se ejecutan en el navegador
- Pueden usar hooks de React
- Necesitan APIs para acceder a datos
- Ejemplo: `editor-js.tsx`, formularios interactivos

**Server Actions** (con 'use server'):
- Funciones que se ejecutan en el servidor
- Pueden ser llamadas desde Client Components
- Útiles para mutaciones de datos
- Ejemplo: `src/lib/actions.ts`

### Prisma ORM

**Schema**: Define modelos de datos en `prisma/schema.prisma`

**Cliente**: Generado automáticamente con `prisma generate`

**Queries**:
```typescript
// Buscar uno
await db.service.findUnique({ where: { id } })

// Buscar muchos
await db.service.findMany({ where: { active: true } })

// Crear
await db.service.create({ data: { title, description } })

// Actualizar
await db.service.update({ where: { id }, data: { title } })

// Eliminar
await db.service.delete({ where: { id } })
```

### Turso Database

**Qué es**: SQLite distribuido con réplicas globales

**Ventajas**:
- Baja latencia (edge computing)
- Escalabilidad automática
- Compatible con SQLite
- Backups automáticos

**Conexión**: A través de adaptador LibSQL en Prisma

### Editor.js

**Qué es**: Editor de bloques modular para contenido rico

**Formato de Datos**: JSON con estructura de bloques

**Ejemplo**:
```json
{
  "blocks": [
    {
      "type": "header",
      "data": { "text": "Título", "level": 2 }
    },
    {
      "type": "paragraph",
      "data": { "text": "Contenido..." }
    }
  ]
}
```

**Renderizado**: Componente personalizado convierte JSON a HTML

---

## 🧩 Patrones de Código

### Patrón de API Route con Autenticación

```typescript
import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  // 1. Autenticación (si es admin endpoint)
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // 2. Lógica de negocio
  try {
    const data = await db.model.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  // 1. Autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  // 2. Parsear y validar datos
  const body = await request.json()
  const { field1, field2 } = body
  
  // Validación de tipo
  if (!field1 || typeof field1 !== 'string') {
    return NextResponse.json({ error: 'Campo inválido' }, { status: 400 })
  }
  
  // Validación de longitud
  if (field1.length < 2 || field1.length > 100) {
    return NextResponse.json({ error: 'Campo debe tener entre 2 y 100 caracteres' }, { status: 400 })
  }
  
  // 3. Mutación en DB
  try {
    const result = await db.model.create({ 
      data: { 
        field1: field1.trim(), 
        field2 
      } 
    })
    
    // ⚠️ TODO: Agregar revalidatePath() aquí para fix de caché
    // import { revalidatePath } from 'next/cache'
    // revalidatePath('/')
    // revalidatePath('/servicios')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  
  const body = await request.json()
  const { id } = body
  
  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }
  
  try {
    await db.model.delete({ where: { id } })
    
    // ⚠️ TODO: Agregar revalidatePath() aquí
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
```

### Patrón de Server Component con Data Fetching

```typescript
import { db } from '@/lib/db'

// Server Component (sin 'use client')
export default async function ServicesPage() {
  // Fetch de datos directamente en servidor
  const services = await db.service.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}

// Configuración de caché (opcional)
export const revalidate = 3600  // Revalidar cada hora
// O: export const dynamic = 'force-dynamic'  // Sin caché
```

**Ventajas**:
- No requiere API Route
- Acceso directo a base de datos
- Menos código
- Mejor performance (sin round-trip HTTP)
- SEO friendly (HTML generado en servidor)

### Patrón de Server Action

```typescript
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getCurrentAdmin } from '@/lib/auth'

// Server Action - puede ser llamada desde Client Components
export async function createService(formData: FormData) {
  // 1. Autenticación
  const admin = await getCurrentAdmin()
  if (!admin) {
    return { error: 'No autorizado' }
  }
  
  // 2. Extraer y validar datos
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  
  if (!title || title.length < 2) {
    return { error: 'Título inválido' }
  }
  
  // 3. Mutación en DB
  try {
    const service = await db.service.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        active: true,
        order: 0
      }
    })
    
    // 4. Invalidar caché
    revalidatePath('/')
    revalidatePath('/servicios')
    
    return { success: true, service }
  } catch (error) {
    console.error('Error creating service:', error)
    return { error: 'Error al crear servicio' }
  }
}
```

**Uso desde Client Component**:
```typescript
'use client'

import { createService } from '@/lib/actions'
import { toast } from 'sonner'

export function CreateServiceForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createService(formData)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Servicio creado')
    }
  }
  
  return (
    <form action={handleSubmit}>
      <input name="title" required />
      <input name="description" />
      <button type="submit">Crear</button>
    </form>
  )
}
```

### Patrón de Formulario con React Hook Form

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from 'sonner'

// Schema de validación con Zod
const formSchema = z.object({
  title: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().optional(),
  email: z.string().email('Email inválido')
})

type FormValues = z.infer<typeof formSchema>

export function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      email: ''
    }
  })
  
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error en la operación')
      }
      
      toast.success('Operación exitosa')
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido')
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa título" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </Form>
  )
}
```

**Características**:
- Validación con Zod (type-safe)
- Mensajes de error automáticos
- Estados de loading
- Reset de formulario después de submit
- Integración con shadcn/ui Form components

### Patrón de Client Component con Interactividad

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  initialValue?: boolean
}

export function InteractiveComponent({ initialValue = false }: Props) {
  const [state, setState] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  
  const handleAction = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: !state })
      })
      
      if (!response.ok) {
        throw new Error('Error en la operación')
      }
      
      setState(!state)
      toast.success('Operación exitosa')
    } catch (error) {
      toast.error('Error al realizar la operación')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <p>Estado: {state ? 'Activo' : 'Inactivo'}</p>
      <Button 
        onClick={handleAction} 
        disabled={loading}
        variant={state ? 'default' : 'outline'}
      >
        {loading ? 'Procesando...' : 'Cambiar Estado'}
      </Button>
    </div>
  )
}
```

**Características**:
- Usa hooks de React (useState, useEffect, etc.)
- Maneja interactividad del usuario
- Hace requests a APIs
- Muestra feedback con toast
- Maneja estados de loading y error

---

## 🎨 Sistema de Diseño

### Componentes UI (shadcn/ui)

**Ubicación**: `src/components/ui/`

**Componentes Disponibles**:
- `button.tsx` - Botones con variantes
- `input.tsx` - Campos de texto
- `card.tsx` - Tarjetas de contenido
- `dialog.tsx` - Modales
- `dropdown-menu.tsx` - Menús desplegables
- `form.tsx` - Formularios con validación
- `table.tsx` - Tablas de datos
- `toast.tsx` - Notificaciones
- `tabs.tsx` - Pestañas
- Y 20+ componentes más...

**Uso**:
```typescript
import { Button } from '@/components/ui/button'

<Button variant="default" size="lg">
  Click me
</Button>
```

### Variantes de Botones

```typescript
// Variantes de estilo
variant: "default"     // Verde corporativo (primary)
       | "destructive" // Rojo para acciones peligrosas
       | "outline"     // Borde sin relleno
       | "secondary"   // Gris secundario
       | "ghost"       // Sin fondo, solo hover
       | "link"        // Estilo de link

// Tamaños
size: "default"  // Tamaño estándar (h-10 px-4)
    | "sm"       // Pequeño (h-9 px-3)
    | "lg"       // Grande (h-11 px-8)
    | "icon"     // Cuadrado para iconos (h-10 w-10)
```

**Ejemplos de Uso**:
```typescript
import { Button } from '@/components/ui/button'

// Botón primario
<Button variant="default" size="lg">
  Guardar Cambios
</Button>

// Botón de eliminar
<Button variant="destructive" size="default">
  Eliminar
</Button>

// Botón con icono
<Button variant="ghost" size="icon">
  <TrashIcon className="h-4 w-4" />
</Button>

// Botón de link
<Button variant="link" asChild>
  <Link href="/servicios">Ver más</Link>
</Button>
```

### Colores del Tema

**Definidos en**: `src/app/globals.css`

**Modo Claro** (`:root`):
```css
--background: 0 0% 100%           /* Blanco */
--foreground: 222.2 84% 4.9%      /* Casi negro */
--primary: 142 71% 45%            /* Verde corporativo #6BBE45 */
--primary-foreground: 210 40% 98% /* Texto sobre primary */
--secondary: 210 40% 96%          /* Gris claro */
--accent: 210 40% 96%             /* Acento */
--destructive: 0 84% 60%          /* Rojo para eliminar */
--muted: 210 40% 96%              /* Gris suave */
--border: 214.3 31.8% 91.4%       /* Bordes */
--input: 214.3 31.8% 91.4%        /* Inputs */
--ring: 142 71% 45%               /* Focus ring (verde) */
```

**Modo Oscuro** (`.dark`):
```css
--background: 222.2 84% 4.9%      /* Casi negro */
--foreground: 210 40% 98%         /* Casi blanco */
--primary: 142 71% 45%            /* Verde corporativo (mismo) */
--primary-foreground: 222.2 47.4% 11.2% /* Texto sobre primary */
--secondary: 217.2 32.6% 17.5%    /* Gris oscuro */
--accent: 217.2 32.6% 17.5%       /* Acento oscuro */
--destructive: 0 62.8% 30.6%      /* Rojo oscuro */
--muted: 217.2 32.6% 17.5%        /* Gris oscuro suave */
--border: 217.2 32.6% 17.5%       /* Bordes oscuros */
--input: 217.2 32.6% 17.5%        /* Inputs oscuros */
--ring: 142 71% 45%               /* Focus ring (verde) */
```

**Uso en Componentes**:
```typescript
// Clases de Tailwind con variables CSS
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="border-border"
className="ring-ring"
```

**Personalización**:
- Cambiar valores en `globals.css`
- O configurar desde panel admin (campo `primaryColor`)
- Usar formato HSL para mejor control de luminosidad
- Mantener contraste adecuado (WCAG AA: 4.5:1)

---

## 🌍 Integración con Servicios Externos

### Cloudinary

**Propósito**: Almacenamiento y optimización de imágenes

**Configuración**:
```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
```

**Uso**:
```typescript
// Upload
const result = await cloudinary.uploader.upload(file, {
  folder: 'greenaxis',
  resource_type: 'auto'
})

// URL optimizada
const url = cloudinary.url(publicId, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto',
  fetch_format: 'auto'
})
```

### Google Maps

**Configuración**: Variable `googleMapsEmbed` en PlatformConfig (desde `/admin/configuracion`)

**Formato**: Iframe embed de Google Maps

**Componente**: `map-section.tsx`

**Características**:
- Embed responsive con aspect ratio 16:9
- Se muestra solo si `showMapSection` está habilitado
- Lazy loading para mejor performance
- Estilos adaptados a modo oscuro/claro

**Cómo Obtener el Código**:
1. Ir a Google Maps
2. Buscar la ubicación de la empresa
3. Clic en "Compartir" → "Insertar un mapa"
4. Copiar el código iframe
5. Pegar en campo `googleMapsEmbed` en configuración admin

### WhatsApp

**Configuración** (desde `/admin/configuracion`):
- `whatsappNumber` - Número con código de país (ej: +573001234567)
- `whatsappMessage` - Mensaje predefinido que se envía al abrir chat
- `whatsappShowBubble` - Mostrar/ocultar botón flotante

**Componente**: `whatsapp-bubble.tsx`

**Características**:
- Botón flotante siempre visible (fixed position)
- Modal con mensaje personalizable antes de abrir WhatsApp
- Animación de entrada suave
- Icono de WhatsApp con color corporativo
- Responsive en todos los dispositivos
- Se oculta automáticamente si no hay número configurado

**URL generada**:
```
https://wa.me/573001234567?text=Mensaje%20codificado%20en%20URL
```

**Experiencia de Usuario**:
1. Usuario hace clic en botón flotante verde
2. Se abre modal con mensaje predefinido (editable)
3. Usuario puede modificar mensaje antes de enviar
4. Clic en "Enviar" abre WhatsApp Web o app
5. Chat pre-llenado con mensaje personalizado

---

## 📊 Base de Datos

### Turso (Producción)

**Características**:
- SQLite distribuido
- Réplicas en múltiples regiones
- Baja latencia global
- Backups automáticos

**Gestión**:
```bash
# Ver bases de datos
turso db list

# Ver detalles
turso db show greenaxis

# Crear réplica
turso db replicate greenaxis --location lax

# Shell interactivo
turso db shell greenaxis
```

### SQLite Local (Desarrollo)

**Ubicación**: `./db/custom.db`

**Gestión**:
```bash
# Prisma Studio (GUI)
npx prisma studio

# SQLite CLI
sqlite3 db/custom.db
```

### Migraciones

**Desarrollo** (sincronización directa):
```bash
npx prisma db push
```

**Producción** (migraciones versionadas):
```bash
# Crear migración
npx prisma migrate dev --name descripcion_cambio

# Aplicar en producción
npx prisma migrate deploy
```

### Backup y Restauración

**Scripts Implementados**: `scripts/export-data.ts` y `scripts/import-data.ts`

**Exportar datos**:
```bash
npm run db:export
# Genera archivos JSON en /scripts/data/ (o directorio configurado)
```

**Archivos Generados**:
- `platform-config.json` - Configuración general
- `services.json` - Servicios
- `news.json` - Noticias
- `carousel-slides.json` - Slides del carrusel
- `site-images.json` - Imágenes del sitio
- `legal-pages.json` - Páginas legales
- `about-page.json` - Contenido "About"
- `contact-messages.json` - Mensajes de contacto
- `admins.json` - Administradores (sin passwords)

**Importar datos**:
```bash
npm run db:import
# Lee archivos JSON de /scripts/data/ y los inserta en DB
```

**Características**:
- Exportación completa de todos los modelos
- Formato JSON legible y editable
- Preserva relaciones entre entidades
- Útil para migración entre entornos
- Backup antes de cambios importantes
- Restauración rápida en caso de error

**Recomendaciones**:
- Exportar datos antes de actualizaciones importantes
- Guardar backups en ubicación segura (fuera del repo)
- Programar backups automáticos (cron job)
- Probar restauración periódicamente
- Versionar backups con fecha (backup-2026-03-12.zip)

---

## 🎯 Roadmap y Mejoras Futuras

### ✅ Completado (v0.2.0)

1. ✅ **Arquitectura y configuración inicial**
   - Setup Next.js 16 con App Router
   - Prisma con Turso Database
   - shadcn/ui y Tailwind CSS 4
   - Estructura de base de datos completa

2. ✅ **Panel de administración**
   - Sistema de login con bcrypt
   - 9 secciones de gestión de contenido
   - Dashboard con resumen
   - Drag & drop para reordenar

3. ✅ **Páginas públicas y componentes**
   - Landing page con carrusel
   - Servicios, Blog, Contacto, Quiénes Somos
   - Páginas legales editables
   - Componentes responsive

4. ✅ **Funcionalidades especiales**
   - WhatsApp flotante con modal
   - Redes sociales configurables
   - Modo oscuro/claro
   - Google Maps y Analytics

5. ✅ **Seguridad y optimización**
   - Headers de seguridad completos
   - Rate limiting
   - Validación de inputs
   - XSS protection (disponible)
   - Audit de seguridad (8.5/10)

### Prioridad Alta (Pendiente)

1. **Fix de Caché de Next.js** (CRÍTICO)
   - Implementar `revalidatePath()` en endpoints de mutación
   - Garantizar que cambios se reflejen inmediatamente
   - Testing exhaustivo de invalidación
   - **Documentación**: `.kiro/specs/nextjs-cache-invalidation-fix/`

2. **Logging Estructurado**
   - Implementar Pino o Winston
   - Redactar campos sensibles (password, token, email)
   - Configurar agregación de logs (Datadog, Sentry)

3. **Monitoreo de Errores**
   - Integrar Sentry para error tracking
   - Configurar alertas automáticas
   - Dashboard de métricas de performance

### Prioridad Media (Mejoras Futuras)

4. **Autenticación de Dos Factores (2FA)**
   - Agregar TOTP con `@auth/core` o similar
   - QR code para configuración inicial
   - Códigos de backup de emergencia
   - Verificación obligatoria en login

5. **Internacionalización (i18n)**
   - Configurar `next-intl` (ya instalado)
   - Traducir a inglés
   - Selector de idioma en header
   - Rutas con locale: `/[locale]/servicios`

6. **Sitemap y SEO Avanzado**
   - Generar sitemap.xml automático
   - Mejorar metadatos de páginas dinámicas
   - Implementar structured data (JSON-LD)
   - Open Graph tags optimizados

7. **Testing Automatizado**
   - Tests unitarios con Vitest
   - Tests de integración para APIs
   - Tests E2E con Playwright
   - Tests de seguridad automatizados

### Prioridad Baja (Futuro)

8. **Dashboard de Analytics Interno**
   - Métricas de visitantes en panel admin
   - Gráficos de tráfico con Recharts
   - Reportes de mensajes de contacto
   - Estadísticas de servicios más visitados

9. **Sistema de Notificaciones**
   - Notificaciones push para admins (nuevos mensajes)
   - Alertas de nuevos mensajes de contacto
   - Recordatorios de tareas pendientes
   - Notificaciones por email

10. **Optimización de Imágenes Avanzada**
    - Lazy loading avanzado con Intersection Observer
    - Blur placeholder automático
    - Responsive images con srcset automático
    - Conversión automática a WebP/AVIF

11. **Búsqueda Global**
    - Búsqueda en servicios y noticias
    - Autocompletado
    - Filtros avanzados
    - Resultados destacados

12. **Gestión de Roles y Permisos**
    - Roles: superadmin, admin, editor
    - Permisos granulares por sección
    - Audit log de cambios
    - Historial de modificaciones

---

## 🔧 Scripts y Utilidades

### Scripts de Base de Datos

**Ubicación**: `scripts/`

**1. export-data.ts** - Exportación de datos a JSON:
```bash
npm run db:export
# O directamente: tsx scripts/export-data.ts
```

**Funcionalidad**:
- Exporta todos los modelos de Prisma a archivos JSON
- Crea directorio `/scripts/data/` si no existe
- Genera un archivo por modelo
- Formato JSON legible (pretty-printed)
- Útil para backups y migración de datos

**2. import-data.ts** - Importación de datos desde JSON:
```bash
npm run db:import
# O directamente: tsx scripts/import-data.ts
```

**Funcionalidad**:
- Lee archivos JSON de `/scripts/data/`
- Inserta datos en base de datos
- Maneja relaciones entre entidades
- Útil para restauración y seeding

**3. seed-services.ts** - Seed de servicios de ejemplo:
```bash
tsx scripts/seed-services.ts
```

**Funcionalidad**:
- Crea servicios de ejemplo para desarrollo
- Útil para testing y demos
- Datos de ejemplo de servicios ambientales

### Comandos Útiles de Desarrollo

**Desarrollo**:
```bash
npm run dev          # Servidor de desarrollo (puerto 3000)
npm run lint         # Linter (ESLint 9)
npx prisma studio    # GUI para base de datos (puerto 5555)
tail -f server.log   # Ver logs en tiempo real (producción)
```

**Base de Datos**:
```bash
npx prisma generate              # Generar cliente Prisma
npx prisma db push               # Sincronizar schema (dev)
npx prisma migrate dev           # Crear migración
npx prisma migrate deploy        # Aplicar migraciones (prod)
npx prisma migrate reset         # Resetear DB (⚠️ elimina datos)
npm run db:export                # Backup de datos
npm run db:import                # Restaurar datos
```

**Build y Producción**:
```bash
npm run build                    # Build de producción
npm run start                    # Servidor de producción (Bun)
ls -la .next/standalone          # Verificar output standalone
```

**Turso CLI**:
```bash
turso db list                    # Listar bases de datos
turso db show greenaxis          # Ver detalles de DB
turso db shell greenaxis         # Shell interactivo SQL
turso db tokens create greenaxis # Crear token de acceso
turso db replicate list greenaxis # Ver réplicas
```

**Git**:
```bash
git status                       # Ver cambios
git add .                        # Agregar todos los cambios
git commit -m "mensaje"          # Commit
git push origin main             # Push a remoto
git checkout -b feature/nombre   # Crear branch
```

---

## 📝 Convenciones de Código

### Nomenclatura

**Archivos**:
- Componentes: `kebab-case.tsx` (hero-carousel.tsx)
- Utilidades: `kebab-case.ts` (auth.ts)
- Tipos: `PascalCase` (Admin, Service)

**Variables y Funciones**:
- camelCase para variables y funciones
- PascalCase para componentes React
- UPPER_CASE para constantes

**Rutas**:
- kebab-case para URLs (/quienes-somos)
- [slug] para rutas dinámicas

### Estructura de Componentes

```typescript
'use client'  // Si es Client Component

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  onAction?: () => void
}

export function MyComponent({ title, onAction }: Props) {
  const [state, setState] = useState(false)
  
  return (
    <div className="container mx-auto">
      <h1>{title}</h1>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}
```

### Imports

**Orden recomendado**:
1. Imports de React y Next.js
2. Imports de librerías externas
3. Imports de componentes UI
4. Imports de componentes propios
5. Imports de utilidades y tipos
6. Imports de estilos

**Alias**: Usar `@/` para imports desde `src/`

---

## 🚀 Quick Start para Nuevos Desarrolladores

### Día 1: Setup

```bash
# 1. Clonar repo
git clone <repo-url>
cd greenaxis

# 2. Instalar dependencias
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env con credenciales de desarrollo

# 4. Setup de base de datos
npx prisma generate
npx prisma db push

# 5. Iniciar desarrollo
npm run dev

# 6. Abrir navegador
# http://localhost:3000
```

### Día 2: Exploración

1. **Revisar estructura del proyecto**:
   - Explorar `src/app/` para entender rutas (8 páginas públicas + 9 admin)
   - Revisar `src/components/` para ver componentes (30+ componentes)
   - Leer `prisma/schema.prisma` para entender datos (11 modelos)
   - Revisar `src/lib/auth.ts` para entender autenticación
   - Leer `src/middleware.ts` para entender seguridad

2. **Crear primer admin**:
   - Visitar http://localhost:3000/portal-interno
   - Completar formulario de setup (si no existe admin)
   - Login con credenciales creadas
   - Explorar dashboard en /admin

3. **Explorar panel admin**:
   - Navegar por todas las 9 secciones
   - Crear servicio de prueba con icono e imagen
   - Crear noticia de prueba con Editor.js
   - Actualizar configuración general
   - Agregar slide al carrusel
   - Subir imagen de prueba
   - Editar página legal
   - Revisar mensajes de contacto (si hay)

4. **Ver cambios en sitio público**:
   - Visitar home, servicios, noticias
   - ⚠️ Nota: Puede requerir hard refresh por bug de caché (Ctrl+Shift+R)
   - Probar formulario de contacto
   - Verificar WhatsApp flotante
   - Cambiar entre modo claro/oscuro
   - Probar responsive en móvil (DevTools)

### Día 3: Primera Contribución

1. **Crear branch de feature**:
```bash
git checkout -b feature/mi-feature
# O para bugfix: git checkout -b fix/nombre-del-bug
```

2. **Hacer cambios**:
   - Editar archivos necesarios
   - Seguir convenciones de código (kebab-case, camelCase, PascalCase)
   - Agregar comentarios si es complejo
   - Actualizar tipos de TypeScript si es necesario
   - Probar cambios localmente

3. **Probar localmente**:
```bash
npm run lint                    # Verificar linting
npm run build                   # Verificar que build funciona
npm run start                   # Probar en modo producción
# Probar funcionalidad manualmente en navegador
```

4. **Commit y push**:
```bash
git add .
git commit -m "feat: descripción del cambio"
# O: git commit -m "fix: descripción del bug"
git push origin feature/mi-feature
```

**Convenciones de Commits**:
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato (no afectan código)
- `refactor:` - Refactorización de código
- `test:` - Agregar o modificar tests
- `chore:` - Tareas de mantenimiento

5. **Crear Pull Request**:
   - Describir cambios claramente
   - Mencionar issues relacionados (#123)
   - Agregar screenshots si hay cambios visuales
   - Solicitar review del equipo
   - Responder a comentarios de review

---

## 📞 Contacto y Soporte

### Equipo de Desarrollo

**Desarrollador Principal**: [Nombre]  
**Email**: [email]  
**Repositorio**: [URL del repo]

### Recursos de Ayuda

- **Documentación del Proyecto**: Este archivo
- **Issues de GitHub**: Para reportar bugs
- **Pull Requests**: Para contribuir código
- **Slack/Discord**: [Canal de comunicación del equipo]

---

## 📄 Licencia y Uso

**Propietario**: Green Axis S.A.S.  
**Tipo**: Aplicación corporativa privada  
**Uso**: Exclusivo para Green Axis S.A.S.

---

## 🔄 Changelog

### v0.2.0 (Actual - Marzo 12, 2026)

**Agregado**:
- Sistema de autenticación completo con bcrypt
- Panel de administración con 9 secciones
- Editor de contenido rico (Editor.js) con 15+ herramientas
- Gestión de imágenes con Cloudinary y sistema de keys únicas
- Rate limiting en contacto (5 req/min) y login (5 intentos)
- Headers de seguridad completos (CSP, HSTS, X-Frame-Options, etc.)
- Audit de seguridad completo (8.5/10)
- Página "Quiénes Somos" completamente editable
- Sistema de recuperación de contraseña con tokens
- Carrusel principal con animaciones y gradientes configurables
- Gestión de páginas legales con Editor.js
- Sistema de mensajes de contacto con bandeja de entrada
- Integración con Google Maps y Analytics
- Soporte para feeds de redes sociales
- Botón flotante de WhatsApp configurable
- Scripts de exportación/importación de datos
- Middleware con protección de rutas y rate limiting

**Conocido**:
- Bug de caché de Next.js (workaround disponible, fix diseñado)

**Mejoras de Seguridad**:
- XSS protection disponible (configurable)
- Validación de magic bytes en uploads
- Path traversal protection
- Input sanitization en todos los endpoints

### v0.1.0 (Inicial)

- Estructura básica del proyecto
- Sitio público con páginas principales
- Integración con Turso
- Componentes UI básicos con shadcn/ui

---

## 🎯 Checklist de Producción

### Pre-Despliegue

- [ ] Actualizar .gitignore con exclusiones necesarias
- [ ] Configurar todas las variables de entorno en servidor
- [ ] Verificar credenciales de Turso
- [ ] Verificar credenciales de Cloudinary
- [ ] Verificar credenciales de Resend
- [ ] Actualizar `next.config.ts` con dominios correctos
- [ ] Ejecutar `npm audit` y corregir vulnerabilidades
- [ ] Habilitar XSS protection (opcional pero recomendado)
- [ ] Configurar Google Analytics
- [ ] Configurar dominio personalizado

### Durante el Despliegue

- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npx prisma generate`
- [ ] Ejecutar `npm run build`
- [ ] Verificar generación de `.next/standalone`
- [ ] Aplicar migraciones: `npx prisma migrate deploy`
- [ ] Verificar que el servidor inicia correctamente

### Post-Despliegue

- [ ] Verificar conexión a Turso
- [ ] Verificar carga de imágenes desde Cloudinary
- [ ] Crear primer administrador
- [ ] Probar login de admin
- [ ] Verificar funcionalidad del panel de administración
- [ ] Probar formulario de contacto
- [ ] Verificar envío de emails
- [ ] Revisar logs del servidor
- [ ] Configurar monitoreo de errores (Sentry)
- [ ] Configurar backups automáticos
- [ ] Probar recuperación de contraseña
- [ ] Verificar headers de seguridad
- [ ] Probar en múltiples dispositivos y navegadores

---

## 🎓 Glosario Técnico

**App Router**: Sistema de routing de Next.js 13+ basado en carpetas en `src/app/`

**Server Component**: Componente React que se ejecuta solo en el servidor

**Client Component**: Componente React que se ejecuta en el navegador (requiere 'use client')

**Server Action**: Función que se ejecuta en el servidor pero puede ser llamada desde el cliente

**API Route**: Endpoint HTTP en Next.js (archivos route.ts)

**Prisma**: ORM (Object-Relational Mapping) para TypeScript

**Turso**: Base de datos SQLite distribuida con réplicas edge

**LibSQL**: Fork de SQLite compatible con Turso

**shadcn/ui**: Colección de componentes UI copiables (no es librería npm)

**Radix UI**: Primitivos UI accesibles sin estilos

**Editor.js**: Editor de bloques modular para contenido rico

**Rate Limiting**: Limitación de requests por tiempo para prevenir abuso

**CSRF**: Cross-Site Request Forgery (ataque de falsificación de peticiones)

**XSS**: Cross-Site Scripting (inyección de scripts maliciosos)

**CSP**: Content Security Policy (política de seguridad de contenido)

**HSTS**: HTTP Strict Transport Security (forzar HTTPS)

---

## 📖 Apéndices

### A. Estructura Completa de Archivos

```
greenaxis/
├── .dockerignore                 # Archivos excluidos de Docker
├── .env                          # Variables de entorno (NO commitear)
├── .gitignore                    # Archivos excluidos de Git
├── .kiro/                        # Configuración de Kiro IDE
│   ├── security-audit-report.md  # Audit de seguridad (8.5/10)
│   ├── settings/                 # Configuración de Kiro
│   └── specs/                    # Especificaciones técnicas
│       ├── deployment-automation-guide/  # Feature spec de despliegue
│       └── nextjs-cache-invalidation-fix/ # Bugfix spec de caché
├── bun.lock                      # Lockfile de Bun
├── Caddyfile                     # Configuración de Caddy (reverse proxy)
├── components.json               # Configuración de shadcn/ui
├── db/
│   └── custom.db                 # Base de datos SQLite local (desarrollo)
├── download/                     # Directorio de descargas (temporal)
├── editorjs-i18n.json           # Traducciones de Editor.js (español)
├── eslint.config.mjs            # Configuración de ESLint 9
├── examples/                     # Ejemplos de código
│   └── websocket/               # Ejemplo de WebSocket (frontend + server)
├── mini-services/               # Microservicios auxiliares (vacío)
├── next-env.d.ts                # Tipos de Next.js
├── next.config.ts               # Configuración de Next.js
├── package.json                 # Dependencias y scripts
├── package-lock.json            # Lockfile de npm
├── postcss.config.mjs           # Configuración de PostCSS
├── prisma/
│   ├── db/
│   │   └── custom.db            # Copia de DB
│   └── schema.prisma            # Schema de base de datos (11 modelos)
├── public/
│   ├── favicon.png              # Favicon del sitio
│   ├── logo.png                 # Logo corporativo
│   ├── logo.svg                 # Logo en SVG
│   ├── robots.txt               # Configuración de crawlers
│   └── uploads/                 # Archivos subidos (desarrollo)
├── scripts/
│   ├── export-data.ts           # Script de exportación a JSON
│   ├── import-data.ts           # Script de importación desde JSON
│   └── seed-services.ts         # Seed de servicios de ejemplo
├── src/
│   ├── app/                     # App Router de Next.js
│   │   ├── admin/              # Panel de administración (9 secciones)
│   │   ├── api/                # API Routes (11 endpoints)
│   │   ├── contacto/           # Página de contacto
│   │   ├── noticias/           # Blog de noticias
│   │   ├── portal-interno/     # Login y recuperación
│   │   ├── privacidad/         # Política de privacidad
│   │   ├── quienes-somos/      # Página "About"
│   │   ├── servicios/          # Página de servicios
│   │   ├── terminos/           # Términos y condiciones
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Estilos globales
│   │   └── editor-styles.css   # Estilos de Editor.js
│   ├── components/              # Componentes React (30+)
│   │   ├── ui/                 # Componentes shadcn/ui (30+)
│   │   └── *.tsx               # Componentes de página
│   ├── lib/                     # Utilidades y lógica
│   │   ├── auth.ts             # Sistema de autenticación
│   │   ├── db.ts               # Cliente Prisma
│   │   ├── actions.ts          # Server Actions
│   │   └── utils.ts            # Utilidades generales
│   └── middleware.ts            # Middleware de Next.js
└── DOCUMENTACION-PROYECTO.md    # Este archivo
```

**Archivos Clave**:
- `prisma/schema.prisma` - Define estructura de datos (11 modelos)
- `src/middleware.ts` - Seguridad, rate limiting, protección de rutas
- `src/lib/auth.ts` - Sistema de autenticación completo
- `next.config.ts` - Configuración de Next.js (standalone output)
- `.env` - Variables de entorno (NO commitear)
- `Caddyfile` - Configuración de reverse proxy

### B. Endpoints Completos

**Públicos** (sin autenticación):
- `GET /api/config` - Configuración general del sitio
- `GET /api/servicios` - Lista de servicios activos
- `GET /api/noticias` - Lista de noticias publicadas (paginado)
- `POST /api/contacto` - Enviar mensaje de contacto (rate limited)
- `GET /api/carrusel` - Slides del carrusel activos
- `GET /api/legal` - Páginas legales (términos, privacidad)
- `GET /api/about` - Contenido completo de "Quiénes Somos"
- `GET /api/imagenes` - Imágenes del sitio por categoría

**Administración** (requieren auth):
- `PUT /api/admin/config` - Actualizar configuración general
- `GET/POST/DELETE /api/admin/images` - Gestión de imágenes del sitio
- `POST/PUT/DELETE /api/servicios` - CRUD servicios
- `POST/PUT/DELETE /api/noticias` - CRUD noticias
- `POST/PUT/DELETE /api/carrusel` - CRUD carrusel
- `PUT /api/legal` - Actualizar páginas legales
- `GET/PUT /api/about` - Gestión de contenido "About"
- `GET /api/admin/mensajes` - Mensajes de contacto (solo lectura)

**Autenticación**:
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Verificar sesión
- `POST /api/auth/setup` - Crear primer admin
- `POST /api/auth/reset-password` - Recuperar contraseña
- `POST /api/auth/delete-account` - Eliminar cuenta

**Utilidades**:
- `POST /api/upload` - Subir archivo
- `DELETE /api/upload` - Eliminar archivo

### C. Modelos de Datos Completos

Ver `prisma/schema.prisma` para definiciones completas de:
- PlatformConfig (configuración general)
- Service (servicios)
- News (noticias)
- CarouselSlide (carrusel)
- SiteImage (imágenes)
- ContactMessage (mensajes)
- Admin (administradores)
- LegalPage (páginas legales)
- AboutPage (página "About")
- PasswordResetToken (tokens de recuperación)
- SocialFeedConfig (feeds de redes sociales)

### D. Componentes UI Disponibles

**Formularios**:
- Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider

**Layout**:
- Card, Separator, Aspect Ratio, Scroll Area, Resizable Panels

**Navegación**:
- Tabs, Accordion, Collapsible, Navigation Menu, Menubar

**Overlays**:
- Dialog, Alert Dialog, Popover, Tooltip, Hover Card, Context Menu

**Feedback**:
- Toast, Progress, Avatar, Badge

**Data Display**:
- Table, Command (búsqueda), Calendar, Date Picker

---

## 🎯 Casos de Uso Comunes

### Agregar un Nuevo Servicio

**Desde Panel Admin**:
1. Login en /portal-interno
2. Ir a /admin/servicios
3. Clic en "Nuevo Servicio"
4. Completar formulario:
   - Título
   - Descripción corta
   - Contenido detallado
   - Seleccionar icono
   - Subir imagen
   - Marcar como activo/destacado
5. Guardar
6. ⚠️ Hard refresh en /servicios para ver cambio

**Desde Código**:
```typescript
await db.service.create({
  data: {
    title: 'Nuevo Servicio',
    description: 'Descripción corta',
    content: 'Contenido detallado en markdown',
    icon: 'Leaf',
    imageUrl: '/uploads/imagen.jpg',
    order: 0,
    active: true,
    featured: false
  }
})
```

### Publicar una Noticia

**Desde Panel Admin**:
1. Login en /portal-interno
2. Ir a /admin/noticias
3. Clic en "Nueva Noticia"
4. Completar formulario:
   - Título
   - Slug (URL amigable)
   - Excerpt (resumen)
   - Contenido (Editor.js)
   - Imagen de portada
   - Autor
   - Marcar como publicado
5. Guardar
6. ⚠️ Hard refresh en /noticias para ver cambio

### Actualizar Configuración General

**Desde Panel Admin**:
1. Login en /portal-interno
2. Ir a /admin/configuracion
3. Editar campos:
   - Nombre del sitio
   - Slogan
   - Logo
   - Datos de contacto
   - Redes sociales
   - WhatsApp
4. Guardar
5. ⚠️ Hard refresh en home para ver cambios

### Gestionar Carrusel Principal

**Desde Panel Admin**:
1. Login en /portal-interno
2. Ir a /admin/carrusel
3. Ver lista de slides existentes
4. Agregar nuevo slide:
   - Título, subtítulo, descripción
   - Imagen de fondo
   - Texto y URL de botón
   - Opciones de gradiente y animación
5. Reordenar slides (drag & drop)
6. Activar/desactivar slides
7. Guardar
8. ⚠️ Hard refresh en home para ver cambios

---

## 🔐 Seguridad: Resumen de Audit

### Fortalezas

✅ **Autenticación robusta** con bcrypt (12 rounds)  
✅ **Headers de seguridad completos** (CSP, HSTS, X-Frame-Options, etc.)  
✅ **Rate limiting** en endpoints críticos  
✅ **Prevención de SQL injection** vía Prisma  
✅ **Validación de file uploads** con magic bytes  
✅ **Protección contra path traversal**  
✅ **Validación y sanitización de inputs**  
✅ **Cookies seguras** (httpOnly, secure, sameSite)

### Áreas de Mejora

🟡 **XSS protection disponible pero deshabilitada** (habilitar para mayor seguridad)  
🟡 **Logging básico** (implementar logging estructurado)  
🟢 **Dependency audit** (ejecutar npm audit regularmente)

### Puntuación Final: 8.5/10

**Veredicto**: ✅ **PRODUCCIÓN READY** - La aplicación cumple con estándares empresariales de seguridad para su caso de uso.

---

## 🎉 Conclusión

Este proyecto es una aplicación web corporativa completa y bien estructurada con:

- **Arquitectura moderna** con Next.js 16 App Router y React 19
- **Seguridad robusta** con autenticación bcrypt, rate limiting y headers de seguridad completos (8.5/10)
- **Base de datos distribuida** con Turso para baja latencia global y réplicas edge
- **CMS integrado** con Editor.js (15+ herramientas) para gestión de contenido sin código
- **Panel de administración completo** con 9 secciones para gestionar todo el sitio
- **Optimización de imágenes** con Cloudinary (CDN global, formatos modernos)
- **Código limpio y mantenible** con TypeScript, Prisma y componentes reutilizables
- **Responsive design** mobile-first con Tailwind CSS 4
- **Drag & drop** para reordenar servicios y carrusel
- **Sistema de backup** con scripts de exportación/importación
- **Middleware robusto** con protección de rutas y rate limiting
- **Recuperación de contraseña** con tokens seguros de un solo uso
- **Modo oscuro/claro** con persistencia

**Estado Actual**: ✅ Producción ready con un bug conocido de caché (workaround disponible, fix diseñado y documentado).

**Próximos Pasos Recomendados**: 
1. Implementar fix de caché (prioridad alta)
2. Mejorar logging estructurado (prioridad media)
3. Agregar testing automatizado (prioridad media)
4. Considerar 2FA para admins (prioridad baja)

**Puntuación de Seguridad**: 8.5/10 (Enterprise Ready)

---

**Última Actualización**: Marzo 12, 2026  
**Versión del Documento**: 1.1.0  
**Versión de la Aplicación**: 0.2.0


---

## 📝 Changelog

### Versión 0.3.0 (Marzo 12, 2026)

**Biblioteca de Medios Completa** - Sistema profesional de gestión de archivos multimedia

**Mejoras de UX - Manejo de Errores de Subida**:

- **Validación previa de tamaño**: Los archivos se validan antes de enviarlos al servidor, evitando uploads innecesarios
- **Manejo del error 413 (Payload Too Large)**: Detección específica cuando el servidor rechaza archivos grandes
- **Mensajes claros y útiles**: Se muestra el tamaño del archivo y se explica que es demasiado grande para el plan actual
- **Alternativa práctica**: Todos los mensajes de error incluyen sugerencia de subir directamente a Cloudinary Console con link directo
- **Implementado en todos los puntos de entrada**:
  - Biblioteca de medios (media-picker)
  - Página de gestión de imágenes
  - Editor.js (herramientas de imagen, video y audio)

**Ejemplo de mensaje de error**:
```
El archivo es demasiado grande (7.2 MB) para el plan actual.

💡 Alternativa: Sube el archivo directamente a Cloudinary Console 
(https://console.cloudinary.com) y copia la URL para usarla aquí.
```

**Nuevas Características**:

1. **Detección de Duplicados**:
   - Cálculo de hash SHA-256 del contenido de archivos
   - Detección automática de archivos idénticos antes de subir
   - Opción de reutilizar archivo existente o subir como nuevo
   - Ahorro de espacio de almacenamiento y costos de Cloudinary

2. **Gestión de Referencias Automática**:
   - Sistema de tracking que detecta dónde se usa cada archivo
   - Verificación en servicios, noticias, carrusel, configuración, páginas legales, about
   - Prevención de eliminación accidental de archivos en uso
   - Lista detallada de referencias con links directos
   - Eliminación forzada con limpieza automática de referencias

3. **Metadatos Completos**:
   - Label, description, alt text, category
   - MIME type, file size, dimensions, duration
   - Hash SHA-256 para detección de duplicados
   - Timestamps de creación y actualización
   - Edición inline de metadatos

4. **Interfaz de Usuario Mejorada**:
   - Grid responsive con previews de archivos
   - Búsqueda y filtrado por categoría
   - Drag & drop para subir archivos
   - Preview de imágenes, audio y video
   - Indicadores visuales de archivos en uso
   - Confirmación antes de eliminar con lista de referencias

5. **Eliminación Segura con Cloudinary**:
   - Eliminación automática de archivos de Cloudinary
   - Intento con diferentes tipos de recursos (image, video, raw)
   - Manejo de errores graceful
   - Limpieza completa de base de datos y almacenamiento

**Nuevos Componentes**:
- `media-library-browser.tsx` - Navegador principal de biblioteca
- `media-card.tsx` - Card de archivo con preview y acciones
- `media-picker.tsx` - Selector modal para formularios

**Nuevos Endpoints API**:
- `GET /api/admin/media` - Listar archivos con filtros
- `POST /api/admin/media` - Registrar nuevo archivo
- `PUT /api/admin/media/:id` - Actualizar metadatos
- `DELETE /api/admin/media/:id` - Eliminar archivo con verificación
- `GET /api/admin/media/check-references` - Verificar referencias

**Nuevas Utilidades**:
- `src/lib/media-references.ts` - Sistema de tracking de referencias
  - `findMediaReferences(url)` - Encuentra dónde se usa un archivo
  - `updateMediaReferences(oldUrl, newUrl)` - Actualiza referencias masivamente

**Mejoras en Base de Datos**:
- Nuevos campos en modelo `SiteImage`:
  - `mimeType` - Tipo MIME del archivo
  - `fileSize` - Tamaño en bytes
  - `width`, `height` - Dimensiones (imágenes)
  - `duration` - Duración (audio/video)
  - `hash` - Hash SHA-256 para detección de duplicados

**Soporte Multi-formato**:
- Imágenes: jpg, jpeg, png, gif, webp, svg
- Audio: mp3, wav, ogg
- Video: mp4, webm, mov

**Integración con Editor.js**:
- Selector de medios integrado en herramientas de imagen, audio y video
- Reutilización fácil de archivos existentes
- Upload directo desde el editor

**Compatibilidad**:
- Sistema legacy de keys únicas sigue funcionando
- Migración gradual de sistema antiguo a nuevo
- Ambos sistemas coexisten sin problemas

**Documentación**:
- Documentación completa de API endpoints
- Guías de uso de componentes
- Ejemplos de integración
- Documentación de utilidades

---

### Versión 0.2.0 (Marzo 10, 2026)

**Lanzamiento Inicial** - Sistema completo de gestión de contenido

**Características Principales**:
- Sitio público con 8 páginas responsive
- Panel de administración con 9 secciones
- Autenticación segura con bcrypt
- Editor de contenido con Editor.js
- Gestión de imágenes con Cloudinary
- Sistema de contacto con rate limiting
- Carrusel configurable con drag & drop
- Páginas legales editables
- Recuperación de contraseña
- Modo oscuro/claro
- Headers de seguridad completos
- Middleware de protección de rutas

**Estado**: Producción ready con bug conocido de caché

---

**Última Actualización del Documento**: Marzo 12, 2026
**Versión del Documento**: 1.2.0
