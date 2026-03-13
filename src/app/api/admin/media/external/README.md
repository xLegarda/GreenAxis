# External Media Registration API

## Overview
This endpoint allows administrators to register external media URLs (like Cloudinary files) in the media library without uploading them through the application.

## Use Case
When users upload large files directly to Cloudinary Console to bypass upload limits, they can use this endpoint to register those files in the media library so they appear in the browser and can be managed like regular uploads.

## Endpoint
`POST /api/admin/media/external`

## Authentication
Requires admin authentication via `getCurrentAdmin()`.

## Request Body
```json
{
  "key": "external-1234567890-abc123",
  "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/folder/video.mp4",
  "label": "My Important Video",
  "description": "Optional description of the video",
  "category": "videos"
}
```

### Parameters
- `key` (string, required): Unique identifier for the media file
- `url` (string, required): Valid external URL of the media file
- `label` (string, required): Display name for the media
- `description` (string, optional): Description of the media
- `category` (string, optional): Category for organization (defaults to "general")

## Response

### Success (201)
```json
{
  "success": true,
  "media": {
    "id": "clx123456789",
    "key": "external-1234567890-abc123",
    "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/folder/video.mp4",
    "label": "My Important Video",
    "description": "Optional description of the video",
    "category": "videos",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Responses

#### 400 - Bad Request
```json
{
  "error": "Los campos key, url y label son requeridos"
}
```

```json
{
  "error": "La URL proporcionada no es válida"
}
```

#### 401 - Unauthorized
```json
{
  "error": "No autorizado"
}
```

#### 409 - Conflict
```json
{
  "error": "Ya existe un archivo con esa clave"
}
```

```json
{
  "error": "Esta URL ya está registrada en la biblioteca"
}
```

#### 500 - Internal Server Error
```json
{
  "error": "Error interno del servidor"
}
```

## Validation
- URL must be a valid URL format
- Key must be unique in the database
- URL must not already exist in the database
- Label is required and cannot be empty

## Database Impact
Creates a new record in the `SiteImage` table with:
- Generated hash for external files
- All provided metadata
- Standard timestamps

## Integration
This endpoint is used by the `ExternalMediaForm` component in the media library interface, allowing users to register external files through a user-friendly form.