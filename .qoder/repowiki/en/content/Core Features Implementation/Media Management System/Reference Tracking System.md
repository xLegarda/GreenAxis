# Reference Tracking System

<cite>
**Referenced Files in This Document**
- [media-references.ts](file://src/lib/media-references.ts)
- [check-references/route.ts](file://src/app/api/admin/media/check-references/route.ts)
- [media/route.ts](file://src/app/api/admin/media/route.ts)
- [media/[id]/route.ts](file://src/app/api/admin/media/[id]/route.ts)
- [upload/route.ts](file://src/app/api/upload/route.ts)
- [external/route.ts](file://src/app/api/admin/media/external/route.ts)
- [schema.prisma](file://prisma/schema.prisma)
- [media-library-browser.tsx](file://src/components/media-library-browser.tsx)
- [test-check-references.js](file://test-check-references.js)
- [test-duplicate-detection.js](file://test-duplicate-detection.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Media Reference Management](#media-reference-management)
5. [Duplicate Detection System](#duplicate-detection-system)
6. [Reference Validation and Cleanup](#reference-validation-and-cleanup)
7. [API Endpoints](#api-endpoints)
8. [Usage Tracking Across Content Types](#usage-tracking-across-content-types)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction

The Reference Tracking System is a comprehensive media management solution designed to track and manage references to media files across various content types in the Green Axis platform. This system ensures media integrity by preventing orphaned references, detecting duplicate usage, and maintaining accurate reference counts for all media assets.

The system operates through three primary mechanisms: reference tracking, duplicate detection, and lifecycle management. It integrates seamlessly with the content management system to automatically detect media usage in news articles, services, carousel slides, legal pages, and platform configurations.

## System Architecture

The Reference Tracking System follows a modular architecture with clear separation of concerns:

```mermaid
graph TB
subgraph "Client Layer"
UI[Media Library Browser]
Admin[Admin Interface]
end
subgraph "API Layer"
CheckRef[Check References API]
MediaAPI[Media Management API]
UploadAPI[Upload API]
ExternalAPI[External Media API]
end
subgraph "Core Logic"
MediaRef[Media References Utility]
DuplicateDetect[Duplicate Detection]
Validation[Reference Validation]
end
subgraph "Data Layer"
SiteImage[(SiteImage Table)]
PlatformConfig[(PlatformConfig Table)]
News[(News Table)]
Carousel[(CarouselSlide Table)]
Legal[(LegalPage Table)]
About[(AboutPage Table)]
end
UI --> MediaAPI
Admin --> CheckRef
CheckRef --> MediaRef
MediaAPI --> MediaRef
UploadAPI --> DuplicateDetect
MediaRef --> SiteImage
MediaRef --> PlatformConfig
MediaRef --> News
MediaRef --> Carousel
MediaRef --> Legal
MediaRef --> About
```

**Diagram sources**
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)
- [check-references/route.ts:1-86](file://src/app/api/admin/media/check-references/route.ts#L1-L86)
- [media/route.ts:1-150](file://src/app/api/admin/media/route.ts#L1-L150)

## Core Components

### Media References Utility

The core of the reference tracking system is the `media-references.ts` utility module, which provides essential functions for media reference management.

```mermaid
classDiagram
class MediaReference {
+string table
+string id
+string field
+string displayName
+string url
}
class MediaReferencesUtility {
+extractMediaFromEditorJS(blocks : string) string[]
+findMediaReferences(url : string) Promise~MediaReference[]~
+updateMediaReferences(oldUrl : string, newUrl : string) Promise~void~
}
class DatabaseScanners {
+scanPlatformConfig(url : string) Promise~MediaReference[]~
+scanNews(url : string) Promise~MediaReference[]~
+scanCarouselSlides(url : string) Promise~MediaReference[]~
+scanLegalPages(url : string) Promise~MediaReference[]~
+scanAboutPages(url : string) Promise~MediaReference[]~
}
MediaReferencesUtility --> MediaReference : "creates"
MediaReferencesUtility --> DatabaseScanners : "uses"
```

**Diagram sources**
- [media-references.ts:6-181](file://src/lib/media-references.ts#L6-L181)

The utility provides three primary functions:

1. **MediaReference Interface**: Defines the structure for tracking media references across different content types
2. **Reference Extraction**: Parses EditorJS blocks to identify embedded media URLs
3. **Reference Management**: Handles both discovery and updates of media references

**Section sources**
- [media-references.ts:1-334](file://src/lib/media-references.ts#L1-L334)

### Database Schema Integration

The system integrates with the Prisma schema through the SiteImage model, which serves as the central repository for all media assets:

```mermaid
erDiagram
SITEIMAGE {
string id PK
string key UK
string label
string description
string url
string alt
string category
string hash
datetime createdAt
datetime updatedAt
}
PLATFORMCONFIG {
string id PK
string logoUrl
string faviconUrl
string aboutImageUrl
}
NEWS {
string id PK
string title
string slug UK
string imageUrl
string blocks
}
CAROUSELSLIDE {
string id PK
string title
string imageUrl
}
LEGALPAGE {
string id PK
string slug UK
string blocks
}
ABOUTPAGE {
string id PK
string heroImageUrl
string historyImageUrl
}
SITEIMAGE ||--o{ PLATFORMCONFIG : "referenced_by"
SITEIMAGE ||--o{ NEWS : "referenced_by"
SITEIMAGE ||--o{ CAROUSELSLIDE : "referenced_by"
SITEIMAGE ||--o{ LEGALPAGE : "referenced_by"
SITEIMAGE ||--o{ ABOUTPAGE : "referenced_by"
```

**Diagram sources**
- [schema.prisma:121-135](file://prisma/schema.prisma#L121-L135)
- [schema.prisma:16-78](file://prisma/schema.prisma#L16-L78)
- [schema.prisma:99-118](file://prisma/schema.prisma#L99-L118)
- [schema.prisma:138-158](file://prisma/schema.prisma#L138-L158)
- [schema.prisma:161-170](file://prisma/schema.prisma#L161-L170)
- [schema.prisma:225-276](file://prisma/schema.prisma#L225-L276)

**Section sources**
- [schema.prisma:1-277](file://prisma/schema.prisma#L1-L277)

## Media Reference Management

### Reference Discovery Algorithm

The system employs a comprehensive scanning algorithm to discover media references across all supported content types:

```mermaid
flowchart TD
Start([Start Reference Search]) --> ValidateURL["Validate URL Parameter"]
ValidateURL --> URLValid{"URL Valid?"}
URLValid --> |No| ReturnEmpty["Return Empty Array"]
URLValid --> |Yes| ScanPlatform["Scan PlatformConfig"]
ScanPlatform --> ScanNews["Scan News Articles"]
ScanNews --> ScanCarousel["Scan Carousel Slides"]
ScanCarousel --> ScanLegal["Scan Legal Pages"]
ScanLegal --> ScanAbout["Scan About Pages"]
ScanAbout --> ParseBlocks["Parse EditorJS Blocks"]
ParseBlocks --> ExtractImages["Extract Image URLs"]
ExtractImages --> CompareURLs["Compare with Target URL"]
CompareURLs --> AddReference["Add to References Array"]
AddReference --> CheckMore{"More Content Types?"}
CheckMore --> |Yes| ParseBlocks
CheckMore --> |No| ReturnResults["Return All References"]
ReturnEmpty --> End([End])
ReturnResults --> End
```

**Diagram sources**
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

The algorithm systematically scans each content type, extracting media URLs from both direct field references and embedded EditorJS blocks. This ensures comprehensive coverage of all media usage scenarios.

**Section sources**
- [media-references.ts:58-181](file://src/lib/media-references.ts#L58-L181)

### Reference Update Mechanism

When media files are deleted or replaced, the system provides automatic reference updating capabilities:

```mermaid
sequenceDiagram
participant Admin as Admin Interface
participant API as Media API
participant Utils as Media Utils
participant DB as Database
Admin->>API : DELETE /api/admin/media/ : id
API->>Utils : findMediaReferences(url)
Utils->>DB : Scan all content tables
DB-->>Utils : References List
Utils-->>API : MediaReference[]
alt File in Use
API-->>Admin : Return References (Block Deletion)
else Force Delete
API->>Utils : updateMediaReferences(oldUrl, "")
Utils->>DB : Update PlatformConfig
Utils->>DB : Update News Blocks
Utils->>DB : Update Carousel Slides
Utils->>DB : Update Legal Pages
Utils->>DB : Update About Pages
DB-->>Utils : Success/Failure
API-->>Admin : Confirm Deletion
end
```

**Diagram sources**
- [media/[id]/route.ts:220-L320](file://src/app/api/admin/media/[id]/route.ts#L220-L320)
- [media-references.ts:190-333](file://src/lib/media-references.ts#L190-L333)

**Section sources**
- [media/[id]/route.ts:1-L320](file://src/app/api/admin/media/[id]/route.ts#L1-L320)
- [media-references.ts:183-333](file://src/lib/media-references.ts#L183-L333)

## Duplicate Detection System

### Filename Normalization Algorithm

The duplicate detection system implements sophisticated filename normalization to identify similar media files:

```mermaid
flowchart TD
Input[Original Filename] --> RemoveExt["Remove File Extension"]
RemoveExt --> ToLower["Convert to Lowercase"]
ToLower --> RemoveTimestamps["Remove Timestamp Patterns"]
RemoveTimestamps --> RemoveDates["Remove Date Patterns"]
RemoveHashes["Remove Trailing Hash Patterns"] --> CleanSeparators["Clean Separators"]
CleanSeparators --> TrimEdges["Trim Edge Characters"]
TrimEdges --> Output[Normalized Filename]
RemoveTimestamps --> Pattern1["Pattern: \\d{10,13}-"]
RemoveDates --> Pattern2["Pattern: \\d{4}-\\d{2}-\\d{2}-"]
RemoveDates --> Pattern3["Pattern: \\d{8}-"]
RemoveHashes --> Pattern4["Pattern: -[a-z0-9]{6,8}$"]
CleanSeparators --> Pattern5["Pattern: [-_\\s]+"]
```

**Diagram sources**
- [upload/route.ts:128-148](file://src/app/api/upload/route.ts#L128-L148)

The normalization process removes common timestamp patterns, date prefixes, and random hash suffixes while preserving meaningful filename components.

**Section sources**
- [upload/route.ts:127-243](file://src/app/api/upload/route.ts#L127-L243)
- [test-duplicate-detection.js:8-26](file://test-duplicate-detection.js#L8-L26)

### Duplicate Detection Workflow

The system implements a two-tier duplicate detection approach:

1. **Pre-upload Detection**: Analyzes filenames before allowing uploads
2. **Post-upload Validation**: Cross-references with existing database records

```mermaid
flowchart TD
UploadRequest[File Upload Request] --> CheckSkip{"Skip Duplicate Check?"}
CheckSkip --> |Yes| DirectUpload[Direct Upload Process]
CheckSkip --> |No| NormalizeName["Normalize Filename"]
NormalizeName --> QueryDB["Query SiteImage Records"]
QueryDB --> CompareNames["Compare Normalized Names"]
CompareNames --> FoundDuplicates{"Duplicates Found?"}
FoundDuplicates --> |Yes| ReturnSuggestions["Return Duplicate Suggestions"]
FoundDuplicates --> |No| ProcessUpload[Process Upload]
DirectUpload --> ProcessUpload
ProcessUpload --> StoreRecord[Store in SiteImage Table]
StoreRecord --> Complete[Upload Complete]
ReturnSuggestions --> Complete
```

**Diagram sources**
- [upload/route.ts:214-243](file://src/app/api/upload/route.ts#L214-L243)

**Section sources**
- [upload/route.ts:150-392](file://src/app/api/upload/route.ts#L150-L392)
- [test-duplicate-detection.js:53-79](file://test-duplicate-detection.js#L53-L79)

## Reference Validation and Cleanup

### Reference Validation Process

The system implements comprehensive validation to ensure media integrity:

```mermaid
sequenceDiagram
participant Client as Client Application
participant API as Check References API
participant Utils as Media Utils
participant DB as Database
Client->>API : POST /api/admin/media/check-references
API->>API : Validate Authentication
API->>API : Parse Request Body
API->>Utils : findMediaReferences(url)
Utils->>DB : Query PlatformConfig
DB-->>Utils : Config Records
Utils->>DB : Query News
DB-->>Utils : News Records
Utils->>DB : Query CarouselSlides
DB-->>Utils : Carousel Records
Utils->>DB : Query LegalPages
DB-->>Utils : Legal Records
Utils->>DB : Query AboutPages
DB-->>Utils : About Records
Utils-->>API : MediaReference[]
API->>API : Generate Edit URLs
API-->>Client : Validation Results
```

**Diagram sources**
- [check-references/route.ts:37-86](file://src/app/api/admin/media/check-references/route.ts#L37-L86)
- [media-references.ts:65-181](file://src/lib/media-references.ts#L65-L181)

### Orphaned Media Cleanup

The system provides mechanisms for identifying and cleaning up orphaned media references:

1. **Usage Count Calculation**: Tracks total references across all content types
2. **Reference Mapping**: Creates human-readable edit URLs for each reference
3. **Safety Checks**: Prevents accidental deletion of referenced media

**Section sources**
- [check-references/route.ts:25-86](file://src/app/api/admin/media/check-references/route.ts#L25-L86)
- [media-references.ts:58-181](file://src/lib/media-references.ts#L58-L181)

## API Endpoints

### Media Reference Checking Endpoint

The `/api/admin/media/check-references` endpoint provides comprehensive media reference validation:

**Endpoint**: `POST /api/admin/media/check-references`

**Request Body**:
```json
{
  "url": "string (required)"
}
```

**Response Structure**:
```json
{
  "inUse": "boolean",
  "references": [
    {
      "table": "string",
      "id": "string",
      "field": "string",
      "displayName": "string",
      "editUrl": "string"
    }
  ],
  "usageCount": "number"
}
```

**Section sources**
- [check-references/route.ts:25-86](file://src/app/api/admin/media/check-references/route.ts#L25-L86)

### Media Management Endpoint

The `/api/admin/media` endpoint provides comprehensive media library management with reference tracking:

**Endpoint**: `GET /api/admin/media`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50, max: 100)
- `category`: Filter by category
- `search`: Search by label
- `type`: Filter by type (image/video/audio)

**Response Structure**:
```json
{
  "items": [
    {
      "id": "string",
      "key": "string",
      "label": "string",
      "description": "string",
      "url": "string",
      "category": "string",
      "type": "string",
      "usageCount": "number",
      "createdAt": "string (ISO)",
      "updatedAt": "string (ISO)"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number",
    "hasMore": "boolean"
  }
}
```

**Section sources**
- [media/route.ts:27-150](file://src/app/api/admin/media/route.ts#L27-L150)

### Media Deletion Endpoint

The `/api/admin/media/[id]` endpoint handles media deletion with comprehensive reference validation:

**Endpoint**: `DELETE /api/admin/media/:id?force=false`

**Query Parameters**:
- `force`: Force delete even if media is in use

**Behavior**:
- Non-force mode: Returns references if media is in use
- Force mode: Deletes media and clears all references

**Section sources**
- [media/[id]/route.ts:214-L320](file://src/app/api/admin/media/[id]/route.ts#L214-L320)

## Usage Tracking Across Content Types

### Supported Content Types

The system tracks media references across five primary content types:

1. **Platform Configuration**: Logo, favicon, and about images
2. **News Articles**: Cover images and embedded media in EditorJS blocks
3. **Carousel Slides**: Hero images for promotional content
4. **Legal Pages**: Content images in EditorJS formatted pages
5. **About Pages**: Hero and history images

### Content Type Specific Tracking

```mermaid
graph LR
subgraph "Direct Field References"
PC[PlatformConfig<br/>logoUrl, faviconUrl, aboutImageUrl]
NA[News<br/>imageUrl]
CS[CarouselSlide<br/>imageUrl]
AP[AboutPage<br/>heroImageUrl, historyImageUrl]
end
subgraph "Embedded References"
EB[EditorJS Blocks<br/>image, videoLocal, audioLocal]
end
subgraph "Reference Types"
DR[Direct References]
ER[Embedded References]
end
PC --> DR
NA --> DR
CS --> DR
AP --> DR
EB --> ER
```

**Diagram sources**
- [media-references.ts:74-174](file://src/lib/media-references.ts#L74-L174)

**Section sources**
- [media-references.ts:58-181](file://src/lib/media-references.ts#L58-L181)

## Performance Considerations

### Optimization Strategies

The system implements several performance optimizations:

1. **Lazy Loading**: Media library browser uses infinite scroll with 50-item batches
2. **Efficient Queries**: Database queries are optimized for reference scanning
3. **Caching**: Usage counts are calculated on-demand with minimal overhead
4. **Batch Operations**: Reference updates are performed in bulk operations

### Scalability Factors

- **Database Indexing**: SiteImage table benefits from unique key indexing
- **Query Optimization**: Reference scanning uses targeted queries per content type
- **Memory Management**: Large content parsing is handled efficiently
- **Network Efficiency**: API responses are optimized for client consumption

## Troubleshooting Guide

### Common Issues and Solutions

**Issue**: Reference checking fails with timeout
- **Cause**: Large database with many content types
- **Solution**: Implement pagination and optimize database queries

**Issue**: Duplicate detection not working properly
- **Cause**: Filename normalization conflicts
- **Solution**: Review normalization patterns and adjust as needed

**Issue**: Media deletion blocked unexpectedly
- **Cause**: Active references detected
- **Solution**: Review returned references and update content accordingly

**Section sources**
- [test-check-references.js:1-162](file://test-check-references.js#L1-L162)
- [media-references.ts:177-180](file://src/lib/media-references.ts#L177-L180)

### Testing and Validation

The system includes comprehensive test coverage:

- **Manual Testing Script**: Validates check-references endpoint functionality
- **Duplicate Detection Tests**: Validates filename normalization logic
- **Integration Testing**: Ensures proper coordination between components

**Section sources**
- [test-check-references.js:1-162](file://test-check-references.js#L1-L162)
- [test-duplicate-detection.js:1-79](file://test-duplicate-detection.js#L1-L79)

## Conclusion

The Reference Tracking System provides a robust foundation for media asset management in the Green Axis platform. Through comprehensive reference tracking, intelligent duplicate detection, and automated cleanup mechanisms, the system ensures media integrity while maintaining optimal performance.

Key strengths of the system include:

- **Comprehensive Coverage**: Tracks media usage across all supported content types
- **Intelligent Detection**: Uses sophisticated algorithms for duplicate identification
- **Safety Mechanisms**: Prevents accidental deletion of referenced media
- **Performance Optimization**: Implements efficient querying and caching strategies
- **Developer-Friendly**: Provides clear APIs and comprehensive error handling

The system's modular architecture allows for easy maintenance and future enhancements while ensuring reliable operation across all supported environments.