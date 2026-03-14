--------------------------------------------------------------------------------
🎯 Descripción General
Green Axis S.A.S. es una solución web corporativa integral diseñada para empresas de servicios ambientales
. La plataforma combina un sitio público de alto rendimiento con un panel administrativo robusto (CMS) que permite gestionar el 100% del contenido de forma autónoma, segura y sin necesidad de conocimientos de programación
.

--------------------------------------------------------------------------------
🌐 Sitio Público (Experiencia del Usuario)
El sitio está construido bajo una arquitectura mobile-first, garantizando una visualización óptima en celulares, tablets y computadoras
.
Página Principal Dinámica: Incluye un carrusel de imágenes con animaciones avanzadas, gradientes configurables y llamadas a la acción (CTA)
.
Gestión de Servicios: Catálogo interactivo con iconos personalizados y descripciones detalladas de la oferta ambiental
.
Blog de Noticias: Sistema de publicaciones con paginación, categorías y contenido enriquecido
.
Página "Quiénes Somos": Sección completa para historia, misión, visión, valores y equipo de trabajo, totalmente editable
.
Centro de Contacto: Formulario con validación en tiempo real y protección contra spam (rate limiting)
.
Interactividad:
Botón flotante de WhatsApp con mensaje preconfigurado
.
Integración de mapas interactivos de Google Maps
.
Modo oscuro y claro con persistencia automática según la preferencia del usuario
.

--------------------------------------------------------------------------------
🛠️ Panel de Administración (Gestión Integral)
Un ecosistema privado y seguro para controlar cada aspecto de la presencia digital de la empresa
.
Dashboard Central: Resumen ejecutivo del contenido y estado del sitio
.
Editor de Texto Enriquecido (Editor.js): Permite crear noticias y páginas legales usando un sistema de bloques (similar a Notion), permitiendo insertar imágenes, videos, audios, citas y listas de forma visual
.
Organización por Arrastre (Drag & Drop): Permite reordenar el carrusel de inicio y los servicios simplemente arrastrando los elementos en la pantalla
.
Configuración Global de Marca: Gestión de logotipos, colores principales del tema, enlaces a redes sociales y datos de contacto desde un solo lugar
.

--------------------------------------------------------------------------------
📁 Nueva Biblioteca de Medios (Funcionalidad v0.3.0)
El sistema incluye una biblioteca de medios profesional que optimiza el almacenamiento y la gestión de archivos
.
Detección de Duplicados: El sistema utiliza tecnología de hash SHA-256 para identificar si un archivo ya ha sido subido anteriormente, evitando el uso innecesario de almacenamiento
.
Gestión de Referencias: Antes de eliminar cualquier imagen o video, el sistema verifica en qué secciones (servicios, noticias, etc.) se está utilizando, previniendo errores de "enlaces rotos"
.
Soporte Multi-formato: Compatibilidad total para imágenes (JPG, PNG, WebP, SVG), audio (MP3, WAV) y video (MP4, WebM)
.
Optimización Automática: Integración con Cloudinary (CDN Global) para que las imágenes carguen instantáneamente en cualquier parte del mundo
.

--------------------------------------------------------------------------------
🔒 Seguridad y Rendimiento
La plataforma ha sido diseñada bajo estándares de seguridad empresarial (Puntuación 8.5/10)
.
Protección de Acceso: Autenticación segura mediante algoritmos de cifrado avanzado (Bcrypt de 12 rondas)
.
Seguridad de Datos: Base de datos distribuida (Turso/LibSQL) que garantiza que la información esté replicada y siempre disponible
.
Navegación Segura: Implementación de cabeceras de seguridad completas (CSP, HSTS) y protección contra ataques comunes de la web
.
Optimización SEO: Estructura preparada para motores de búsqueda, metadatos configurables e integración nativa con Google Analytics

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
🛡️ Seguridad
Puntuación General: 8.5/10 (Producción Ready)
El proyecto ha pasado por un audit de seguridad completo documentado en .kiro/security-audit-report.md. La aplicación cumple con los estándares de OWASP Top 10 2021 y está lista para producción.

