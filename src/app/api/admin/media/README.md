# GET /api/admin/media

API endpoint for listing media files with pagination, filtering, and usage tracking.

## Authentication

Requires admin authentication. Returns 401 if not authenticated.

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (must be >= 1) |
| `limit` | number | 50 | Items per page (1-100) |
| `category` | string | - | Filter by category (news, videos, audio, config, carousel, general) |
| `search` | string | - | Search by label (case-insensitive contains) |
| `type` | string | - | Filter by media type (image, video, audio) |

## Response Format

```json
{
  "items": [
    {
      "id": "clx123...",
      "key": "news-cover-1",
      "label": "News Cover Image",
      "description": "Cover image for news article",
      "url": "https://res.cloudinary.com/.../image.jpg",
      "category": "news",
      "type": "image",
      "usageCount": 2,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 125,
    "totalPages": 3,
    "hasMore": true
  }
}
```

## Media Type Detection

The endpoint automatically determines media type from file extension:

- **Image**: jpg, jpeg, png, gif, webp, svg, bmp, ico
- **Video**: mp4, webm, mov, avi, mkv, flv, wmv
- **Audio**: mp3, wav, ogg, aac, flac, m4a, wma

## Usage Count Calculation

For each media item, the endpoint calculates `usageCount` by scanning:

- PlatformConfig (logoUrl, faviconUrl, aboutImageUrl)
- News (imageUrl, blocks)
- CarouselSlide (imageUrl)
- LegalPage (blocks)
- AboutPage (heroImageUrl, historyImageUrl)

EditorJS blocks are parsed to find image, videoLocal, and audioLocal references.

## Error Responses

### 401 Unauthorized
```json
{
  "error": "No autorizado"
}
```

### 400 Bad Request
```json
{
  "error": "Parámetros de paginación inválidos"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error al obtener archivos multimedia"
}
```

## Examples

### Basic request
```bash
GET /api/admin/media
```

### Paginated request
```bash
GET /api/admin/media?page=2&limit=20
```

### Filter by category
```bash
GET /api/admin/media?category=news
```

### Filter by type
```bash
GET /api/admin/media?type=video
```

### Search by label
```bash
GET /api/admin/media?search=logo
```

### Combined filters
```bash
GET /api/admin/media?category=news&type=image&search=cover&page=1&limit=10
```

## Implementation Notes

- Default ordering: `updatedAt DESC` (most recently updated first)
- Type filtering is applied after database query (post-processing)
- Usage count calculation is performed asynchronously for each item
- If reference checking fails for an item, usageCount defaults to 0
- Search uses case-insensitive contains matching on the label field

## Related Files

- `src/lib/media-references.ts` - Reference tracking functions
- `src/lib/auth.ts` - Authentication helpers
- `src/lib/db.ts` - Database client
