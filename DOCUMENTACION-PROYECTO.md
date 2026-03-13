# 📘 Documentación Técnica - Green Axis S.A.S.

**Versión**: 0.2.0  
**Fecha**: Marzo 12, 2026  
**Framework**: Next.js 16.1.1 (App Router)  
**Base de Datos**: Turso (LibSQL) con Prisma ORM  
**Lenguaje**: TypeScript 5  

---

## 🎯 Resumen Ejecutivo

Green Axis S.A.S. es una plataforma web corporativa para una empresa de servicios ambientales en Colombia. La aplicación incluye un sitio público con información de servicios, noticias, contacto y un panel de administración completo para gestionar todo el contenido del sitio.

**Características Principales**:
- Sitio público responsive con información corporativa
- Panel de administración con autenticación segura
- Sistema de gestión de contenido (CMS) integrado
- Editor de texto enriquecido (Editor.js)
- Gestión de imágenes con Cloudinary
- Base de datos distribuida con Turso
- Sistema de contacto con rate limiting
- Carrusel de imágenes configurable
- Páginas legales editables

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Frontend**:
- Next.js 16.1.1 (App Router)
- React 19.0.0
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (componentes)
- Framer Motion (animaciones)

**Backend**:
- Next.js API Routes
- Prisma ORM 6.19.2
- Turso Database (LibSQL)
- bcryptjs (autenticación)
- Server Actions

**Servicios Externos**:
- Turso: Base de datos SQLite distribuida
- Cloudinary: Gestión y optimización de imágenes
- Resend: Envío de emails transaccionales

**Herramientas de Desarrollo**:
- ESLint 9
- Bun (runtime alternativo)
- Prisma CLI

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
- `/admin/quienes-somos` - Contenido "About"
- `/admin/mensajes` - Mensajes de contacto

**Autenticación**:
- `/portal-interno` - Login de administradores
- `/portal-interno/recuperar-clave` - Recuperación de contraseña
- `/portal-interno/restablecer` - Restablecer contraseña

---

## 🗄️ Modelo de Datos

### Entidades Principales

