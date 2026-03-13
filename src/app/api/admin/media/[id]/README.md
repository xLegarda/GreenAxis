# DELETE /api/admin/media/:id

Endpoint for deleting media files with reference checking and force deletion support.

## Overview

This endpoint allows administrators to delete media files from the system. It includes safety features to prevent accidental deletion of files that are in use, with an optional force mode to override this protection.

## Authentication

Requires administrator authentication via `getCurrentAdmin()`.

## Request

### Method
`DELETE`

### URL Parameters
- `id` (string, required): The SiteImage record ID to delete

### Query Parameters
- `force` (boolean, optional, default: false): Force delete even if the file is in use

### Examples

```bash
# Delete media without force (will check references)
DELETE /api/admin/media/clx123abc?force=false

# Force delete media (will delete and clear references)
DELETE /api/admin/media/clx123abc?force=true
```

## Response

### Success Response (File Deleted)

**Status Code:** 200 OK

```json
{
  "success": true,
  "deleted": true,
  "message": "Archivo eliminado correctamente"
}
```

### File In Use (Without Force)

**Status Code:** 200 OK

```json
{
  "success": false,
  "deleted": false,
  "message": "Este archivo está siendo usado en 2 lugares",
  "references": [
    {
      "table": "News",
      "id": "clx456def",
      "field": "imageUrl",
      "displayName": "News - Breaking News Article"
    },
    {
      "table": "PlatformConfig",
      "id": "clx789ghi",
      "field": "logoUrl",
      "displayName": "Platform Config - Logo"
    }
  ]
}
```

### File Not Found

**Status Code:** 404 Not Found

```json
{
  "success": false,
  "deleted": false,
  "message": "Archivo no encontrado"
}
```

### Reference Check Failed

**Status Code:** 500 Internal Server Error

```json
{
  "success": false,
  "deleted": false,
  "message": "No se pudo verificar el uso del archivo. Por seguridad, no se eliminará.",
  "error": "reference_check_failed"
}
```

### Unauthorized

**Status Code:** 401 Unauthorized

```json
{
  "error": "No autorizado"
}
```

### Internal Error

**Status Code:** 500 Internal Server Error

```json
{
  "success": false,
  "deleted": false,
  "message": "Error al eliminar archivo",
  "error": "internal_error"
}
```

## Implementation Details

### Deletion Flow

1. **Authentication Check**: Verify admin authentication
2. **Media Existence Check**: Verify the media record exists in the database
3. **Reference Check** (if not force mode):
   - Call `findMediaReferences()` to scan all database tables
   - If references found, return them without deleting
   - If reference check fails, assume file is in use (fail-safe)
4. **Storage Deletion**:
   - **Production (Cloudinary)**: Extract public_id from URL and delete
   - **Development (Filesystem)**: Delete from `/public/uploads/` directory
   - Handles missing file errors gracefully (continues with DB deletion)
5. **Database Deletion**: Remove SiteImage record
6. **Reference Cleanup** (if force mode):
   - Call `updateMediaReferences()` to clear all references
   - Sets referenced URLs to empty string

### Storage Handling

#### Cloudinary (Production)

The endpoint extracts the Cloudinary public_id from the URL and attempts deletion with multiple resource types:

1. Try as `image` (default)
2. If fails, try as `video`
3. If fails, try as `raw`

This ensures all media types (images, videos, audio) are properly deleted.

#### Filesystem (Development)

Deletes files from the `/public/uploads/` directory using Node.js `fs.unlink()`.

### Error Handling

- **Missing Files**: If a file doesn't exist in storage, the deletion continues (logs warning)
- **Cloudinary Errors**: Catches and logs errors, continues with database cleanup
- **Reference Check Failures**: Returns error and prevents deletion (fail-safe)
- **Reference Update Failures**: Logs error but doesn't fail the deletion (file already deleted)

### Safety Features

1. **Reference Tracking**: Scans all database tables before deletion
2. **Fail-Safe Mode**: If reference check fails, assumes file is in use
3. **Graceful Degradation**: Continues with DB cleanup even if storage deletion fails
4. **Force Mode Confirmation**: Requires explicit `force=true` to delete in-use files

## Related Functions

### `findMediaReferences(url: string)`
Located in `src/lib/media-references.ts`

Scans the following tables for media URL references:
- `PlatformConfig`: logoUrl, faviconUrl, aboutImageUrl
- `News`: imageUrl, blocks (EditorJS JSON)
- `CarouselSlide`: imageUrl
- `LegalPage`: blocks (EditorJS JSON)
- `AboutPage`: heroImageUrl, historyImageUrl

### `updateMediaReferences(oldUrl: string, newUrl: string)`
Located in `src/lib/media-references.ts`

Updates all references to a media URL with a new URL (typically empty string for deletions).

### `extractCloudinaryPublicId(url: string)`
Local helper function

Extracts the Cloudinary public_id from a full URL for deletion.

Example:
```
Input:  https://res.cloudinary.com/cloud/image/upload/v123/green-axis/file.jpg
Output: green-axis/file
```

### `deleteFileFromStorage(url: string)`
Local helper function

Handles deletion from either Cloudinary or local filesystem based on environment.

## Testing

### Manual Testing

1. **Test Non-Existent Media**:
   ```bash
   curl -X DELETE http://localhost:3000/api/admin/media/invalid-id
   ```
   Expected: 404 Not Found

2. **Test Media With References**:
   ```bash
   curl -X DELETE http://localhost:3000/api/admin/media/{id-with-usage}
   ```
   Expected: Returns references without deleting

3. **Test Media Without References**:
   ```bash
   curl -X DELETE http://localhost:3000/api/admin/media/{id-without-usage}
   ```
   Expected: Deletes successfully

4. **Test Force Delete**:
   ```bash
   curl -X DELETE http://localhost:3000/api/admin/media/{id-with-usage}?force=true
   ```
   Expected: Deletes and clears references

### Automated Testing

Run the test script:
```bash
node test-delete-endpoint.js
```

Note: The test script requires authentication. Update it with valid session cookies for full testing.

## Requirements Validation

This endpoint validates the following requirements from the spec:

- **Requirement 5.3**: Prevents deletion if file is in use (without force)
- **Requirement 5.4**: Force delete clears all references
- **Requirement 5.5**: Immediate deletion for unreferenced files
- **Requirement 10.3**: DELETE endpoint exists
- **Requirement 10.6**: Requires admin authentication
- **Requirement 10.7**: Returns JSON with appropriate HTTP status codes

## Security Considerations

1. **Authentication Required**: All requests must be authenticated as admin
2. **Fail-Safe Design**: Assumes file is in use if reference check fails
3. **No Direct URL Deletion**: Must use database ID, not arbitrary URLs
4. **Force Mode Protection**: Requires explicit query parameter

## Performance Considerations

- Reference checking scans multiple tables and can be slow with large databases
- Consider caching reference counts if performance becomes an issue
- Cloudinary API calls may timeout - handled gracefully

## Future Enhancements

1. Add batch deletion endpoint for multiple files
2. Implement soft delete with recovery option
3. Add audit logging for deletion operations
4. Cache reference counts to improve performance
5. Add webhook notifications for deletion events
