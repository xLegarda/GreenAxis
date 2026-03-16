# Media Management System

<cite>
**Referenced Files in This Document**
- [cloudinary.ts](file://src/lib/cloudinary.ts)
- [cloudinary-loader.ts](file://src/lib/cloudinary-loader.ts)
- [media-card.tsx](file://src/components/media-card.tsx)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [media-picker.tsx](file://src/components/media-picker.tsx)
- [media-picker-modal.tsx](file://src/components/media-picker-modal.tsx)
- [media-preview-modal.tsx](file://src/components/media-preview-modal.tsx)
- [media-references.ts](file://src/lib/media-references.ts)
- [external-media-form.tsx](file://src/components/external-media-form.tsx)
- [media-picker-compact.tsx](file://src/components/media-picker-compact.tsx)
- [route.ts](file://src/app/api/admin/media/route.ts)
- [route.ts](file://src/app/api/upload/route.ts)
- [route.ts](file://src/app/api/admin/media/check-references/route.ts)
- [route.ts](file://src/app/api/admin/media/external/route.ts)
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
This document describes the media management system built with Next.js and Cloudinary. It covers Cloudinary integration for optimization and CDN delivery, a media library browser with search and filtering, media picker components for content insertion, media card display, preview modal functionality, upload endpoint handling, and reference tracking mechanisms. It also explains duplicate detection algorithms, file validation, optimization settings, storage management, drag-and-drop upload, batch operations, and media metadata handling.

## Project Structure
The media management system is composed of:
- UI components for browsing, selecting, and previewing media
- API endpoints for listing, uploading, referencing, and external media registration
- Utility libraries for Cloudinary URL optimization and reference resolution
- Database-backed storage via Prisma ORM

```mermaid
graph TB
subgraph "UI Layer"
Browser["MediaLibraryBrowser"]
Picker["MediaPicker"]
Compact["MediaPickerCompact"]
Card["MediaCard"]
Preview["MediaPreviewModal"]
ExtForm["ExternalMediaForm"]
Modal["MediaPickerModal"]
end
subgraph "API Layer"
MediaAPI["GET /api/admin/media"]
UploadAPI["POST /api/upload"]
RefCheckAPI["POST /api/admin/media/check-references"]
ExtAPI["POST /api/admin/media/external"]
end
subgraph "Libraries"
Cloudinary["Cloudinary Utils"]
Loader["Next.js Cloudinary Loader"]
Refs["Reference Tracker"]
end
subgraph "Storage"
DB["Prisma DB (siteImage)"]
Cloud["Cloudinary CDN"]
FS["Local Filesystem"]
end
Browser --> MediaAPI
Picker --> MediaAPI
Compact --> MediaAPI
Picker --> UploadAPI
Compact --> UploadAPI
Preview --> RefCheckAPI
ExtForm --> ExtAPI
MediaAPI --> DB
UploadAPI --> DB
UploadAPI --> Cloud
UploadAPI --> FS
RefCheckAPI --> Refs
Refs --> DB
Browser --> Card
Picker --> Card
Compact --> Card
Preview --> Card
Loader --> Cloudinary
Cloudinary --> Cloud
```

**Diagram sources**
- [media-library-browser.tsx:69-362](file://src/components/media-library-browser.tsx#L69-L362)
- [media-picker.tsx:106-754](file://src/components/media-picker.tsx#L106-L754)
- [media-picker-compact.tsx:94-691](file://src/components/media-picker-compact.tsx#L94-L691)
- [media-card.tsx:103-295](file://src/components/media-card.tsx#L103-L295)
- [media-preview-modal.tsx:97-516](file://src/components/media-preview-modal.tsx#L97-L516)
- [external-media-form.tsx:59-302](file://src/components/external-media-form.tsx#L59-L302)
- [route.ts:37-150](file://src/app/api/admin/media/route.ts#L37-L150)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [route.ts:37-86](file://src/app/api/admin/media/check-references/route.ts#L37-L86)
- [route.ts:16-114](file://src/app/api/admin/media/external/route.ts#L16-L114)
- [cloudinary.ts:11-119](file://src/lib/cloudinary.ts#L11-L119)
- [cloudinary-loader.ts:10-59](file://src/lib/cloudinary-loader.ts#L10-L59)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

**Section sources**
- [media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [media-picker-compact.tsx:1-691](file://src/components/media-picker-compact.tsx#L1-L691)
- [media-card.tsx:1-295](file://src/components/media-card.tsx#L1-L295)
- [media-preview-modal.tsx:1-516](file://src/components/media-preview-modal.tsx#L1-L516)
- [external-media-form.tsx:1-302](file://src/components/external-media-form.tsx#L1-L302)
- [route.ts:1-150](file://src/app/api/admin/media/route.ts#L1-L150)
- [route.ts:1-452](file://src/app/api/upload/route.ts#L1-L452)
- [route.ts:1-86](file://src/app/api/admin/media/check-references/route.ts#L1-L86)
- [route.ts:1-114](file://src/app/api/admin/media/external/route.ts#L1-L114)
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [cloudinary-loader.ts:1-59](file://src/lib/cloudinary-loader.ts#L1-L59)
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

## Core Components
- Cloudinary utilities for URL transformation and presets
- Next.js Cloudinary loader for responsive image generation
- MediaCard for unified media display with actions
- MediaLibraryBrowser for grid browsing with search, filtering, and infinite scroll
- MediaPicker for library and upload tabs with drag-and-drop and duplicate detection
- MediaPickerCompact for lightweight inline selection
- MediaPreviewModal for metadata editing and reference inspection
- ExternalMediaForm for registering external URLs
- Reference tracker for detecting and updating usages across content

**Section sources**
- [cloudinary.ts:11-119](file://src/lib/cloudinary.ts#L11-L119)
- [cloudinary-loader.ts:10-59](file://src/lib/cloudinary-loader.ts#L10-L59)
- [media-card.tsx:32-295](file://src/components/media-card.tsx#L32-L295)
- [media-library-browser.tsx:37-362](file://src/components/media-library-browser.tsx#L37-L362)
- [media-picker.tsx:31-754](file://src/components/media-picker.tsx#L31-L754)
- [media-picker-compact.tsx:34-691](file://src/components/media-picker-compact.tsx#L34-L691)
- [media-preview-modal.tsx:55-516](file://src/components/media-preview-modal.tsx#L55-L516)
- [external-media-form.tsx:15-302](file://src/components/external-media-form.tsx#L15-L302)
- [media-references.ts:6-334](file://src/lib/media-references.ts#L6-L334)

## Architecture Overview
The system integrates UI components with API endpoints and Cloudinary. Uploads are processed through a dedicated endpoint that validates files, detects duplicates, stores records, and manages Cloudinary or local filesystem storage. The library endpoint provides paginated, searchable, and filterable media listings. Reference tracking ensures safe deletion and updates across content.

```mermaid
sequenceDiagram
participant UI as "MediaPicker"
participant API as "Upload Endpoint"
participant Cloud as "Cloudinary"
participant DB as "Prisma DB"
UI->>API : "POST /api/upload (multipart/form-data)"
API->>API : "Validate MIME/type and size"
API->>API : "Detect duplicates (normalize filename)"
alt "Duplicates found"
API-->>UI : "duplicate exists with suggestions"
else "No duplicates"
API->>Cloud : "Upload stream (production)"
Cloud-->>API : "secure_url"
API->>DB : "Create/Update siteImage record"
DB-->>API : "Success"
API-->>UI : "success : true, url, replaced"
end
```

**Diagram sources**
- [media-picker.tsx:201-316](file://src/components/media-picker.tsx#L201-L316)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)

**Section sources**
- [media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [route.ts:1-452](file://src/app/api/upload/route.ts#L1-L452)

## Detailed Component Analysis

### Cloudinary Integration
Cloudinary utilities provide:
- URL validation for Cloudinary-hosted assets
- Transformation injection for format, quality, and width
- Preset helpers for hero, thumbnail, service, and admin thumbnail sizes
- Next.js loader integration for responsive srcset generation

```mermaid
classDiagram
class CloudinaryUtils {
+isCloudinaryUrl(url) boolean
+getCloudinaryImageUrl(url, options) string
+getHeroImageUrl(url) string
+getThumbnailImageUrl(url) string
+getServiceImageUrl(url) string
+getAdminThumbnailUrl(url) string
}
class NextCloudinaryLoader {
+cloudinaryLoader(props) string
}
CloudinaryUtils <.. NextCloudinaryLoader : "used by"
```

**Diagram sources**
- [cloudinary.ts:11-119](file://src/lib/cloudinary.ts#L11-L119)
- [cloudinary-loader.ts:10-59](file://src/lib/cloudinary-loader.ts#L10-L59)

**Section sources**
- [cloudinary.ts:1-119](file://src/lib/cloudinary.ts#L1-L119)
- [cloudinary-loader.ts:1-59](file://src/lib/cloudinary-loader.ts#L1-L59)

### Media Library Browser
Features:
- Infinite scroll pagination (50 items/page)
- Debounced search by label
- Category filter (news, services, videos, audio, config, carousel, general)
- Grid layout with MediaCard items
- Preview modal for detailed editing
- External media registration

```mermaid
flowchart TD
Start(["Open MediaLibraryBrowser"]) --> Init["Initialize state<br/>loading, page, filters"]
Init --> Fetch["Fetch media items via GET /api/admin/media"]
Fetch --> Render["Render grid of MediaCard items"]
Render --> Actions{"User actions"}
Actions --> |Search| Debounce["Debounce input (300ms)"]
Debounce --> Reset["Reset page=1 and refetch"]
Actions --> |Category| ChangeCat["Update category filter"]
ChangeCat --> Reset
Actions --> |Scroll near end| LoadMore["Increment page and append items"]
Actions --> |Info| Preview["Open MediaPreviewModal"]
Actions --> |Upload| External["Open ExternalMediaForm"]
Reset --> Fetch
LoadMore --> Fetch
```

**Diagram sources**
- [media-library-browser.tsx:69-362](file://src/components/media-library-browser.tsx#L69-L362)
- [route.ts:37-150](file://src/app/api/admin/media/route.ts#L37-L150)

**Section sources**
- [media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [route.ts:1-150](file://src/app/api/admin/media/route.ts#L1-L150)

### Media Picker Components
Two variants:
- MediaPicker: Full-featured with tabs, progress, duplicate detection, drag-and-drop
- MediaPickerCompact: Lightweight inline picker optimized for small spaces

Key behaviors:
- Accept prop restricts MIME types
- maxSizeMB validation
- Duplicate detection via normalized filename comparison
- Drag-and-drop zone with visual feedback
- Duplicate suggestion dialog with quick-use option
- Upload progress tracking via XMLHttpRequest

```mermaid
sequenceDiagram
participant User as "User"
participant Picker as "MediaPicker"
participant API as "Upload Endpoint"
participant DB as "Prisma DB"
User->>Picker : "Drop file / Choose file"
Picker->>Picker : "Validate size and type"
Picker->>API : "POST /api/upload (FormData)"
API-->>Picker : "duplicate exists? (suggestions)"
alt "Use existing"
Picker->>Picker : "onChange(existing.url)"
else "Upload anyway"
Picker->>API : "POST with skipDuplicateCheck=true"
API->>DB : "Create/Update siteImage"
API-->>Picker : "success : true, url"
Picker->>Picker : "onChange(new.url)"
end
```

**Diagram sources**
- [media-picker.tsx:201-410](file://src/components/media-picker.tsx#L201-L410)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)

**Section sources**
- [media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [media-picker-compact.tsx:1-691](file://src/components/media-picker-compact.tsx#L1-L691)
- [route.ts:1-452](file://src/app/api/upload/route.ts#L1-L452)

### Media Card Display System
MediaCard renders:
- Thumbnail for images (optimized via Cloudinary utilities)
- Icons for video/audio
- Usage count badge
- Selection indicator
- Hover actions (select, delete, info)
- Tooltips with detailed metadata

```mermaid
classDiagram
class MediaCard {
+item MediaItem
+isSelected boolean
+onSelect(item)
+onDelete(item)
+onInfo(item)
+showActions boolean
}
class MediaItem {
+id string
+key string
+label string
+description string
+url string
+category string
+type "image|video|audio"
+size number
+usageCount number
+createdAt string
+updatedAt string
}
MediaCard --> MediaItem : "renders"
```

**Diagram sources**
- [media-card.tsx:32-295](file://src/components/media-card.tsx#L32-L295)

**Section sources**
- [media-card.tsx:1-295](file://src/components/media-card.tsx#L1-L295)

### Preview Modal Functionality
MediaPreviewModal enables:
- Full preview for images, videos, and audio
- Editable metadata (name, description, category)
- Reference inspection and usage locations
- Safe deletion with confirmation and in-use handling

```mermaid
sequenceDiagram
participant User as "User"
participant Card as "MediaCard"
participant Modal as "MediaPreviewModal"
participant RefAPI as "Check References API"
participant DB as "Prisma DB"
User->>Card : "Click Info"
Card->>Modal : "Open with MediaItem"
Modal->>RefAPI : "POST /api/admin/media/check-references"
RefAPI->>DB : "findMediaReferences(url)"
DB-->>RefAPI : "references[]"
RefAPI-->>Modal : "references, usageCount"
Modal-->>User : "Display metadata and references"
User->>Modal : "Save changes"
Modal->>DB : "Update siteImage"
User->>Modal : "Delete file"
Modal->>DB : "Update references and remove file"
```

**Diagram sources**
- [media-preview-modal.tsx:97-516](file://src/components/media-preview-modal.tsx#L97-L516)
- [route.ts:37-86](file://src/app/api/admin/media/check-references/route.ts#L37-L86)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

**Section sources**
- [media-preview-modal.tsx:1-516](file://src/components/media-preview-modal.tsx#L1-L516)
- [route.ts:1-86](file://src/app/api/admin/media/check-references/route.ts#L1-L86)
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

### Upload Endpoint Handling
The upload endpoint performs:
- Authentication check
- MIME type validation and size limits (environment-aware)
- File signature validation (magic bytes for images, flexible for videos/audio)
- Duplicate detection via normalized filename comparison
- Cloudinary production uploads with public ID reuse for replacements
- Local development file system storage
- Database record creation/update and cleanup of old files

```mermaid
flowchart TD
Req["POST /api/upload"] --> Auth["Check admin auth"]
Auth --> Parse["Parse multipart/form-data"]
Parse --> Validate["Validate MIME and size"]
Validate --> Signature["Validate file signature"]
Signature --> DupCheck{"Skip duplicate check?"}
DupCheck --> |No| FindDup["Find similar normalized filenames"]
FindDup --> HasDup{"Duplicates found?"}
HasDup --> |Yes| Suggest["Return duplicate suggestions"]
HasDup --> |No| Upload["Upload to Cloudinary or FS"]
DupCheck --> |Yes| Upload
Upload --> Store["Create/Update siteImage record"]
Store --> Cleanup{"Old file exists?"}
Cleanup --> |Yes| RemoveOld["Remove old file (Cloudinary/FS)"]
Cleanup --> |No| Done["Done"]
RemoveOld --> Done
```

**Diagram sources**
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)

**Section sources**
- [route.ts:1-452](file://src/app/api/upload/route.ts#L1-L452)

### Reference Tracking Mechanisms
Reference tracking scans platform configuration, news, carousel slides, legal pages, and about pages for media URLs. It supports:
- Extracting media from EditorJS blocks
- Finding all references to a given URL
- Updating references when replacing or deleting files
- Generating edit URLs for each reference

```mermaid
flowchart TD
Start(["Find references for URL"]) --> ScanConfigs["Scan PlatformConfig"]
ScanConfigs --> ScanNews["Scan News (imageUrl and EditorJS blocks)"]
ScanNews --> ScanCarousel["Scan CarouselSlide"]
ScanCarousel --> ScanLegal["Scan LegalPage (EditorJS blocks)"]
ScanLegal --> ScanAbout["Scan AboutPage"]
ScanAbout --> Collect["Collect references with table, id, field, displayName, editUrl"]
Collect --> Return["Return references[] and usageCount"]
```

**Diagram sources**
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

**Section sources**
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

### External Media Registration
ExternalMediaForm allows registering external URLs:
- URL validation and type inference
- Automatic filename extraction
- Unique key generation
- Prevents duplicate keys and URLs
- Creates records with optional description and category

```mermaid
sequenceDiagram
participant User as "User"
participant Form as "ExternalMediaForm"
participant API as "External Media API"
participant DB as "Prisma DB"
User->>Form : "Enter URL, label, category"
Form->>API : "POST /api/admin/media/external"
API->>DB : "Check unique key and URL"
DB-->>API : "OK"
API->>DB : "Create siteImage record"
DB-->>API : "Success"
API-->>Form : "Registered media"
Form-->>User : "Toast success and close"
```

**Diagram sources**
- [external-media-form.tsx:59-302](file://src/components/external-media-form.tsx#L59-L302)
- [route.ts:16-114](file://src/app/api/admin/media/external/route.ts#L16-L114)

**Section sources**
- [external-media-form.tsx:1-302](file://src/components/external-media-form.tsx#L1-L302)
- [route.ts:1-114](file://src/app/api/admin/media/external/route.ts#L1-L114)

## Dependency Analysis
- UI components depend on:
  - MediaCard for rendering
  - MediaPreviewModal for editing and reference inspection
  - ExternalMediaForm for external URL registration
  - MediaPicker/MediaPickerCompact for selection
- API endpoints depend on:
  - Prisma ORM for database operations
  - Cloudinary SDK for production uploads
  - Environment variables for configuration
- Libraries depend on:
  - MediaReferences for cross-table reference resolution

```mermaid
graph LR
MediaPicker --> MediaCard
MediaPickerCompact --> MediaCard
MediaLibraryBrowser --> MediaCard
MediaPreviewModal --> MediaCard
MediaPicker --> UploadAPI
MediaPickerCompact --> UploadAPI
MediaLibraryBrowser --> MediaAPI
MediaPreviewModal --> RefCheckAPI
ExternalMediaForm --> ExtAPI
UploadAPI --> Cloudinary
UploadAPI --> DB
MediaAPI --> DB
RefCheckAPI --> Refs
Refs --> DB
```

**Diagram sources**
- [media-picker.tsx:106-754](file://src/components/media-picker.tsx#L106-L754)
- [media-picker-compact.tsx:94-691](file://src/components/media-picker-compact.tsx#L94-L691)
- [media-library-browser.tsx:69-362](file://src/components/media-library-browser.tsx#L69-L362)
- [media-preview-modal.tsx:97-516](file://src/components/media-preview-modal.tsx#L97-L516)
- [external-media-form.tsx:59-302](file://src/components/external-media-form.tsx#L59-L302)
- [route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [route.ts:37-150](file://src/app/api/admin/media/route.ts#L37-L150)
- [route.ts:37-86](file://src/app/api/admin/media/check-references/route.ts#L37-L86)
- [route.ts:16-114](file://src/app/api/admin/media/external/route.ts#L16-L114)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

**Section sources**
- [media-picker.tsx:1-754](file://src/components/media-picker.tsx#L1-L754)
- [media-picker-compact.tsx:1-691](file://src/components/media-picker-compact.tsx#L1-L691)
- [media-library-browser.tsx:1-362](file://src/components/media-library-browser.tsx#L1-L362)
- [media-preview-modal.tsx:1-516](file://src/components/media-preview-modal.tsx#L1-L516)
- [external-media-form.tsx:1-302](file://src/components/external-media-form.tsx#L1-L302)
- [route.ts:1-452](file://src/app/api/upload/route.ts#L1-L452)
- [route.ts:1-150](file://src/app/api/admin/media/route.ts#L1-L150)
- [route.ts:1-86](file://src/app/api/admin/media/check-references/route.ts#L1-L86)
- [route.ts:1-114](file://src/app/api/admin/media/external/route.ts#L1-L114)
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

## Performance Considerations
- MediaLibraryBrowser uses infinite scroll with 50 items per page to reduce initial load.
- MediaPickerCompact optimizes by loading only the 4 most recent items for compact displays.
- Cloudinary transformations are injected efficiently to avoid redundant segments.
- Next.js Cloudinary loader generates responsive srcsets automatically.
- Duplicate detection uses normalized filenames to minimize database scans.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Upload size exceeded: Adjust maxSizeMB or use Cloudinary Console for large files.
- Invalid file type: Ensure MIME type matches allowed categories.
- Duplicate detected: Use existing file or bypass duplicate check.
- Cloudinary upload failures: Verify credentials and network connectivity.
- Reference conflicts on delete: Review usage locations and update content accordingly.

**Section sources**
- [media-picker.tsx:201-316](file://src/components/media-picker.tsx#L201-L316)
- [route.ts:170-211](file://src/app/api/upload/route.ts#L170-L211)
- [media-preview-modal.tsx:221-261](file://src/components/media-preview-modal.tsx#L221-L261)
- [route.ts:37-86](file://src/app/api/admin/media/check-references/route.ts#L37-L86)

## Conclusion
The media management system provides a robust, scalable solution for media browsing, selection, upload, and administration. It leverages Cloudinary for optimization and CDN delivery, implements intelligent duplicate detection and reference tracking, and offers flexible UI components for diverse use cases. The architecture balances performance and usability while maintaining strong data integrity and admin controls.