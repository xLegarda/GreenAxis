# Task 1.10 Implementation: PUT /api/admin/media/:id Endpoint

## Summary

Successfully implemented the PUT endpoint for updating media metadata at `/api/admin/media/:id`.

## Implementation Details

### Endpoint: PUT /api/admin/media/:id

**Location**: `src/app/api/admin/media/[id]/route.ts`

**Authentication**: Requires admin authentication via `getCurrentAdmin()`

**Request Body** (all fields optional, but at least one required):
```typescript
{
  label?: string        // New label/name for the media
  description?: string  // New description
  category?: string     // New category
  alt?: string         // New alt text
}
```

**Response** (Success - 200):
```typescript
{
  success: true,
  media: {
    id: string
    key: string
    label: string
    description: string | null
    url: string
    alt: string | null
    category: string | null
    createdAt: string
    updatedAt: string
  }
}
```

**Response** (Error - 400):
```typescript
{
  success: false,
  message: "Debe proporcionar al menos un campo para actualizar"
}
```

**Response** (Error - 404):
```typescript
{
  success: false,
  message: "Archivo no encontrado"
}
```

**Response** (Error - 401):
```typescript
{
  error: "No autorizado"
}
```

**Response** (Error - 500):
```typescript
{
  success: false,
  message: "Error al actualizar archivo",
  error: "internal_error"
}
```

## Key Features Implemented

### 1. Field Validation
- Validates that at least one field is being updated
- Returns 400 error if no fields provided

### 2. Category Preservation (Requirement 8.7)
- If category is not provided in the update, the existing category is preserved
- If category is provided as empty string or null, it uses the existing category
- This ensures categories are maintained unless explicitly changed

### 3. Selective Updates
- Only updates fields that are provided in the request body
- Preserves existing values for fields not included in the request
- Always updates the `updatedAt` timestamp

### 4. Authentication (Requirement 10.6)
- Requires admin authentication
- Returns 401 if not authenticated

### 5. Error Handling
- Returns 404 if media ID doesn't exist
- Returns 400 if no fields to update
- Returns 500 for internal errors
- All error messages in Spanish (Requirement 10.7)

### 6. JSON Response Format (Requirement 10.7)
- All responses are valid JSON
- Appropriate HTTP status codes (2xx for success, 4xx for client errors, 5xx for server errors)

## Code Implementation

The implementation includes:

1. **Authentication Check**: Uses `getCurrentAdmin()` to verify admin access
2. **Request Body Parsing**: Extracts label, description, category, and alt from request body
3. **Validation**: Ensures at least one field is provided for update
4. **Existence Check**: Verifies the media record exists in the database
5. **Update Data Building**: Constructs update object with only provided fields
6. **Category Preservation Logic**: Preserves existing category if not provided
7. **Database Update**: Updates the SiteImage record with new metadata
8. **Response**: Returns updated media object

## Testing

### Manual Testing Steps

1. **Test Update Label**:
   ```bash
   curl -X PUT http://localhost:3000/api/admin/media/{id} \
     -H "Content-Type: application/json" \
     -H "Cookie: {auth-cookie}" \
     -d '{"label": "New Label"}'
   ```

2. **Test Update Multiple Fields**:
   ```bash
   curl -X PUT http://localhost:3000/api/admin/media/{id} \
     -H "Content-Type: application/json" \
     -H "Cookie: {auth-cookie}" \
     -d '{"label": "New Label", "description": "New description", "alt": "New alt text"}'
   ```

3. **Test Category Preservation**:
   ```bash
   # First set a category
   curl -X PUT http://localhost:3000/api/admin/media/{id} \
     -H "Content-Type: application/json" \
     -H "Cookie: {auth-cookie}" \
     -d '{"category": "news"}'
   
   # Then update label without category - should preserve "news"
   curl -X PUT http://localhost:3000/api/admin/media/{id} \
     -H "Content-Type: application/json" \
     -H "Cookie: {auth-cookie}" \
     -d '{"label": "Updated Label"}'
   ```

4. **Test Validation (No Fields)**:
   ```bash
   curl -X PUT http://localhost:3000/api/admin/media/{id} \
     -H "Content-Type: application/json" \
     -H "Cookie: {auth-cookie}" \
     -d '{}'
   # Expected: 400 error
   ```

5. **Test Not Found**:
   ```bash
   curl -X PUT http://localhost:3000/api/admin/media/nonexistent-id \
     -H "Content-Type: application/json" \
     -H "Cookie: {auth-cookie}" \
     -d '{"label": "Test"}'
   # Expected: 404 error
   ```

6. **Test Authentication**:
   ```bash
   curl -X PUT http://localhost:3000/api/admin/media/{id} \
     -H "Content-Type: application/json" \
     -d '{"label": "Test"}'
   # Expected: 401 error
   ```

### Test Script

A comprehensive test script has been created at `test-put-endpoint.js` that tests:
- Updating media label
- Updating multiple fields
- Validation (no fields provided)
- Category preservation
- 404 for non-existent media
- Authentication requirement

To run the test script:
```bash
# Set authentication cookie
export AUTH_COOKIE="your-auth-cookie-here"

# Run tests
node test-put-endpoint.js
```

## Requirements Validation

✅ **Requirement 8.7**: Category preservation - Existing category is maintained when not provided in update

✅ **Requirement 10.6**: Admin authentication - All endpoints require admin authentication

✅ **Requirement 10.7**: JSON responses with appropriate HTTP status codes
- 200 for successful updates
- 400 for validation errors
- 401 for authentication errors
- 404 for not found
- 500 for internal errors

## Files Modified

- `src/app/api/admin/media/[id]/route.ts` - Added PUT handler

## Files Created

- `test-put-endpoint.js` - Comprehensive test script for the PUT endpoint
- `TASK-1.10-IMPLEMENTATION.md` - This documentation file

## TypeScript Validation

✅ No TypeScript errors or warnings

## Next Steps

The PUT endpoint is now ready for integration with the MediaPicker component and admin forms. It can be used to:
- Update media labels from the media library UI
- Edit descriptions and alt text for accessibility
- Change categories for better organization
- Update metadata from the MediaPreviewModal component

## Notes

- The endpoint preserves existing category values when not provided, as specified in Requirement 8.7
- All error messages are in Spanish for consistency with the application
- The implementation follows the same authentication and error handling patterns as other admin endpoints
- The `updatedAt` timestamp is always updated, even if only one field changes
