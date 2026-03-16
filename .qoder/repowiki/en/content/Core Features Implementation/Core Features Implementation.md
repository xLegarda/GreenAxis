# Core Features Implementation

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [src/app/layout.tsx](file://src/app/layout.tsx)
- [src/components/public-layout.tsx](file://src/components/public-layout.tsx)
- [src/components/admin-layout.tsx](file://src/components/admin-layout.tsx)
- [src/middleware.ts](file://src/middleware.ts)
- [src/components/hero-carousel.tsx](file://src/components/hero-carousel.tsx)
- [src/components/services-section.tsx](file://src/components/services-section.tsx)
- [src/components/news-section.tsx](file://src/components/news-section.tsx)
- [src/components/contact-page-content.tsx](file://src/components/contact-page-content.tsx)
- [src/components/about-page-content.tsx](file://src/components/about-page-content.tsx)
- [src/components/editor-js.tsx](file://src/components/editor-js.tsx)
- [src/components/media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [src/components/media-picker.tsx](file://src/components/media-picker.tsx)
- [src/lib/cloudinary.ts](file://src/lib/cloudinary.ts)
- [src/lib/media-references.ts](file://src/lib/media-references.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document explains the core features implementation of GreenAxis, covering both the public website and administrative CMS. It details the landing page hero carousel, services catalog with detailed pages, news/blog system with pagination, about us page content management, contact form functionality, and legal pages management. Administrative features include dashboard design, content management system, media library implementation, user management and permissions, and configuration settings. Rich text editing is powered by Editor.js with custom tools, media management integrates with Cloudinary, and drag-and-drop enables content reordering. The document outlines implementation patterns, component relationships, and user workflow optimization.

## Project Structure
GreenAxis follows a Next.js App Router architecture with a clear separation between public-facing pages and admin routes. The public site uses dynamic metadata generation and a shared public layout. The admin area is protected and provides centralized content management with a sidebar navigation and theme toggler.

```mermaid
graph TB
subgraph "Public Website"
LAYOUT["src/app/layout.tsx<br/>Root layout with metadata"]
PUBLIC_LAYOUT["src/components/public-layout.tsx<br/>Header/Footer wrapper"]
HOME["src/app/page.tsx<br/>Home page"]
SERVICES["src/app/servicios/page.tsx<br/>Services catalog"]
NEWS["src/app/noticias/page.tsx<br/>News/blog listing"]
NEWS_DETAIL["src/app/noticias/[slug]/page.tsx<br/>News detail"]
ABOUT["src/app/quienes-somos/page.tsx<br/>About page"]
CONTACT["src/app/contacto/page.tsx<br/>Contact form"]
LEGAL["src/app/terminos/page.tsx<br/>Terms"]
PRIVACY["src/app/privacidad/page.tsx<br/>Privacy"]
end
subgraph "Admin CMS"
ADMIN_LAYOUT["src/components/admin-layout.tsx<br/>Admin sidebar + theme"]
ADMIN_HOME["src/app/admin/page.tsx<br/>Admin dashboard"]
CONFIG["src/app/admin/configuracion/page.tsx<br/>Global config"]
SERVICES_ADMIN["src/app/admin/servicios/page.tsx<br/>Services management"]
NEWS_ADMIN["src/app/admin/noticias/page.tsx<br/>News management"]
CAROUSEL_ADMIN["src/app/admin/carrusel/page.tsx<br/>Hero carousel"]
MEDIA_ADMIN["src/app/admin/imagenes/page.tsx<br/>Media library"]
LEGAL_ADMIN["src/app/admin/legal/page.tsx<br/>Legal pages"]
ABOUT_ADMIN["src/app/admin/quienes-somos/page.tsx<br/>Full About page"]
ABOUT_SECTION_ADMIN["src/app/admin/seccion-about/page.tsx<br/>Home About section"]
MESSAGES_ADMIN["src/app/admin/mensajes/page.tsx<br/>Contact messages"]
end
LAYOUT --> PUBLIC_LAYOUT
PUBLIC_LAYOUT --> HOME
PUBLIC_LAYOUT --> SERVICES
PUBLIC_LAYOUT --> NEWS
PUBLIC_LAYOUT --> NEWS_DETAIL
PUBLIC_LAYOUT --> ABOUT
PUBLIC_LAYOUT --> CONTACT
PUBLIC_LAYOUT --> LEGAL
PUBLIC_LAYOUT --> PRIVACY
ADMIN_LAYOUT --> ADMIN_HOME
ADMIN_LAYOUT --> CONFIG
ADMIN_LAYOUT --> SERVICES_ADMIN
ADMIN_LAYOUT --> NEWS_ADMIN
ADMIN_LAYOUT --> CAROUSEL_ADMIN
ADMIN_LAYOUT --> MEDIA_ADMIN
ADMIN_LAYOUT --> LEGAL_ADMIN
ADMIN_LAYOUT --> ABOUT_ADMIN
ADMIN_LAYOUT --> ABOUT_SECTION_ADMIN
ADMIN_LAYOUT --> MESSAGES_ADMIN
```

**Diagram sources**
- [src/app/layout.tsx:1-80](file://src/app/layout.tsx#L1-L80)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/components/admin-layout.tsx:1-384](file://src/components/admin-layout.tsx#L1-L384)

**Section sources**
- [README.md:152-216](file://README.md#L152-L216)
- [src/app/layout.tsx:1-80](file://src/app/layout.tsx#L1-L80)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/components/admin-layout.tsx:1-384](file://src/components/admin-layout.tsx#L1-L384)

## Core Components
This section highlights the primary building blocks powering GreenAxis:

- Hero Carousel: Full-width animated hero with gradient overlays, CTA buttons, and optional whole-slide links.
- Services Section: Grid of service cards with icons, images, and featured badges.
- News Section: Card-based listing with thumbnails, dates, and author metadata.
- Contact Page Content: Form with validation, rate limiting, and Google Maps integration.
- About Page Content: Comprehensive page with history, mission, vision, values, stats, team, certifications, location, and CTA.
- Editor.js Rich Text: Custom tools for images, videos, audio, links, colors, markers, and headings.
- Media Library Browser: Paginated, searchable, filterable media grid with preview and external media support.
- Media Picker: Unified component for library browsing and file upload with drag-and-drop and duplicate detection.
- Cloudinary Utilities: URL transformation helpers for responsive and optimized assets.
- Media References: Cross-table scanning and reference updates for safe media deletion.

**Section sources**
- [src/components/hero-carousel.tsx:1-305](file://src/components/hero-carousel.tsx#L1-L305)
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)
- [src/components/news-section.tsx:1-138](file://src/components/news-section.tsx#L1-L138)
- [src/components/contact-page-content.tsx:1-414](file://src/components/contact-page-content.tsx#L1-L414)
- [src/components/about-page-content.tsx:1-385](file://src/components/about-page-content.tsx#L1-L385)
- [src/components/editor-js.tsx:1-850](file://src/components/editor-js.tsx#L1-L850)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/lib/media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

## Architecture Overview
GreenAxis uses Next.js App Router with a hybrid public/admin architecture. The public site generates metadata dynamically from the database and renders reusable components for layout and sections. The admin area is protected by middleware and provides CRUD interfaces for content, media, and configuration. Cloudinary handles media optimization and delivery, while Prisma manages data persistence.

```mermaid
graph TB
CLIENT["Browser"]
NEXT["Next.js App Router"]
LAYOUT["Root Layout + Public Layout"]
COMPONENTS["Reusable Components<br/>Hero, Services, News, Contact, About"]
EDITOR["Editor.js + Custom Tools"]
MEDIA_PICKER["Media Picker + Library Browser"]
CLOUDINARY["Cloudinary CDN"]
PRISMA["Prisma ORM + Turso Database"]
CLIENT --> NEXT
NEXT --> LAYOUT
LAYOUT --> COMPONENTS
COMPONENTS --> PRISMA
COMPONENTS --> CLOUDINARY
EDITOR --> MEDIA_PICKER
MEDIA_PICKER --> PRISMA
MEDIA_PICKER --> CLOUDINARY
PRISMA --> CLOUDINARY
```

**Diagram sources**
- [src/app/layout.tsx:1-80](file://src/app/layout.tsx#L1-L80)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/components/editor-js.tsx:1-850](file://src/components/editor-js.tsx#L1-L850)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [README.md:67-108](file://README.md#L67-L108)

**Section sources**
- [README.md:67-108](file://README.md#L67-L108)
- [src/app/layout.tsx:1-80](file://src/app/layout.tsx#L1-L80)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)

## Detailed Component Analysis

### Public Website Features

#### Hero Carousel
The hero carousel renders multiple slides with optional gradient overlays, animated zoom transitions, and navigation controls. It supports whole-slide links and integrates Cloudinary for responsive image optimization.

```mermaid
sequenceDiagram
participant User as "Visitor"
participant Hero as "HeroCarousel"
participant Cloud as "Cloudinary Utils"
User->>Hero : Load homepage
Hero->>Hero : Initialize slides
Hero->>Cloud : getHeroResponsiveUrl(imageUrl)
Cloud-->>Hero : Optimized URL
Hero->>Hero : Animate zoom + auto-advance
User->>Hero : Click arrow or dot
Hero->>Hero : Update current slide
```

**Diagram sources**
- [src/components/hero-carousel.tsx:1-305](file://src/components/hero-carousel.tsx#L1-L305)
- [src/lib/cloudinary.ts:92-98](file://src/lib/cloudinary.ts#L92-L98)

**Section sources**
- [src/components/hero-carousel.tsx:1-305](file://src/components/hero-carousel.tsx#L1-L305)
- [src/lib/cloudinary.ts:92-98](file://src/lib/cloudinary.ts#L92-L98)

#### Services Catalog
The services section displays a grid of service cards, prioritizing featured services and linking to either slug-based or anchor-based detail pages.

```mermaid
flowchart TD
Start(["Render Services"]) --> Fetch["Fetch services from DB"]
Fetch --> Sort["Sort: featured first"]
Sort --> Slice["Slice to top 6"]
Slice --> Cards["Render cards with image/icon + title + excerpt"]
Cards --> Link["Link to detail page"]
Link --> End(["Done"])
```

**Diagram sources**
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)

**Section sources**
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)

#### News/Blog System
The news section presents a responsive grid of articles with thumbnails, publication dates, and excerpts. Pagination is handled via infinite scroll with a 50-item page size.

```mermaid
sequenceDiagram
participant User as "Visitor"
participant News as "NewsSection"
participant API as "MediaLibraryBrowser"
participant DB as "Prisma/Turso"
User->>News : Visit /noticias
News->>API : Fetch media items (page=1, limit=50)
API->>DB : Query media with filters
DB-->>API : Items + pagination
API-->>News : Render grid
User->>News : Scroll to bottom
News->>API : Fetch next page
API->>DB : Query next page
DB-->>API : Items
API-->>News : Append items
```

**Diagram sources**
- [src/components/news-section.tsx:1-138](file://src/components/news-section.tsx#L1-L138)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)

**Section sources**
- [src/components/news-section.tsx:1-138](file://src/components/news-section.tsx#L1-L138)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)

#### About Us Page
The about page content is highly structured with sections for history, mission, vision, values, statistics, team, certifications, location, and a final CTA. It parses JSON content fields and renders icons and images.

```mermaid
classDiagram
class AboutPageContent {
+config PlatformConfig
+aboutPage AboutPage
+render() ReactNode
}
class PlatformConfig {
+siteName string
+companyAddress string
+companyPhone string
+companyEmail string
+googleMapsEmbed string
}
AboutPageContent --> PlatformConfig : "uses"
```

**Diagram sources**
- [src/components/about-page-content.tsx:1-385](file://src/components/about-page-content.tsx#L1-L385)

**Section sources**
- [src/components/about-page-content.tsx:1-385](file://src/components/about-page-content.tsx#L1-L385)

#### Contact Form
The contact form validates inputs, enforces privacy consent, and submits to a rate-limited endpoint. It integrates with Google Maps embed or external links.

```mermaid
sequenceDiagram
participant Visitor as "Visitor"
participant Form as "ContactPageContent"
participant API as "/api/contacto"
participant Toast as "Toast Notifications"
Visitor->>Form : Fill form + consent
Form->>Form : Validate phone (if present)
Form->>API : POST contact data
API-->>Form : Success or error
Form->>Toast : Show success/error
Form-->>Visitor : Clear form or keep errors
```

**Diagram sources**
- [src/components/contact-page-content.tsx:1-414](file://src/components/contact-page-content.tsx#L1-L414)
- [src/middleware.ts:1-58](file://src/middleware.ts#L1-L58)

**Section sources**
- [src/components/contact-page-content.tsx:1-414](file://src/components/contact-page-content.tsx#L1-L414)
- [src/middleware.ts:1-58](file://src/middleware.ts#L1-L58)

### Administrative Features

#### Dashboard and Layout
The admin layout provides a responsive sidebar, theme toggle, logout, and account deletion flow. It fetches platform configuration for branding and admin counts for permission checks.

```mermaid
flowchart TD
Admin["Admin User"] --> Layout["AdminLayout"]
Layout --> Sidebar["Navigation items"]
Layout --> Theme["Theme Toggle"]
Layout --> Logout["Logout flow"]
Layout --> Delete["Delete account dialog"]
Layout --> Content["Admin Pages"]
```

**Diagram sources**
- [src/components/admin-layout.tsx:1-384](file://src/components/admin-layout.tsx#L1-L384)

**Section sources**
- [src/components/admin-layout.tsx:1-384](file://src/components/admin-layout.tsx#L1-L384)

#### Rich Text Editing with Editor.js
Editor.js is configured with custom tools for headings, lists, quotes, links, colors, markers, and media. It integrates with the media picker and Cloudinary upload pipeline.

```mermaid
sequenceDiagram
participant Admin as "Admin Editor"
participant Editor as "EditorJSComponent"
participant MediaPicker as "MediaPicker"
participant Cloud as "Cloudinary"
participant DB as "Prisma"
Admin->>Editor : Edit content
Editor->>Editor : Save blocks to onChange
Admin->>Editor : Insert Image/Video/Audio
Editor->>MediaPicker : Open media picker
MediaPicker->>Cloud : Upload or select
Cloud-->>MediaPicker : URL
MediaPicker-->>Editor : Insert block with URL
Editor->>DB : Persist blocks JSON
```

**Diagram sources**
- [src/components/editor-js.tsx:1-850](file://src/components/editor-js.tsx#L1-L850)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

**Section sources**
- [src/components/editor-js.tsx:1-850](file://src/components/editor-js.tsx#L1-L850)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

#### Media Library and Management
The media library supports infinite scroll pagination, search, category filtering, and preview modals. It integrates with Cloudinary and tracks media references across content tables.

```mermaid
flowchart TD
Browse["MediaLibraryBrowser"] --> Search["Search + Debounce"]
Browse --> Filter["Category filter"]
Browse --> Load["Fetch items (50/page)"]
Load --> Grid["Render MediaCards"]
Grid --> Preview["Preview modal"]
Preview --> Update["Update metadata"]
Preview --> Delete["Delete with reference check"]
Delete --> Clean["Update references across tables"]
```

**Diagram sources**
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [src/lib/media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

**Section sources**
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [src/lib/media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

#### Drag-and-Drop Reordering
Drag-and-drop is used in admin areas to reorder carousel slides and services. The implementation leverages floss-based drag-and-drop libraries and persists order updates to the database.

```mermaid
sequenceDiagram
participant Admin as "Admin"
participant DnD as "Drag-and-Drop UI"
participant API as "Admin API"
participant DB as "Prisma/Turso"
Admin->>DnD : Drag item to new position
DnD->>API : PUT reorder request
API->>DB : Update order fields
DB-->>API : Confirm update
API-->>DnD : Success
DnD-->>Admin : Reordered list
```

**Diagram sources**
- [README.md:37-37](file://README.md#L37-L37)

**Section sources**
- [README.md:37-37](file://README.md#L37-L37)

## Dependency Analysis
The system exhibits strong cohesion within feature groups and low coupling between public and admin concerns. Key dependencies include:

- Cloudinary utilities for URL transformation and responsive optimization.
- Media references module for cross-table scanning and safe deletion.
- Middleware for security headers and rate limiting.
- Prisma for database operations and Turso for distributed storage.

```mermaid
graph LR
PublicLayout["public-layout.tsx"] --> Hero["hero-carousel.tsx"]
PublicLayout --> Services["services-section.tsx"]
PublicLayout --> News["news-section.tsx"]
PublicLayout --> Contact["contact-page-content.tsx"]
PublicLayout --> About["about-page-content.tsx"]
Editor["editor-js.tsx"] --> MediaPicker["media-picker.tsx"]
MediaPicker --> Cloudinary["cloudinary.ts"]
MediaPicker --> MediaRefs["media-references.ts"]
AdminLayout["admin-layout.tsx"] --> Editor
AdminLayout --> MediaPicker
AdminLayout --> MediaRefs
```

**Diagram sources**
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/components/hero-carousel.tsx:1-305](file://src/components/hero-carousel.tsx#L1-L305)
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)
- [src/components/news-section.tsx:1-138](file://src/components/news-section.tsx#L1-L138)
- [src/components/contact-page-content.tsx:1-414](file://src/components/contact-page-content.tsx#L1-L414)
- [src/components/about-page-content.tsx:1-385](file://src/components/about-page-content.tsx#L1-L385)
- [src/components/editor-js.tsx:1-850](file://src/components/editor-js.tsx#L1-L850)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/lib/media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)
- [src/components/admin-layout.tsx:1-384](file://src/components/admin-layout.tsx#L1-L384)

**Section sources**
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/components/admin-layout.tsx:1-384](file://src/components/admin-layout.tsx#L1-L384)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/lib/media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

## Performance Considerations
- Cloudinary optimization: Automatic format and quality adjustments reduce payload sizes and improve load times globally.
- Responsive images: Next.js Image with Cloudinary loader ensures appropriate sizing and srcset generation.
- Lazy loading: Images and iframes are lazy-loaded to minimize initial bundle weight.
- Infinite scroll: Efficient pagination reduces memory usage and improves perceived performance.
- CDN distribution: Cloudinary’s edge network accelerates asset delivery across regions.
- Bundle optimization: Next.js output standalone and tree shaking reduce client-side JavaScript.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:

- Media upload failures:
  - Symptom: Upload errors or 413 responses.
  - Cause: File exceeds size limits.
  - Resolution: Use Cloudinary Console for large files or compress locally.
  - Related code: [src/components/media-picker.tsx:200-316](file://src/components/media-picker.tsx#L200-L316)

- Duplicate media warnings:
  - Symptom: Warning dialog suggesting existing similar files.
  - Action: Choose “Use existing” or “Upload anyway.”
  - Related code: [src/components/media-picker.tsx:388-409](file://src/components/media-picker.tsx#L388-L409)

- Safe media deletion:
  - Symptom: Attempting to delete media used elsewhere.
  - Action: Use reference checker to locate usages; update references or remove media from content.
  - Related code: [src/lib/media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

- Contact form rate limiting:
  - Symptom: Error “Too many requests.”
  - Cause: Rate limit exceeded for IP.
  - Resolution: Wait for reset window or reduce submission frequency.
  - Related code: [src/middleware.ts:586-592](file://src/middleware.ts#L586-L592)

**Section sources**
- [src/components/media-picker.tsx:200-316](file://src/components/media-picker.tsx#L200-L316)
- [src/components/media-picker.tsx:388-409](file://src/components/media-picker.tsx#L388-L409)
- [src/lib/media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [src/middleware.ts:586-592](file://src/middleware.ts#L586-L592)

## Conclusion
GreenAxis delivers a robust, secure, and user-friendly web solution combining a performant public website with a powerful admin CMS. The implementation emphasizes responsive design, rich content authoring with Editor.js, professional media management via Cloudinary, and safe content operations through reference tracking. The architecture supports scalability and maintainability while ensuring optimal user experiences across devices and regions.