# Services Catalog System

<cite>
**Referenced Files in This Document**
- [src/app/servicios/page.tsx](file://src/app/servicios/page.tsx)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx)
- [src/components/services-page-content.tsx](file://src/components/services-page-content.tsx)
- [src/components/service-detail-content.tsx](file://src/components/service-detail-content.tsx)
- [src/components/services-section.tsx](file://src/components/services-section.tsx)
- [src/lib/cloudinary.ts](file://src/lib/cloudinary.ts)
- [src/lib/actions.ts](file://src/lib/actions.ts)
- [src/app/api/servicios/route.ts](file://src/app/api/servicios/route.ts)
- [prisma/schema.prisma](file://prisma/schema.prisma)
- [src/components/editor-js.tsx](file://src/components/editor-js.tsx)
- [src/app/admin/servicios/page.tsx](file://src/app/admin/servicios/page.tsx)
- [src/components/media-picker.tsx](file://src/components/media-picker.tsx)
- [src/components/media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [src/app/layout.tsx](file://src/app/layout.tsx)
- [src/components/public-layout.tsx](file://src/components/public-layout.tsx)
- [scripts/seed-services.ts](file://scripts/seed-services.ts)
</cite>

## Update Summary
**Changes Made**
- Enhanced ServicesPageContent component with new summary section displaying prominent short description content
- Improved service detail page layout with sticky sidebar for better user experience
- Enhanced services listing with short description previews in both card and detail views
- Added new shortBlocks field to Service model for separate short description content
- Updated admin interface to support dual content editing (shortBlocks for previews + full blocks for detail pages)

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
This document describes the Services Catalog System, a comprehensive solution for displaying, managing, and optimizing service offerings on the Green Axis website. It covers the services listing page, individual service detail pages with slug-based routing, data models, content management integration, component architecture, dynamic content rendering, SEO optimization, categorization and filtering, image handling via Cloudinary, responsive design patterns, API endpoints, content editing workflows, and performance considerations.

**Updated** Enhanced with new summary section functionality, improved layout patterns, and dual content management approach for better user experience and content organization.

## Project Structure
The services catalog spans frontend pages, backend APIs, shared components, and database models:

- Pages: Services listing and detail pages under `src/app/servicios/`
- Components: Shared UI components for service listings and detail views with enhanced summary sections
- Backend: API routes for CRUD operations on services with dual content support
- Data: Prisma schema defining the Service model with enhanced short description fields
- Utilities: Cloudinary helpers for image optimization and responsive URLs
- Admin: Full-service management interface with content editing and media handling

```mermaid
graph TB
subgraph "Frontend"
A["Services Listing Page<br/>src/app/servicios/page.tsx"]
B["Service Detail Page<br/>src/app/servicios/[slug]/page.tsx"]
C["Services Page Content<br/>src/components/services-page-content.tsx"]
D["Service Detail Content<br/>src/components/service-detail-content.tsx"]
E["Services Section<br/>src/components/services-section.tsx"]
F["Public Layout<br/>src/components/public-layout.tsx"]
end
subgraph "Backend"
G["API Services Route<br/>src/app/api/servicios/route.ts"]
H["Actions Layer<br/>src/lib/actions.ts"]
end
subgraph "Data & Assets"
I["Prisma Schema<br/>prisma/schema.prisma"]
J["Cloudinary Utils<br/>src/lib/cloudinary.ts"]
K["EditorJS Renderer<br/>src/components/editor-js.tsx"]
L["Media Picker<br/>src/components/media-picker.tsx"]
M["Media Library Browser<br/>src/components/media-library-browser.tsx"]
end
subgraph "Admin"
N["Admin Services Page<br/>src/app/admin/servicios/page.tsx"]
end
A --> C
B --> D
C --> F
D --> F
E --> F
A --> H
B --> H
H --> I
C --> J
D --> J
N --> G
N --> K
N --> L
N --> M
G --> I
```

**Diagram sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L1-L82)
- [src/components/services-page-content.tsx:1-381](file://src/components/services-page-content.tsx#L1-L381)
- [src/components/service-detail-content.tsx:1-242](file://src/components/service-detail-content.tsx#L1-L242)
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/app/api/servicios/route.ts:1-163](file://src/app/api/servicios/route.ts#L1-L163)
- [src/lib/actions.ts:1-136](file://src/lib/actions.ts#L1-L136)
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/components/editor-js.tsx:610-800](file://src/components/editor-js.tsx#L610-L800)
- [src/app/admin/servicios/page.tsx:1-729](file://src/app/admin/servicios/page.tsx#L1-L729)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)

**Section sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L1-L82)
- [src/components/services-page-content.tsx:1-381](file://src/components/services-page-content.tsx#L1-L381)
- [src/components/service-detail-content.tsx:1-242](file://src/components/service-detail-content.tsx#L1-L242)
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)
- [src/app/api/servicios/route.ts:1-163](file://src/app/api/servicios/route.ts#L1-L163)
- [src/lib/actions.ts:1-136](file://src/lib/actions.ts#L1-L136)
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/components/editor-js.tsx:610-800](file://src/components/editor-js.tsx#L610-L800)
- [src/app/admin/servicios/page.tsx:1-729](file://src/app/admin/servicios/page.tsx#L1-L729)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)

## Core Components
This section outlines the primary building blocks of the services catalog with enhanced functionality:

- Services Listing Page (`src/app/servicios/page.tsx`): Orchestrates fetching services and platform configuration, then renders the ServicesPageContent component within PublicLayout with enhanced summary sections.
- Services Detail Page (`src/app/servicios/[slug]/page.tsx`): Implements slug-based routing, generates SEO metadata dynamically, validates service existence, and renders ServiceDetailContent with improved layout and sticky sidebar.
- Services Page Content (`src/components/services-page-content.tsx`): Renders a hero section, featured services, and a complete service grid with responsive image handling, enhanced content formatting, and prominent summary sections.
- Service Detail Content (`src/components/service-detail-content.tsx`): Displays a hero image or icon, service title/description, and either EditorJS blocks or markdown content with a call-to-action, featuring a new summary section and sticky sidebar layout.
- Services Section (`src/components/services-section.tsx`): A reusable component for embedding a subset of services in other contexts, with sorting and responsive layouts.
- Cloudinary Utilities (`src/lib/cloudinary.ts`): Provides helpers to optimize and generate responsive Cloudinary URLs for different use cases.
- Actions Layer (`src/lib/actions.ts`): Encapsulates database queries for services and platform configuration.
- API Services Route (`src/app/api/servicios/route.ts`): Exposes REST endpoints for listing, creating, updating, and deleting services with authentication checks and cache revalidation, supporting the new shortBlocks field.
- Prisma Schema (`prisma/schema.prisma`): Defines the Service model with enhanced fields for title, slug, description, shortBlocks (new), content, blocks, icon, image URL, ordering, activation, and feature flag.
- EditorJS Integration (`src/components/editor-js.tsx`): Provides a renderer for EditorJS blocks and a client-side editor component used in admin workflows.
- Admin Services Page (`src/app/admin/servicios/page.tsx`): Full CRUD interface for services with content editing, icon selection, media picker integration, real-time cache invalidation, and dual content management (shortBlocks + full blocks).
- Media Components (`src/components/media-picker.tsx`, `src/components/media-library-browser.tsx`): Comprehensive media selection and upload utilities supporting images, videos, and audio with duplicate detection and library browsing.

**Updated** Enhanced with new shortBlocks field support, improved content rendering, and dual content management capabilities.

**Section sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L1-L82)
- [src/components/services-page-content.tsx:1-381](file://src/components/services-page-content.tsx#L1-L381)
- [src/components/service-detail-content.tsx:1-242](file://src/components/service-detail-content.tsx#L1-L242)
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/lib/actions.ts:1-136](file://src/lib/actions.ts#L1-L136)
- [src/app/api/servicios/route.ts:1-163](file://src/app/api/servicios/route.ts#L1-L163)
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)
- [src/components/editor-js.tsx:610-800](file://src/components/editor-js.tsx#L610-L800)
- [src/app/admin/servicios/page.tsx:1-729](file://src/app/admin/servicios/page.tsx#L1-L729)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [src/components/media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)

## Architecture Overview
The system follows a layered architecture with enhanced content management:
- Presentation Layer: Next.js app router pages and shared components with improved layout patterns
- Business Logic: Action functions encapsulate data access
- Persistence: Prisma ORM with SQLite, supporting dual content fields
- Asset Management: Cloudinary integration for optimized images
- Content Editing: EditorJS blocks with admin UI and media picker, supporting short description previews
- API Layer: REST endpoints with authentication and cache revalidation

```mermaid
sequenceDiagram
participant U as "User"
participant LP as "Listing Page<br/>page.tsx"
participant PC as "ServicesPageContent"
participant AC as "Actions<br/>actions.ts"
participant DB as "Prisma DB"
participant CL as "Cloudinary"
U->>LP : Navigate to /servicios
LP->>AC : getServices(), getPlatformConfig()
AC->>DB : Query services (active=true, order) with shortBlocks
DB-->>AC : Services[] with enhanced content
AC-->>LP : Services + Config
LP->>PC : Render with services and config
PC->>CL : Optimize image URLs (responsive)
PC-->>U : Rendered services grid with summary sections
```

**Diagram sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/components/services-page-content.tsx:1-381](file://src/components/services-page-content.tsx#L1-L381)
- [src/lib/actions.ts:24-30](file://src/lib/actions.ts#L24-L30)
- [src/lib/cloudinary.ts:92-114](file://src/lib/cloudinary.ts#L92-L114)
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)

**Section sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/components/services-page-content.tsx:1-381](file://src/components/services-page-content.tsx#L1-L381)
- [src/lib/actions.ts:24-30](file://src/lib/actions.ts#L24-L30)
- [src/lib/cloudinary.ts:92-114](file://src/lib/cloudinary.ts#L92-L114)
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)

## Detailed Component Analysis

### Services Listing Page Implementation
The listing page orchestrates data fetching and layout rendering with enhanced content presentation:
- Concurrently fetches services and platform configuration
- Passes data to ServicesPageContent for rendering with improved summary sections
- Uses PublicLayout for consistent header, footer, and WhatsApp integration

```mermaid
flowchart TD
Start(["Render Services Listing"]) --> Fetch["Fetch Services + Config<br/>with shortBlocks"]
Fetch --> Render["Render ServicesPageContent<br/>with Summary Sections"]
Render --> Layout["Wrap in PublicLayout"]
Layout --> End(["Page Ready"])
```

**Diagram sources**
- [src/app/servicios/page.tsx:5-16](file://src/app/servicios/page.tsx#L5-L16)
- [src/components/public-layout.tsx:10-54](file://src/components/public-layout.tsx#L10-L54)

**Section sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/components/public-layout.tsx:1-55](file://src/components/public-layout.tsx#L1-L55)

### Individual Service Detail Pages with Slug-Based Routing
Detail pages implement enhanced layout patterns:
- Dynamic route parameters for slug-based URLs
- Concurrent fetching of service and platform configuration
- SEO metadata generation with Open Graph and Twitter cards
- Canonical URL and fallback handling for inactive services
- Sticky sidebar layout for improved desktop experience

```mermaid
sequenceDiagram
participant U as "User"
participant DP as "Detail Page<br/>[slug]/page.tsx"
participant AC as "Actions"
participant DB as "Prisma DB"
participant SEO as "generateMetadata"
U->>DP : Request /servicios/ : slug
DP->>AC : getServiceBySlug(slug), getPlatformConfig()
AC->>DB : Find service by slug with shortBlocks
DB-->>AC : Service or null
AC-->>DP : Service + Config
DP->>SEO : Generate metadata (OG/Twitter/Canonical)
alt Service exists and active
DP-->>U : Render ServiceDetailContent with Sticky Sidebar
else Not found or inactive
DP-->>U : 404 Not Found
end
```

**Diagram sources**
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L53-L81)
- [src/lib/actions.ts:39-44](file://src/lib/actions.ts#L39-L44)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L7-L51)

**Section sources**
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L1-L82)
- [src/lib/actions.ts:39-44](file://src/lib/actions.ts#L39-L44)

### Service Data Models and Content Management Integration
The Service model defines the core data structure with enhanced content fields:
- Unique slug for SEO-friendly URLs
- Optional content in markdown or EditorJS blocks
- Short description content in shortBlocks field for preview purposes
- Icon and image URL fields
- Ordering, activation, and feature flags
- Automatic timestamps

```mermaid
erDiagram
SERVICE {
string id PK
string title
string slug UK
string description
string shortBlocks
string content
string blocks
string icon
string imageUrl
int order
boolean active
boolean featured
datetime createdAt
datetime updatedAt
}
```

**Diagram sources**
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)

**Section sources**
- [prisma/schema.prisma:80-97](file://prisma/schema.prisma#L80-L97)

### Services Section Component Architecture
The ServicesSection component maintains its core functionality:
- Sorts services to show featured items first
- Limits display to six services
- Renders cards with responsive images and icons
- Uses Cloudinary utilities for responsive image URLs

```mermaid
classDiagram
class ServicesSection {
+services : Service[]
+render() JSX.Element
-getIconComponent(iconName) React.ComponentType
-getServiceHref(service) string
}
class Service {
+id : string
+title : string
+slug : string
+description : string
+icon : string
+imageUrl : string
+featured : boolean
}
ServicesSection --> Service : "renders"
```

**Diagram sources**
- [src/components/services-section.tsx:43-181](file://src/components/services-section.tsx#L43-L181)
- [src/lib/cloudinary.ts:112-114](file://src/lib/cloudinary.ts#L112-L114)

**Section sources**
- [src/components/services-section.tsx:1-182](file://src/components/services-section.tsx#L1-L182)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

### Enhanced Dynamic Content Rendering and EditorJS Integration
Dynamic rendering now supports dual content formats with enhanced presentation:
- EditorJS blocks: Serialized JSON parsed and rendered with dedicated components
- Short description content: Separate shortBlocks field for preview purposes
- Markdown fallback: Line-by-line parsing with simple formatting rules
- Summary section: Prominent display of short description content

```mermaid
flowchart TD
Start(["Render Service Content"]) --> HasShortBlocks{"Has shortBlocks?"}
HasShortBlocks --> |Yes| ParseShort["Parse shortBlocks JSON"]
ParseShort --> ExtractShort["Extract short description text"]
ExtractShort --> RenderSummary["Render Summary Section"]
HasShortBlocks --> |No| HasBlocks{"Has EditorJS blocks?"}
HasBlocks --> |Yes| Parse["Parse JSON blocks"]
Parse --> RenderBlocks["renderEditorBlocks(blocks)"]
HasBlocks --> |No| HasMarkdown{"Has markdown content?"}
HasMarkdown --> |Yes| ParseMD["Split lines and format"]
HasMarkdown --> |No| Empty["No content to render"]
RenderSummary --> RenderBlocks
RenderSummary --> ParseMD
RenderBlocks --> End(["Content Ready"])
ParseMD --> End
Empty --> End
```

**Diagram sources**
- [src/components/service-detail-content.tsx:53-65](file://src/components/service-detail-content.tsx#L53-L65)
- [src/components/services-page-content.tsx:64-100](file://src/components/services-page-content.tsx#L64-L100)
- [src/components/editor-js.tsx:610-800](file://src/components/editor-js.tsx#L610-L800)

**Section sources**
- [src/components/service-detail-content.tsx:1-242](file://src/components/service-detail-content.tsx#L1-L242)
- [src/components/services-page-content.tsx:1-381](file://src/components/services-page-content.tsx#L1-L381)
- [src/components/editor-js.tsx:610-800](file://src/components/editor-js.tsx#L610-L800)

### SEO Optimization for Service Pages
SEO is handled at runtime with enhanced content presentation:
- Dynamic metadata generation using service title, description, and image
- Open Graph and Twitter card configuration
- Canonical URL construction
- Fallbacks for missing data using platform configuration
- Enhanced preview content through short description fields

```mermaid
sequenceDiagram
participant DP as "Detail Page"
participant AC as "Actions"
participant CFG as "Platform Config"
participant META as "Metadata"
DP->>AC : getServiceBySlug(slug)
AC-->>DP : Service with shortBlocks
DP->>AC : getPlatformConfig()
AC-->>DP : Config
DP->>META : Build title, description, OG, Twitter, canonical
META-->>DP : Metadata object with enhanced content
```

**Diagram sources**
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L7-L51)
- [src/lib/actions.ts:6-22](file://src/lib/actions.ts#L6-L22)

**Section sources**
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L7-L51)
- [src/lib/actions.ts:6-22](file://src/lib/actions.ts#L6-L22)

### Service Categorization, Filtering, and Ordering
Enhanced filtering capabilities with dual content support:
- Ordering: Services are ordered by the `order` field ascending
- Activation: Only active services are returned to clients
- Feature flagging: Distinct treatment for featured services
- Filtering: Admin interface allows toggling active and featured flags
- Content separation: Clear distinction between preview content (shortBlocks) and full content (blocks/content)

```mermaid
flowchart TD
Q["Query Services"] --> Active{"active = true"}
Active --> Order["ORDER BY order ASC"]
Order --> Result["Filtered + Ordered Services<br/>with shortBlocks for previews"]
```

**Diagram sources**
- [src/lib/actions.ts:24-30](file://src/lib/actions.ts#L24-L30)
- [prisma/schema.prisma:90-92](file://prisma/schema.prisma#L90-L92)

**Section sources**
- [src/lib/actions.ts:24-30](file://src/lib/actions.ts#L24-L30)
- [prisma/schema.prisma:90-92](file://prisma/schema.prisma#L90-L92)

### Image Handling Through Cloudinary
Cloudinary utilities provide:
- URL validation for Cloudinary-hosted assets
- Transformation injection for format, quality, and width
- Preset helpers for hero, thumbnail, service, and admin thumbnail sizes
- Responsive URL generation for Next.js Image component

```mermaid
flowchart TD
Input["Image URL"] --> Check{"isCloudinaryUrl?"}
Check --> |No| Return["Return original URL"]
Check --> |Yes| Transform["Inject transforms (f,q,w)"]
Transform --> Output["Optimized Cloudinary URL"]
```

**Diagram sources**
- [src/lib/cloudinary.ts:11-83](file://src/lib/cloudinary.ts#L11-L83)
- [src/lib/cloudinary.ts:92-114](file://src/lib/cloudinary.ts#L92-L114)

**Section sources**
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

### Enhanced Responsive Design Patterns
Responsive patterns implemented across components with improved layout:
- Next.js Image with appropriate sizes and responsive URLs
- Tailwind classes for grid layouts (1–3 columns on larger screens)
- Aspect ratios and overflow handling for cards and heroes
- Dark mode support via theme classes
- Sticky sidebar layout for desktop users
- Enhanced summary section styling for prominent content display

**Section sources**
- [src/components/services-page-content.tsx:142-148](file://src/components/services-page-content.tsx#L142-L148)
- [src/components/service-detail-content.tsx:58-66](file://src/components/service-detail-content.tsx#L58-L66)
- [src/components/services-section.tsx:109-115](file://src/components/services-section.tsx#L109-L115)

### API Endpoints for Services Data
REST endpoints expose CRUD operations with enhanced content support:
- GET `/api/servicios`: List all services ordered by `order`
- POST `/api/servicios`: Create a new service with slug generation, uniqueness handling, and shortBlocks support
- PUT `/api/servicios`: Update service with slug regeneration option, cache revalidation, and enhanced content fields
- DELETE `/api/servicios?id=...`: Delete service with cache revalidation

```mermaid
sequenceDiagram
participant Admin as "Admin UI"
participant API as "API Services Route"
participant DB as "Prisma DB"
participant Cache as "Next Cache"
Admin->>API : POST/PUT/DELETE with shortBlocks
API->>DB : Create/Update/Delete Service with enhanced fields
DB-->>API : Service record with shortBlocks
API->>Cache : revalidatePath('/servicios')
API-->>Admin : JSON response
```

**Diagram sources**
- [src/app/api/servicios/route.ts:16-27](file://src/app/api/servicios/route.ts#L16-L27)
- [src/app/api/servicios/route.ts:29-71](file://src/app/api/servicios/route.ts#L29-L71)
- [src/app/api/servicios/route.ts:73-130](file://src/app/api/servicios/route.ts#L73-L130)
- [src/app/api/servicios/route.ts:132-162](file://src/app/api/servicios/route.ts#L132-L162)

**Section sources**
- [src/app/api/servicios/route.ts:1-163](file://src/app/api/servicios/route.ts#L1-L163)

### Enhanced Content Editing Workflows
Admin workflow integrates dual content management:
- EditorJS component for rich content editing (full blocks)
- Separate EditorJS component for short description previews
- Media picker for selecting images from library or uploading new files
- Icon selector with categorized icons
- Real-time cache invalidation after edits
- Duplicate detection during uploads
- Dual content validation and preview capabilities

```mermaid
flowchart TD
Start(["Open Admin Services"]) --> Load["Load Services via /api/servicios<br/>with shortBlocks"]
Load --> Edit["Edit/Create Service<br/>with dual content fields"]
Edit --> ShortContent["Write Short Description (EditorJS)<br/>for previews"]
Edit --> FullContent["Write Full Content (EditorJS)<br/>for detail pages"]
Edit --> Media["Select/Upload Media"]
Edit --> Icons["Choose Icon"]
Edit --> Save["Save (POST/PUT)"]
Save --> Invalidate["revalidatePath('/servicios')"]
Invalidate --> Done(["Refresh UI with Enhanced Content"])
```

**Diagram sources**
- [src/app/admin/servicios/page.tsx:117-128](file://src/app/admin/servicios/page.tsx#L117-L128)
- [src/app/admin/servicios/page.tsx:134-176](file://src/app/admin/servicios/page.tsx#L134-L176)
- [src/components/media-picker.tsx:201-316](file://src/components/media-picker.tsx#L201-L316)

**Section sources**
- [src/app/admin/servicios/page.tsx:1-729](file://src/app/admin/servicios/page.tsx#L1-L729)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)

## Dependency Analysis
The system exhibits clear separation of concerns with enhanced content management:
- Pages depend on Actions for data access
- Components depend on utilities for image optimization
- Admin depends on API endpoints and EditorJS/media components
- API endpoints depend on Prisma for persistence
- Enhanced dependency on dual content fields for improved user experience

```mermaid
graph TB
P1["Services Listing Page"] --> A1["Actions"]
P2["Service Detail Page"] --> A1
A1 --> DB["Prisma DB<br/>with shortBlocks"]
C1["ServicesPageContent"] --> U1["Cloudinary Utils"]
C2["ServiceDetailContent"] --> U1
A2["Admin Services Page"] --> API["API Services Route<br/>with dual content"]
API --> DB
A2 --> EJ["EditorJS Component<br/>for shortBlocks + full content"]
A2 --> MP["Media Picker"]
```

**Diagram sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L1-L82)
- [src/lib/actions.ts:1-136](file://src/lib/actions.ts#L1-L136)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/app/admin/servicios/page.tsx:1-729](file://src/app/admin/servicios/page.tsx#L1-L729)
- [src/app/api/servicios/route.ts:1-163](file://src/app/api/servicios/route.ts#L1-L163)
- [src/components/editor-js.tsx:1-800](file://src/components/editor-js.tsx#L1-L800)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)

**Section sources**
- [src/app/servicios/page.tsx:1-17](file://src/app/servicios/page.tsx#L1-L17)
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L1-L82)
- [src/lib/actions.ts:1-136](file://src/lib/actions.ts#L1-L136)
- [src/lib/cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [src/app/admin/servicios/page.tsx:1-729](file://src/app/admin/servicios/page.tsx#L1-L729)
- [src/app/api/servicios/route.ts:1-163](file://src/app/api/servicios/route.ts#L1-L163)
- [src/components/editor-js.tsx:1-800](file://src/components/editor-js.tsx#L1-L800)
- [src/components/media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)

## Performance Considerations
- Concurrent data fetching: Pages use Promise.all to minimize load time
- Image optimization: Cloudinary transformations reduce bandwidth and improve loading speed
- Responsive images: Next.js Image with sizes and responsive URLs prevent oversized assets
- Cache revalidation: API endpoints invalidate caches after mutations to keep content fresh
- Pagination and lazy loading: Media library components support infinite scroll and pagination
- Minimal client-side hydration: EditorJS is initialized on the client to avoid SSR overhead
- Enhanced content caching: Dual content fields allow for optimized preview rendering
- Sticky sidebar optimization: Desktop layout improvements without impacting mobile performance

## Troubleshooting Guide
Common issues and resolutions:
- Service not found: Detail pages redirect to 404 when service is null or inactive
- Slug conflicts: API ensures unique slugs by appending timestamp when duplicates occur
- Missing images: Components fall back to icons or gradient backgrounds when imageUrl is unavailable
- Media upload errors: Media picker displays user-friendly error messages and suggests alternatives
- Cache inconsistencies: API revalidation ensures pages reflect recent changes immediately
- Content synchronization: Admin interface ensures shortBlocks and full blocks are properly maintained
- Layout issues: Sticky sidebar adapts to viewport changes for optimal desktop experience

**Section sources**
- [src/app/servicios/[slug]/page.tsx](file://src/app/servicios/[slug]/page.tsx#L60-L62)
- [src/app/api/servicios/route.ts:41-45](file://src/app/api/servicios/route.ts#L41-L45)
- [src/components/media-picker.tsx:204-213](file://src/components/media-picker.tsx#L204-L213)

## Conclusion
The Services Catalog System provides a robust, SEO-friendly, and maintainable solution for managing and presenting service offerings. It leverages Next.js app router pages, a clean component architecture, Prisma-backed data models, Cloudinary-powered image optimization, and a comprehensive admin interface with enhanced EditorJS content editing. The system balances performance with flexibility, enabling efficient content updates and scalable growth. The recent enhancements include prominent summary sections, improved layout patterns, and dual content management capabilities that significantly improve user experience and content organization.