Middleware de Seguridad
Archivo: src/middleware.ts

Funcionalidades Implementadas:

Headers de Seguridad (aplicados a todas las rutas):

X-Frame-Options: DENY - Previene clickjacking
X-Content-Type-Options: nosniff - Previene MIME sniffing
X-XSS-Protection: 1; mode=block - Filtro XSS legacy
Referrer-Policy: strict-origin-when-cross-origin - Control de referrer
Permissions-Policy - Deshabilita APIs sensibles (camera, microphone, geolocation)
Strict-Transport-Security - Fuerza HTTPS (max-age=31536000; includeSubDomains)
Content-Security-Policy - Políticas detalladas de contenido
Rate Limiting:

/api/contacto (POST): 5 requests por minuto por IP
/api/auth/login (POST): 5 intentos, 15 minutos de lockout
Implementado con Map en memoria (resetea con restart del servidor)
Protección de Rutas:

Verifica autenticación en todas las rutas /admin/*
Redirect a /portal-interno si no hay sesión válida
Permite acceso público a rutas no protegidas
Content Security Policy (CSP):

default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: https: blob:
font-src 'self' data:
connect-src 'self' https://www.google-analytics.com
frame-src 'self' https://www.google.com https://www.youtube.com
media-src 'self' blob: data:
Headers de Seguridad (Implementados)
Archivo: src/middleware.ts

'X-Frame-Options': 'DENY'                    // Previene clickjacking
'X-Content-Type-Options': 'nosniff'          // Previene MIME sniffing
'X-XSS-Protection': '1; mode=block'          // Filtro XSS legacy
'Referrer-Policy': 'strict-origin-when-cross-origin'
'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
'Content-Security-Policy': [políticas detalladas]
Rate Limiting
Implementado en: src/middleware.ts

Endpoints Protegidos:

Login (/api/auth/login):

Límite: 5 intentos fallidos por email
Ventana: 15 minutos
Almacenamiento: Map en memoria (por email)
Mensaje: "Demasiados intentos de login. Intenta de nuevo en X minutos"
Reset: Automático después de 15 minutos
Contacto (/api/contacto):

Límite: 5 requests por IP
Ventana: 1 minuto (60 segundos)
Almacenamiento: Map en memoria (por IP)
Mensaje: "Demasiadas solicitudes. Por favor espera un momento"
Reset: Automático después de 1 minuto
Implementación:

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

📱 Responsive Design
Breakpoints (Tailwind CSS 4)
sm: 640px   - Móviles grandes (landscape)
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Pantallas grandes
Componentes Responsive
Todos los componentes están optimizados para móvil con enfoque mobile-first:

Header:

Menú hamburguesa en móvil (< md)
Navegación completa en desktop (≥ md)
Logo responsive con tamaños adaptativos
Toggle de tema visible en todos los tamaños
Carrusel:

Imágenes adaptativas con object-fit
Textos con tamaños responsive (text-2xl → text-5xl)
Botones con padding adaptativo
Controles de navegación ocultos en móvil
Grids:

Servicios: 1 columna (móvil) → 2 (tablet) → 3 (desktop)
Noticias: 1 columna (móvil) → 2 (tablet) → 3 (desktop)
Valores/Features: 1 columna (móvil) → 2 (desktop)
Formularios:

Inputs con tamaño touch-friendly (min 44px altura)
Labels siempre visibles
Mensajes de error claros
Botones de tamaño adecuado para touch
Imágenes:

Next.js Image con optimización automática
Lazy loading nativo
Placeholder blur (opcional)
Formatos modernos (WebP, AVIF) vía Cloudinary
Panel Admin:

Sidebar colapsable en móvil
Tablas con scroll horizontal en móvil
Formularios apilados en móvil
Drag & drop compatible con touch
Accesibilidad (WCAG 2.1)
Implementado:

Todos los componentes shadcn/ui son accesibles por defecto (Radix UI)
Atributos ARIA en componentes interactivos
Navegación por teclado en todos los elementos
Focus visible en todos los controles
Contraste de colores adecuado (AA)
Alt text en todas las imágenes
Labels asociados a inputs
Mensajes de error descriptivos
Skip links para navegación rápida

🔍 SEO y Analytics
Configuración SEO
Metadatos Configurables (desde /admin/configuracion):

siteName - Nombre del sitio (usado en title tags)
siteDescription - Descripción para meta description
metaKeywords - Keywords para SEO (separadas por comas)
siteUrl - URL pública del sitio (para Open Graph)
Open Graph tags - Generados automáticamente en cada página
Canonical URLs - Configurados en layout principal
Optimizaciones SEO Implementadas:

Títulos descriptivos en todas las páginas
Meta descriptions únicas por página
URLs amigables (slugs) para noticias
Imágenes con alt text
Estructura semántica HTML5
Sitemap.xml (recomendado agregar)
robots.txt configurado en /public/robots.txt
Google Analytics
Configuración: Variable googleAnalytics en PlatformConfig (campo en DB)

Componentes:

google-analytics.tsx - Script de Google Tag Manager
analytics-loader.tsx - Carga condicional de analytics
Implementación:

Script de Google Tag Manager (gtag.js)
Tracking automático de pageviews
Eventos personalizados (configurables)
Solo se carga si hay ID configurado
Compatible con modo oscuro/claro
Configuración en Admin:

Ir a /admin/configuracion
Agregar Google Analytics ID (formato: G-XXXXXXXXXX)
Guardar configuración
El script se carga automáticamente en todas las páginas públicas
📧 Sistema de Emails
Resend Integration
Uso Actual:

Recuperación de contraseña
Notificaciones de mensajes de contacto (opcional)
Configuración:

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL,
  to: email,
  subject: 'Recuperación de contraseña',
  html: emailTemplate
})
Límites:

Plan gratuito: 100 emails/día
Plan Pro: 50,000 emails/mes

📊 Rendimiento y Optimización
Optimizaciones Implementadas
Next.js 16:

Output standalone (bundle optimizado, ~50% más pequeño)
Optimización automática de imágenes con Sharp
Code splitting automático por ruta
Server Components por defecto (menos JavaScript al cliente)
Streaming SSR para carga progresiva
Prefetching automático de links visibles
Cloudinary:

Transformación y optimización automática de imágenes
Formatos modernos (WebP, AVIF) con fallback
CDN global con 200+ puntos de presencia
Lazy loading de imágenes
Responsive images con srcset
Compresión inteligente (quality: auto)
Turso Database:

Base de datos distribuida con baja latencia
Réplicas edge en múltiples regiones
Conexiones desde el edge más cercano
Queries optimizadas con Prisma
Connection pooling automático
Prisma ORM:

Queries optimizadas y compiladas
Connection pooling eficiente
Cliente generado optimizado
Lazy loading de relaciones
Batch queries cuando es posible
Caché del Cliente:

TanStack React Query para data fetching
Caché automático de requests
Revalidación en background
Optimistic updates
Deduplicación de requests
Bundle Optimization:

Tree shaking automático
Minificación de JavaScript y CSS
Compresión gzip/brotli
Lazy loading de componentes pesados
Dynamic imports para código no crítico
Métricas Esperadas (Core Web Vitals)
Objetivos:

Time to First Byte (TTFB): < 200ms (con Turso edge)
Largest Contentful Paint (LCP): < 2.5s (bueno)
First Input Delay (FID): < 100ms (bueno)
Cumulative Layout Shift (CLS): < 0.1 (bueno)
First Contentful Paint (FCP): < 1.8s (bueno)
Factores que Afectan Performance:

Tamaño de imágenes del carrusel (optimizar a < 500KB)
Número de slides activos en carrusel (recomendado: 3-5)
Cantidad de servicios destacados en home (recomendado: 3-6)
Uso de Editor.js (carga diferida en admin)
Conexión a Turso (latencia depende de región)
Recomendaciones de Optimización
Imágenes:

Usar formato WebP/AVIF cuando sea posible
Comprimir imágenes antes de subir (< 500KB)
Usar dimensiones apropiadas (no subir 4K para mostrar 800px)
Habilitar blur placeholder en Next.js Image
Contenido:

Limitar número de noticias destacadas en home (3-4)
Paginar listados largos
Lazy load de componentes pesados (Editor.js, mapas)
Caché:

Implementar fix de caché (prioridad alta)
Configurar revalidación apropiada por ruta
Usar ISR (Incremental Static Regeneration) cuando sea posible
Monitoreo:

Configurar Vercel Analytics o similar
Monitorear Core Web Vitals
Identificar páginas lentas
Optimizar queries de base de datos lentasndimiento
Optimizaciones Implementadas
Next.js:

Output standalone (bundle optimizado)
Caché agresivo de páginas (⚠️ requiere invalidación manual)
Optimización automática de imágenes
Code splitting automático
Server Components por defecto
Cloudinary:

Transformación y optimización automática de imágenes
Formatos modernos (WebP, AVIF)
CDN global
Lazy loading
Turso:

Base de datos distribuida con baja latencia
Réplicas globales
Conexiones edge
Prisma:

Queries optimizadas
Connection pooling
Cliente generado optimizado
Métricas Esperadas
Time to First Byte (TTFB): < 200ms (con Turso edge)
Largest Contentful Paint (LCP): < 2.5s
First Input Delay (FID): < 100ms
Cumulative Layout Shift (CLS): < 0.1

🎨 Personalización y Branding
Sistema de Temas (Modo Oscuro/Claro)
Tecnología: next-themes v0.4.6

Componentes:

theme-provider.tsx - Provider de next-themes que envuelve la aplicación
theme-toggle.tsx - Botón para cambiar entre modos (sol/luna)
Características:

Persistencia automática en localStorage
Sin flash de contenido incorrecto (FOUC)
Transiciones suaves entre temas
Detección automática de preferencia del sistema
Tres opciones: light, dark, system
Implementación:

// Uso en componentes
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
setTheme('dark') // 'light', 'dark', 'system'
Variables CSS (definidas en src/app/globals.css):

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
Configuración Visual
Colores:

Color primario: #6BBE45 (verde corporativo de Green Axis)
Configurable desde panel admin (campo primaryColor en PlatformConfig)
Sistema de colores semánticos (primary, secondary, accent, destructive, muted)
Adaptación automática a modo oscuro
Tipografía:

Sistema de fuentes de Tailwind (sans-serif stack)
Escalas responsive (text-sm → text-5xl)
Line heights optimizados para legibilidad
Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
Espaciado:

Sistema de spacing de Tailwind (0.25rem increments)
Container con max-width responsive
Padding y margin consistentes
Gap en grids y flexbox
Animaciones:

Framer Motion para animaciones complejas (carrusel, modales)
Tailwind Animate para transiciones simples
Animaciones de entrada/salida suaves
Respeta preferencia de usuario (prefers-reduced-motion)
Elementos Configurables
Desde Panel Admin (/admin/configuracion):

Logo y favicon
Nombre del sitio, slogan y descripción
Colores del tema (color primario)
Textos del footer y redes sociales
Links de redes sociales (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube)
Número de WhatsApp y mensaje predeterminado
Email de notificaciones (para recibir mensajes de contacto)
Datos de contacto (dirección, teléfono, email)
Google Analytics ID
Google Maps embed code
Configuración de sección "About" del home
Mostrar/ocultar sección de mapa
Desde Otras Secciones Admin:

Contenido de todas las páginas (servicios, noticias, about, legales)
Imágenes del sitio por categorías
Carrusel principal (slides con gradientes y animaciones)
Orden de servicios y slides (drag & drop)