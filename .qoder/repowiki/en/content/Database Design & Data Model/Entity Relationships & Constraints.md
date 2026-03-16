# Entity Relationships & Constraints

<cite>
**Referenced Files in This Document**
- [schema.prisma](file://prisma/schema.prisma)
- [db.ts](file://src/lib/db.ts)
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [route.ts](file://src/app/api/carrusel/route.ts)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-references.ts](file://src/lib/media-references.ts)
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
This document explains the database entity relationships and referential constraints in GreenAxis, focusing on:
- One-to-many relationships between PlatformConfig and content entities
- Unique constraints for slugs across Service and News models for URL-friendly routing
- Ordering mechanisms via integer order fields for carousel slides and content management
- Active/published status flags and their impact on content visibility
- Hash-based duplicate detection in SiteImage and its integration with media workflows
- Prisma query patterns, relationship loading strategies, and performance considerations

## Project Structure
The data model is defined in the Prisma schema. Application-level APIs use Prisma to enforce constraints and maintain ordering and visibility flags. Media management integrates with SiteImage and cross-table reference resolution.

```mermaid
graph TB
subgraph "Data Model (Prisma)"
PC["PlatformConfig"]
SVC["Service"]
NEWS["News"]
IMG["SiteImage"]
CAR["CarouselSlide"]
LEG["LegalPage"]
ABT["AboutPage"]
end
subgraph "API Layer"
API_SVC["/api/servicios"]
API_NEWS["/api/noticias"]
API_CAR["/api/carrusel"]
end
subgraph "Media Layer"
LIB_DB["db.ts (PrismaClient)"]
MEDIA_LIB["MediaLibraryBrowser"]
MEDIA_REF["media-references.ts"]
end
API_SVC --> LIB_DB
API_NEWS --> LIB_DB
API_CAR --> LIB_DB
MEDIA_LIB --> LIB_DB
MEDIA_REF --> LIB_DB
PC --- SVC
PC --- NEWS
PC --- CAR
PC --- LEG
PC --- ABT
```

**Diagram sources**
- [schema.prisma](file://prisma/schema.prisma)
- [db.ts](file://src/lib/db.ts)
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [route.ts](file://src/app/api/carrusel/route.ts)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-references.ts](file://src/lib/media-references.ts)

**Section sources**
- [schema.prisma](file://prisma/schema.prisma)
- [db.ts](file://src/lib/db.ts)

## Core Components
- PlatformConfig: Central configuration hub for branding, contact, SEO, and theme. It is conceptually a singleton-like entity referenced by other content entities.
- Service: Editable service catalog with URL-friendly slug, ordering, and active flag.
- News: Blog/news entries with URL-friendly slug, publishing workflow, and optional Editor.js content.
- SiteImage: Media registry with optional key, label, category, and SHA-256 hash for duplicate detection.
- CarouselSlide: Hero carousel entries with ordering and active flag.
- LegalPage and AboutPage: Static content pages with optional Editor.js content.

Key constraints and flags:
- Unique slugs for Service and News enable deterministic routing.
- Integer order fields control presentation order for Services and CarouselSlides.
- Active flags govern visibility; published flags control content availability.

**Section sources**
- [schema.prisma](file://prisma/schema.prisma)

## Architecture Overview
The system uses Prisma as the ORM over SQLite/Turso. APIs perform CRUD operations while enforcing:
- Slug uniqueness and generation helpers
- Ordering via integer fields
- Visibility via active/published flags
- Media lifecycle via SiteImage and cross-reference utilities

```mermaid
sequenceDiagram
participant Client as "Client"
participant API as "/api/servicios"
participant DB as "PrismaClient"
participant Model as "Service"
Client->>API : POST /api/servicios
API->>API : generateSlug(title)
API->>DB : findUnique({ slug })
DB-->>API : existing?
API->>DB : create({ slug, order, active })
DB-->>Model : Service
API-->>Client : 201 Service
```

**Diagram sources**
- [route.ts](file://src/app/api/servicios/route.ts)
- [schema.prisma](file://prisma/schema.prisma)

## Detailed Component Analysis

### PlatformConfig and Content Entities
- Relationship pattern: PlatformConfig acts as a shared configuration anchor for branding and contact details. While there is no explicit foreign key in the schema, content entities reference PlatformConfig indirectly through configuration fields (e.g., logoUrl, faviconUrl, aboutImageUrl).
- Impact: Changes to PlatformConfig propagate visually across content that references these fields.

```mermaid
classDiagram
class PlatformConfig {
+String id
+String? logoUrl
+String? faviconUrl
+String? aboutImageUrl
+Boolean aboutSectionEnabled
+String? primaryColor
+DateTime createdAt
+DateTime updatedAt
}
class Service {
+String id
+String title
+String slug
+Int order
+Boolean active
+Boolean featured
}
class News {
+String id
+String title
+String slug
+Boolean published
+DateTime? publishedAt
+Boolean featured
}
class CarouselSlide {
+String id
+Int order
+Boolean active
}
class LegalPage {
+String id
+String slug
}
class AboutPage {
+String id
+String? heroImageUrl
+String? historyImageUrl
}
PlatformConfig --> Service : "branding/contact"
PlatformConfig --> News : "branding/contact"
PlatformConfig --> CarouselSlide : "branding/contact"
PlatformConfig --> LegalPage : "branding/contact"
PlatformConfig --> AboutPage : "branding/contact"
```

**Diagram sources**
- [schema.prisma](file://prisma/schema.prisma)

**Section sources**
- [schema.prisma](file://prisma/schema.prisma)

### Slug Uniqueness and Routing
- Service and News enforce unique slugs to support URL-friendly routing.
- APIs generate slugs from titles and append timestamps to ensure uniqueness during creation and updates.

```mermaid
flowchart TD
Start(["Create/Update Entry"]) --> Gen["Generate slug from title"]
Gen --> Check["Check unique constraint"]
Check --> Exists{"Exists?"}
Exists --> |Yes| Append["Append timestamp suffix"]
Exists --> |No| Save["Persist with slug"]
Append --> Save
Save --> Route["Route by slug"]
```

**Diagram sources**
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [schema.prisma](file://prisma/schema.prisma)

**Section sources**
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [schema.prisma](file://prisma/schema.prisma)

### Ordering Mechanisms
- Services and CarouselSlides use integer order fields to define presentation order.
- APIs sort by ascending order for consistent rendering.

```mermaid
sequenceDiagram
participant Admin as "Admin UI"
participant API as "/api/servicios"
participant DB as "PrismaClient"
Admin->>API : GET /api/servicios
API->>DB : findMany(orderBy : { order : asc })
DB-->>API : Ordered Services
API-->>Admin : 200 OK
```

**Diagram sources**
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/carrusel/route.ts)

**Section sources**
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/carrusel/route.ts)

### Active/Published Flags and Visibility
- Service.active controls whether a service appears in listings.
- News.published toggles visibility; publishedAt tracks publication timestamp.
- These flags are respected by API queries and UI rendering.

```mermaid
flowchart TD
A["Read Content"] --> B{"active/published?"}
B --> |Yes| C["Include in responses"]
B --> |No| D["Exclude from responses"]
```

**Diagram sources**
- [schema.prisma](file://prisma/schema.prisma)
- [route.ts](file://src/app/api/noticias/route.ts)

**Section sources**
- [schema.prisma](file://prisma/schema.prisma)
- [route.ts](file://src/app/api/noticias/route.ts)

### Hash-Based Duplicate Detection in SiteImage
- SiteImage.hash stores a SHA-256 digest to detect duplicates during uploads.
- The media library browser supports infinite scroll and filtering by category; media references are tracked across content tables.

```mermaid
sequenceDiagram
participant Client as "Client"
participant API as "/api/admin/media"
participant DB as "PrismaClient"
participant Ref as "media-references.ts"
Client->>API : Upload image
API->>DB : create SiteImage({ url, hash })
DB-->>API : Created
API-->>Client : 201 Created
Client->>Ref : findMediaReferences(url)
Ref->>DB : scan PlatformConfig, News, CarouselSlide, LegalPage, AboutPage
DB-->>Ref : rows
Ref-->>Client : References[]
```

**Diagram sources**
- [schema.prisma](file://prisma/schema.prisma)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-references.ts](file://src/lib/media-references.ts)

**Section sources**
- [schema.prisma](file://prisma/schema.prisma)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-references.ts](file://src/lib/media-references.ts)

## Dependency Analysis
- PrismaClient is initialized with a LibSQL adapter and Turso credentials, enabling SQLite-compatible operations.
- APIs depend on Prisma for data access and enforce business rules (ordering, visibility, slug uniqueness).
- Media utilities traverse multiple tables to locate and update references when media is changed or removed.

```mermaid
graph LR
DBTS["db.ts"] --> PRISMA["PrismaClient"]
ROUTE_SVC["/api/servicios/route.ts"] --> PRISMA
ROUTE_NEWS["/api/noticias/route.ts"] --> PRISMA
ROUTE_CAR["/api/carrusel/route.ts"] --> PRISMA
MEDIA_LIB["media-library-browser.tsx"] --> PRISMA
MEDIA_REF["media-references.ts"] --> PRISMA
```

**Diagram sources**
- [db.ts](file://src/lib/db.ts)
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [route.ts](file://src/app/api/carrusel/route.ts)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-references.ts](file://src/lib/media-references.ts)

**Section sources**
- [db.ts](file://src/lib/db.ts)
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [route.ts](file://src/app/api/carrusel/route.ts)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-references.ts](file://src/lib/media-references.ts)

## Performance Considerations
- Indexing and ordering: Use integer order fields to avoid expensive sorting at query time. Keep order values dense and update in batches when reordering.
- Slug checks: Perform unique checks before inserts/updates to prevent constraint violations.
- Pagination: Use skip/take or cursor-based pagination for large lists (as seen in News API).
- Media scanning: Limit scans to necessary tables when updating references; cache results when appropriate.
- ORM logging: Enable Prisma query logs in development to identify slow queries.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Slug conflicts: When creating or updating Service/News, ensure slug uniqueness. The APIs append a timestamp suffix if a conflict is detected.
- Published vs active: Verify published flags for News and active flags for Services when content does not appear.
- Media deletion: Before removing images, resolve references across PlatformConfig, News, CarouselSlide, LegalPage, and AboutPage using the media reference utilities.
- Database connectivity: Confirm Turso connection settings in the Prisma adapter initialization.

**Section sources**
- [route.ts](file://src/app/api/servicios/route.ts)
- [route.ts](file://src/app/api/noticias/route.ts)
- [media-references.ts](file://src/lib/media-references.ts)
- [db.ts](file://src/lib/db.ts)

## Conclusion
GreenAxis employs a straightforward relational model centered on Prisma. Unique slugs, integer order fields, and visibility flags provide predictable content behavior. Media workflows leverage SiteImage hashing and cross-table reference utilities to maintain consistency. APIs encapsulate business rules, ensuring robust data integrity and efficient rendering.

[No sources needed since this section summarizes without analyzing specific files]