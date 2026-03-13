# POST /api/admin/media/check-references

## Overview

This endpoint checks where a media file is being used across the application. It scans all database tables that may contain media references and returns a comprehensive list of locations where the specified URL is referenced.

## Authentication

**Required**: Admin authentication via session cookie

Returns `401 Unauthorized` if not authenticated as admin.

## Request

### Method
`POST`

### Headers
```
Content-Type: application/json
```

### Body Parameters

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| url       | string | Yes      | The media URL to check for references |

### Example Request

```json
{
  "url": "https://res.cloudinary.com/example/image/upload/v1234567890/news-123.jpg"
}
```

## Response

### Success Response (200 OK)

```json
{
  "inUse": true,
  "references": [
    {
      "table": "News",
      "id": "clx123abc",
      "field": "imageUrl",
      "displayName": "News - Breaking News Title",
      "editUrl": "/admin/noticias/clx123abc"
    },
    {
      "table": "PlatformConfig",
      "id": "config-1",
      "field": "logoUrl",
      "displayName": "Platform Config - Logo",
      "editUrl": "/admin/configuracion"
    }
  ],
  "usageCount": 2
}
```

### Response Fields

| Field       | Type    | Description                                           |
|-------------|---------|-------------------------------------------------------|
| inUse       | boolean | Whether the file is referenced anywhere in the database |
| references  | array   | List of all references to this media file            |
| usageCount  | number  | Total number of references found                      |

### Reference Object Fields

| Field       | Type   | Description                                           |
|-------------|--------|-------------------------------------------------------|
| table       | string | Database table name where reference was found         |
| id          | string | Record ID containing the reference                    |
| field       | string | Field name containing the URL                         |
| displayName | string | Human-readable description of the reference           |
| editUrl     | string | Admin URL to edit the record containing the reference |

## Edit URL Mappings

The endpoint generates appropriate edit URLs based on the table type:

| Table          | Edit URL Pattern                    |
|----------------|-------------------------------------|
| News           | `/admin/noticias/{id}`              |
| PlatformConfig | `/admin/configuracion`              |
| CarouselSlide  | `/admin/carrusel`                   |
| LegalPage      | `/admin/paginas-legales/{id}`       |
| AboutPage      | `/admin/acerca-de`                  |
| Other          | `/admin` (fallback)                 |

## Tables Scanned

The endpoint scans the following database tables for media references:

1. **PlatformConfig**: `logoUrl`, `faviconUrl`, `aboutImageUrl`
2. **News**: `imageUrl`, `blocks` (EditorJS JSON)
3. **CarouselSlide**: `imageUrl`
4. **LegalPage**: `blocks` (EditorJS JSON)
5. **AboutPage**: `heroImageUrl`, `historyImageUrl`

### EditorJS Block Scanning

For tables with EditorJS content (`blocks` field), the endpoint parses the JSON and extracts URLs from:
- Image blocks: `data.file.url`
- Video blocks: `data.url` (type: `videoLocal`)
- Audio blocks: `data.url` (type: `audioLocal`)

## Error Responses

### 400 Bad Request

Missing or invalid URL parameter:

```json
{
  "error": "URL es requerida"
}
```

### 401 Unauthorized

Not authenticated as admin:

```json
{
  "error": "No autorizado"
}
```

### 500 Internal Server Error

Server error during reference checking:

```json
{
  "error": "Error al verificar referencias del archivo"
}
```

## Usage Examples

### Example 1: Check if media is in use before deletion

```javascript
const response = await fetch('/api/admin/media/check-references', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    url: 'https://res.cloudinary.com/example/image/upload/v1234567890/logo.png'
  }),
})

const data = await response.json()

if (data.inUse) {
  console.log(`Warning: File is used in ${data.usageCount} places:`)
  data.references.forEach(ref => {
    console.log(`- ${ref.displayName} (${ref.editUrl})`)
  })
} else {
  console.log('File is not in use, safe to delete')
}
```

### Example 2: Display usage locations in UI

```typescript
interface MediaReference {
  table: string
  id: string
  field: string
  displayName: string
  editUrl: string
}

async function checkMediaUsage(url: string): Promise<{
  inUse: boolean
  references: MediaReference[]
  usageCount: number
}> {
  const response = await fetch('/api/admin/media/check-references', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    throw new Error('Failed to check media references')
  }

  return response.json()
}

// Usage in component
const usage = await checkMediaUsage(mediaUrl)

if (usage.inUse) {
  return (
    <div>
      <p>This file is used in {usage.usageCount} places:</p>
      <ul>
        {usage.references.map(ref => (
          <li key={`${ref.table}-${ref.id}-${ref.field}`}>
            <a href={ref.editUrl}>{ref.displayName}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Implementation Details

### Reference Tracking

The endpoint uses the `findMediaReferences` function from `@/lib/media-references` which:

1. Queries all relevant database tables
2. Checks direct URL fields (e.g., `imageUrl`, `logoUrl`)
3. Parses EditorJS JSON blocks to find embedded media
4. Returns a comprehensive list of all references

### Error Handling

- **Missing files**: If Cloudinary file doesn't exist, reference check still works
- **Invalid JSON**: EditorJS blocks with invalid JSON are skipped with error logging
- **Database errors**: Errors are logged and re-thrown to return 500 response
- **Empty URLs**: Empty or whitespace-only URLs return empty reference list

### Performance Considerations

- The endpoint scans multiple tables and may be slow with large databases
- Consider caching reference counts if performance becomes an issue
- EditorJS JSON parsing is done in-memory and may be expensive for large content

## Related Endpoints

- `GET /api/admin/media` - List all media files with usage counts
- `DELETE /api/admin/media/:id` - Delete media file (uses this endpoint internally)
- `POST /api/admin/media/cleanup` - Find orphaned media files

## Requirements Validation

This endpoint validates the following requirements from the spec:

- **Requirement 10.4**: Provides endpoint for checking media references
- **Requirement 10.6**: Requires admin authentication
- **Requirement 10.7**: Returns JSON with appropriate HTTP status codes
- **Requirement 5.1**: Verifies if file is referenced in database tables
- **Requirement 5.2**: Provides information about where file is used

## Testing

To test this endpoint:

1. Ensure development server is running: `npm run dev`
2. Authenticate as admin in the browser
3. Use the test script: `node test-check-references.js`
4. Or use curl with session cookie:

```bash
curl -X POST http://localhost:3000/api/admin/media/check-references \
  -H "Content-Type: application/json" \
  -H "Cookie: session=your-session-cookie" \
  -d '{"url":"https://example.com/image.jpg"}'
```

## Notes

- The endpoint is safe to call multiple times (read-only operation)
- No data is modified by this endpoint
- The endpoint assumes the URL format matches exactly (case-sensitive)
- EditorJS block types checked: `image`, `videoLocal`, `audioLocal`
