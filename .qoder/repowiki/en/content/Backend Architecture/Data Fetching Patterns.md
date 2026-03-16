# Data Fetching Patterns

<cite>
**Referenced Files in This Document**
- [db.ts](file://src/lib/db.ts)
- [schema.prisma](file://prisma/schema.prisma)
- [cloudinary.ts](file://src/lib/cloudinary.ts)
- [media-references.ts](file://src/lib/media-references.ts)
- [actions.ts](file://src/lib/actions.ts)
- [auth.ts](file://src/lib/auth.ts)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-picker.tsx](file://src/components/media-picker.tsx)
- [route.ts](file://src/app/api/admin/images/route.ts)
- [route.ts](file://src/app/api/admin/config/route.ts)
- [route.ts](file://src/app/api/admin/media/route.ts)
- [route.ts](file://src/app/api/admin/media/[id]/route.ts)
- [route.ts](file://src/app/api/admin/media/check-references/route.ts)
- [route.ts](file://src/app/api/upload/route.ts)
- [route.ts](file://src/app/api/route.ts)
- [package.json](file://package.json)
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
This document explains the data fetching patterns implemented in the GreenAxis backend. It covers server actions, Prisma client usage, database query patterns, caching and revalidation, media reference checking, duplicate detection, file management workflows, error handling, validation strategies, and response formatting. It also documents integrations with Cloudinary and the Turso database via LibSQL, and provides guidance on performance optimization, query optimization, and data consistency.

## Project Structure
The backend follows a Next.js App Router structure with API routes under src/app/api, shared libraries under src/lib, and UI components under src/components. Data access is centralized through a Prisma client configured to use LibSQL/Turso.

```mermaid
graph TB
subgraph "Client Components"
MLB["MediaLibraryBrowser<br/>(src/components/media-library-browser.tsx)"]
MP["MediaPicker<br/>(src/components/media-picker.tsx)"]
end
subgraph "Server Actions"
ACT["actions.ts<br/>(src/lib/actions.ts)"]
end
subgraph "API Routes"
IMG["/api/admin/images<br/>(src/app/api/admin/images/route.ts)"]
CFG["/api/admin/config<br/>(src/app/api/admin/config/route.ts)"]
MED["/api/admin/media<br/>(src/app/api/admin/media/route.ts)"]
MID["/api/admin/media/[id]<br/>(src/app/api/admin/media/[id]/route.ts)"]
MCR["/api/admin/media/check-references<br/>(src/app/api/admin/media/check-references/route.ts)"]
UPL["/api/upload<br/>(src/app/api/upload/route.ts)"]
end
subgraph "Libraries"
DB["db.ts<br/>(src/lib/db.ts)"]
AUTH["auth.ts<br/>(src/lib/auth.ts)"]
CR["cloudinary.ts<br/>(src/lib/cloudinary.ts)"]
MR["media-references.ts<br/>(src/lib/media-references.ts)"]
end
subgraph "Database"
PRISMA["schema.prisma<br/>(prisma/schema.prisma)"]
end
MLB --> MED
MP --> UPL
MP --> MED
ACT --> PRISMA
IMG --> PRISMA
CFG --> PRISMA
MED --> PRISMA
MID --> PRISMA
MCR --> MR
MR --> PRISMA
UPL --> CR
UPL --> PRISMA
DB --> PRISMA
AUTH --> PRISMA
```

**Diagram sources**
- [media-library-browser.tsx:97-136](file://src/components/media-library-browser.tsx#L97-L136)
- [media-picker.tsx:149-196](file://src/components/media-picker.tsx#L149-L196)
- [actions.ts:6-22](file://src/lib/actions.ts#L6-L22)
- [route.ts:10-25](file://src/app/api/admin/images/route.ts#L10-L25)
- [route.ts:12-39](file://src/app/api/admin/config/route.ts#L12-L39)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [route.ts:125-319](file://src/app/api/admin/media/[id]/route.ts#L125-L319)
- [route.ts:37-85](file://src/app/api/admin/media/check-references/route.ts#L37-L85)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [schema.prisma:1-277](file://prisma/schema.prisma#L1-L277)

**Section sources**
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)
- [schema.prisma:1-277](file://prisma/schema.prisma#L1-L277)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)
- [actions.ts:1-136](file://src/lib/actions.ts#L1-L136)
- [auth.ts:1-170](file://src/lib/auth.ts#L1-L170)
- [media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [route.ts:1-73](file://src/app/api/admin/images/route.ts#L1-L73)
- [route.ts:1-120](file://src/app/api/admin/config/route.ts#L1-L120)
- [route.ts:1-150](file://src/app/api/admin/media/route.ts#L1-L150)
- [route.ts:1-320](file://src/app/api/admin/media/[id]/route.ts#L1-L320)
- [route.ts:1-86](file://src/app/api/admin/media/check-references/route.ts#L1-L86)
- [route.ts:1-452](file://src/app/api/upload/route.ts#L1-L452)
- [route.ts:1-5](file://src/app/api/route.ts#L1-L5)
- [package.json:1-116](file://package.json#L1-L116)

## Core Components
- Prisma client configured with LibSQL adapter for Turso database connectivity.
- Media reference utilities for scanning and updating references across content models.
- Cloudinary integration for URL transformation and asset storage.
- Authentication utilities for admin session verification.
- Server action functions for fetching domain data.
- API routes for media listing, single-item operations, reference checks, uploads, and admin configuration.

**Section sources**
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [auth.ts:156-170](file://src/lib/auth.ts#L156-L170)
- [actions.ts:6-22](file://src/lib/actions.ts#L6-L22)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [route.ts:125-319](file://src/app/api/admin/media/[id]/route.ts#L125-L319)
- [route.ts:37-85](file://src/app/api/admin/media/check-references/route.ts#L37-L85)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [route.ts:12-39](file://src/app/api/admin/config/route.ts#L12-L39)

## Architecture Overview
The system integrates UI components with server actions and API routes. Data retrieval uses Prisma queries with pagination and filtering. Media operations leverage Cloudinary in production and local filesystem in development. Reference integrity is enforced through media reference scanning and updates.

```mermaid
sequenceDiagram
participant UI as "MediaLibraryBrowser"
participant API as "GET /api/admin/media"
participant PRISMA as "Prisma Client"
participant UTIL as "findMediaReferences"
UI->>API : Fetch media with filters and pagination
API->>PRISMA : findMany(SiteImage) with orderBy, skip, take
PRISMA-->>API : Items
loop For each item
API->>UTIL : findMediaReferences(url)
UTIL->>PRISMA : scan PlatformConfig, News, CarouselSlide, LegalPage, AboutPage
PRISMA-->>UTIL : References
UTIL-->>API : Usage count
end
API-->>UI : { items, pagination }
```

**Diagram sources**
- [media-library-browser.tsx:97-136](file://src/components/media-library-browser.tsx#L97-L136)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

**Section sources**
- [media-library-browser.tsx:97-136](file://src/components/media-library-browser.tsx#L97-L136)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

## Detailed Component Analysis

### Prisma Client and Database Schema
- The Prisma client is initialized with a LibSQL adapter pointing to Turso. It logs queries and is globally cached to avoid multiple instances.
- The schema defines models for platform configuration, services, news, site images, carousel slides, legal pages, contact messages, social feed configurations, admins, password reset tokens, and about page content.

```mermaid
erDiagram
PLATFORM_CONFIG {
string id PK
string siteName
string siteUrl
string siteSlogan
string siteDescription
string logoUrl
string faviconUrl
string companyName
string companyAddress
string companyPhone
string companyEmail
string notificationEmail
string facebookUrl
string instagramUrl
string twitterUrl
string linkedinUrl
string tiktokUrl
string youtubeUrl
string footerText
string socialText
string whatsappNumber
string whatsappMessage
boolean whatsappShowBubble
string aboutImageUrl
string aboutTitle
string aboutDescription
string aboutYearsExperience
string aboutYearsText
string aboutStats
string aboutFeatures
boolean aboutSectionEnabled
string aboutBadge
string aboutBadgeColor
boolean showMapSection
string metaKeywords
string googleAnalytics
string googleMapsEmbed
string primaryColor
datetime createdAt
datetime updatedAt
}
SERVICE {
string id PK
string title
string slug
string description
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
NEWS {
string id PK
string title
string slug
string excerpt
string content
string imageUrl
string author
boolean published
boolean featured
datetime publishedAt
string blocks
boolean showCoverInContent
string imageCaption
datetime createdAt
datetime updatedAt
}
SITE_IMAGE {
string id PK
string key
string label
string description
string url
string alt
string category
string hash
datetime createdAt
datetime updatedAt
}
CAROUSEL_SLIDE {
string id PK
string title
string subtitle
string description
string imageUrl
string buttonText
string buttonUrl
string linkUrl
boolean gradientEnabled
boolean animationEnabled
string gradientColor
int order
boolean active
datetime createdAt
datetime updatedAt
}
LEGAL_PAGE {
string id PK
string slug
string title
string content
string blocks
string manualDate
datetime updatedAt
datetime createdAt
}
CONTACT_MESSAGE {
string id PK
string name
string email
string phone
string company
string subject
string message
boolean consent
boolean read
datetime createdAt
}
SOCIAL_FEED_CONFIG {
string id PK
string platform
string embedCode
string accessToken
string pageId
boolean active
datetime createdAt
datetime updatedAt
}
ADMIN {
string id PK
string email
string password
string name
string role
string status
datetime createdAt
datetime updatedAt
}
PASSWORD_RESET_TOKEN {
string id PK
string email
string token
datetime expiresAt
boolean used
datetime createdAt
}
ABOUT_PAGE {
string id PK
string heroTitle
string heroSubtitle
string heroImageUrl
string historyTitle
string historyContent
string historyImageUrl
string missionTitle
string missionContent
string visionTitle
string visionContent
string valuesTitle
string valuesContent
string teamTitle
boolean teamEnabled
string teamMembers
string whyChooseTitle
string whyChooseContent
string ctaTitle
string ctaSubtitle
string ctaButtonText
string ctaButtonUrl
boolean statsEnabled
string statsContent
boolean certificationsEnabled
string certificationsContent
boolean showLocationSection
datetime createdAt
datetime updatedAt
}
```

**Diagram sources**
- [schema.prisma:16-277](file://prisma/schema.prisma#L16-L277)

**Section sources**
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)
- [schema.prisma:1-277](file://prisma/schema.prisma#L1-L277)

### Media Reference Utilities
- Extracts media URLs from EditorJS blocks JSON.
- Scans multiple models for references to a given URL and returns structured references.
- Updates references across models and EditorJS blocks, replacing URLs safely.

```mermaid
flowchart TD
Start(["findMediaReferences(url)"]) --> Validate["Validate URL"]
Validate --> ScanPC["Scan PlatformConfig fields"]
ScanPC --> ScanNews["Scan News (imageUrl and blocks)"]
ScanNews --> ScanSlides["Scan CarouselSlide"]
ScanSlides --> ScanLegal["Scan LegalPage (blocks)"]
ScanLegal --> ScanAbout["Scan AboutPage fields"]
ScanAbout --> ReturnRefs["Return references array"]
UpdateStart(["updateMediaReferences(oldUrl, newUrl)"]) --> UpdatePC["Update PlatformConfig fields"]
UpdatePC --> UpdateNews["Update News blocks and fields"]
UpdateNews --> UpdateSlides["Update CarouselSlide"]
UpdateSlides --> UpdateLegal["Update LegalPage blocks"]
UpdateLegal --> UpdateAbout["Update AboutPage fields"]
UpdateAbout --> Done(["Done"])
```

**Diagram sources**
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [media-references.ts:190-333](file://src/lib/media-references.ts#L190-L333)

**Section sources**
- [media-references.ts:21-56](file://src/lib/media-references.ts#L21-L56)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [media-references.ts:190-333](file://src/lib/media-references.ts#L190-L333)

### Media Library Browser (Client)
- Implements infinite scroll pagination, search, and category filtering.
- Fetches media from the admin media API endpoint and displays usage counts.

```mermaid
sequenceDiagram
participant Comp as "MediaLibraryBrowser"
participant API as "GET /api/admin/media"
participant PRISMA as "Prisma Client"
Comp->>API : Fetch with page, limit, category, search, type
API->>PRISMA : findMany(SiteImage) with filters
PRISMA-->>API : Items
API-->>Comp : { items, pagination }
Comp->>Comp : Render grid and load more
```

**Diagram sources**
- [media-library-browser.tsx:97-136](file://src/components/media-library-browser.tsx#L97-L136)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)

**Section sources**
- [media-library-browser.tsx:97-136](file://src/components/media-library-browser.tsx#L97-L136)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)

### Media Picker (Client)
- Provides a unified interface to select from library or upload new files.
- Handles duplicate detection warnings and progress tracking during uploads.

```mermaid
sequenceDiagram
participant MP as "MediaPicker"
participant API as "POST /api/upload"
participant CL as "Cloudinary"
participant PRISMA as "Prisma Client"
MP->>API : Upload file with metadata
API->>CL : Upload stream (production) or write file (development)
CL-->>API : Secure URL
API->>PRISMA : Upsert SiteImage record
PRISMA-->>API : Updated/created record
API-->>MP : { success, url, replaced }
```

**Diagram sources**
- [media-picker.tsx:201-316](file://src/components/media-picker.tsx#L201-L316)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

**Section sources**
- [media-picker.tsx:201-316](file://src/components/media-picker.tsx#L201-L316)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

### Admin Media API
- GET lists media with pagination, filtering, and usage calculation.
- PUT updates media metadata.
- DELETE deletes media with reference checks and storage cleanup.

```mermaid
sequenceDiagram
participant Admin as "Admin UI"
participant API as "DELETE /api/admin/media/[id]"
participant PRISMA as "Prisma Client"
participant STOR as "Storage (Cloudinary/FS)"
Admin->>API : DELETE with force flag
API->>PRISMA : findUnique(SiteImage)
PRISMA-->>API : Media record
API->>API : findMediaReferences(url) if not force
API->>STOR : deleteFileFromStorage(url)
API->>PRISMA : delete(SiteImage)
API-->>Admin : { success, deleted }
```

**Diagram sources**
- [route.ts:220-319](file://src/app/api/admin/media/[id]/route.ts#L220-L319)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

**Section sources**
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [route.ts:125-319](file://src/app/api/admin/media/[id]/route.ts#L125-L319)
- [route.ts:37-85](file://src/app/api/admin/media/check-references/route.ts#L37-L85)

### Upload Workflow
- Validates MIME types and sizes, performs duplicate detection, uploads to Cloudinary in production or writes to filesystem in development, and updates the database record.

```mermaid
flowchart TD
StartU(["POST /api/upload"]) --> Auth["Authenticate admin"]
Auth --> ValidateMT["Validate MIME type and size"]
ValidateMT --> DupCheck{"Skip duplicate check?"}
DupCheck --> |No| FindDup["Find similar filenames"]
FindDup --> DupFound{"Duplicates found?"}
DupFound --> |Yes| Warn["Return duplicate suggestions"]
DupFound --> |No| Upload["Upload to Cloudinary or FS"]
DupCheck --> |Yes| Upload
Upload --> SaveDB["Upsert SiteImage record"]
SaveDB --> DoneU(["Return success with replaced flag"])
```

**Diagram sources**
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

**Section sources**
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

### Server Actions
- Provide server-side data fetching for platform configuration, services, news, site images, carousel slides, legal pages, contact messages, and social feed configurations.

```mermaid
sequenceDiagram
participant UI as "Server Component"
participant ACT as "getPlatformConfig"
participant PRISMA as "Prisma Client"
UI->>ACT : Call server action
ACT->>PRISMA : findFirst/findOne/create
PRISMA-->>ACT : Config record
ACT-->>UI : Config data
```

**Diagram sources**
- [actions.ts:6-22](file://src/lib/actions.ts#L6-L22)

**Section sources**
- [actions.ts:6-22](file://src/lib/actions.ts#L6-L22)
- [actions.ts:25-37](file://src/lib/actions.ts#L25-L37)
- [actions.ts:47-65](file://src/lib/actions.ts#L47-L65)
- [actions.ts:82-93](file://src/lib/actions.ts#L82-L93)
- [actions.ts:96-108](file://src/lib/actions.ts#L96-L108)
- [actions.ts:111-120](file://src/lib/actions.ts#L111-L120)
- [actions.ts:123-127](file://src/lib/actions.ts#L123-L127)
- [actions.ts:130-134](file://src/lib/actions.ts#L130-L134)

### Authentication Utilities
- Manage admin sessions, verify credentials, and enforce access control on protected routes.

**Section sources**
- [auth.ts:156-170](file://src/lib/auth.ts#L156-L170)
- [route.ts:10-25](file://src/app/api/admin/images/route.ts#L10-L25)
- [route.ts:12-39](file://src/app/api/admin/config/route.ts#L12-L39)
- [route.ts:37-42](file://src/app/api/admin/media/route.ts#L37-L42)
- [route.ts:125-133](file://src/app/api/admin/media/[id]/route.ts#L125-L133)
- [route.ts:37-42](file://src/app/api/admin/media/check-references/route.ts#L37-L42)

## Dependency Analysis
- The Prisma client depends on the LibSQL adapter and Turso environment variables.
- Media operations depend on Cloudinary SDK for production and Node filesystem APIs for development.
- UI components depend on API routes for data and Cloudinary utilities for URL transformation.

```mermaid
graph LR
MP["MediaPicker"] --> UPL["/api/upload"]
MLB["MediaLibraryBrowser"] --> MED["/api/admin/media"]
MED --> MR["findMediaReferences"]
MR --> PRISMA["Prisma Client"]
UPL --> CL["Cloudinary"]
UPL --> PRISMA
DB["db.ts"] --> PRISMA
AUTH["auth.ts"] --> PRISMA
```

**Diagram sources**
- [media-picker.tsx:201-316](file://src/components/media-picker.tsx#L201-L316)
- [media-library-browser.tsx:97-136](file://src/components/media-library-browser.tsx#L97-L136)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)

**Section sources**
- [package.json:33-36](file://package.json#L33-L36)
- [db.ts:1-21](file://src/lib/db.ts#L1-L21)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)
- [route.ts:37-149](file://src/app/api/admin/media/route.ts#L37-L149)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)

## Performance Considerations
- Pagination and filtering: The media listing endpoint uses skip/take with explicit limits and calculates approximate totals when type filtering is applied.
- Parallelization: Server actions use Promise.all for concurrent counts and queries where appropriate.
- Caching and revalidation: Admin configuration and image deletion trigger cache revalidation to keep rendered pages up-to-date.
- Storage efficiency: Cloudinary transformations are applied via URL manipulation to optimize delivery without storing multiple variants.
- File size limits: Environment-aware limits reduce payload sizes and improve reliability.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Authentication failures: Protected routes return unauthorized responses when admin session is missing or invalid.
- Validation errors: Upload route validates MIME types, sizes, and file signatures; returns descriptive errors for invalid inputs.
- Reference conflicts: Media deletion checks references and refuses deletion unless forced; provides structured reference details.
- Storage errors: Deletion attempts are handled gracefully with warnings; partial cleanup continues even if storage operations fail.
- Database errors: Server actions and API routes wrap operations with try/catch and return standardized error responses.

**Section sources**
- [auth.ts:156-170](file://src/lib/auth.ts#L156-L170)
- [route.ts:10-25](file://src/app/api/admin/images/route.ts#L10-L25)
- [route.ts:252-280](file://src/app/api/admin/media/[id]/route.ts#L252-L280)
- [route.ts:170-211](file://src/app/api/upload/route.ts#L170-L211)
- [route.ts:292-300](file://src/app/api/upload/route.ts#L292-L300)
- [route.ts:313-323](file://src/app/api/upload/route.ts#L313-L323)

## Conclusion
GreenAxis implements robust data fetching patterns centered on Prisma and Next.js App Router. The system ensures data consistency through media reference checks, supports scalable media workflows with Cloudinary and local storage, and maintains performance via pagination, parallel queries, and cache revalidation. The documented APIs and utilities provide clear patterns for extending functionality while preserving reliability and user experience.