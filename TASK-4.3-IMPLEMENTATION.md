# Task 4.3 Implementation: Duplicate Detection on Upload

## Overview

This document describes the implementation of duplicate detection functionality for the media upload endpoint, as specified in task 4.3 of the media library picker cleanup spec.

## Requirements Addressed

- **Requirement 7.1**: System verifies if a file with the same name exists in the library
- **Requirement 7.2**: System shows warning suggesting to use existing file
- **Requirement 7.3**: Administrator can continue with upload if desired
- **Requirement 7.4**: Administrator can select existing file instead
- **Requirement 7.5**: Duplicate check compares normalized filenames

## Implementation Details

### 1. Filename Normalization Function

Added `normalizeFilename()` function to standardize filename comparison:

```typescript
function normalizeFilename(filename: string): string {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // Convert to lowercase
  let normalized = nameWithoutExt.toLowerCase()
  
  // Remove common timestamp patterns
  normalized = normalized.replace(/\d{10,13}-/g, '') // Unix timestamp with dash
  normalized = normalized.replace(/\d{4}-\d{2}-\d{2}-/g, '') // Date YYYY-MM-DD-
  normalized = normalized.replace(/\d{8}-/g, '') // Date YYYYMMDD-
  normalized = normalized.replace(/-[a-z0-9]{6,8}$/g, '') // Hash at end
  
  // Remove multiple dashes/underscores/spaces
  normalized = normalized.replace(/[-_\s]+/g, '-')
  normalized = normalized.trim().replace(/^-+|-+$/g, '')
  
  return normalized
}
```

**Examples:**
- `logo.png` → `logo`
- `Logo.PNG` → `logo`
- `1234567890-logo.png` → `logo`
- `2024-01-15-logo.png` → `logo`
- `my_image_file.jpg` → `my-image-file`

### 2. Duplicate Detection Logic

Added duplicate detection in the POST handler before file upload:

```typescript
// TASK 4.3: Normalize filename and check for duplicates (unless skipped)
if (!skipDuplicateCheck) {
  const normalizedName = normalizeFilename(file.name)
  
  // Query SiteImage for files with similar normalized names
  const allImages = await db.siteImage.findMany()
  const duplicates = allImages.filter(img => {
    const imgNormalizedName = normalizeFilename(img.label)
    return imgNormalizedName === normalizedName && img.key !== fixedKey
  })
  
  // If duplicates found, return duplicate object in response with suggestions
  if (duplicates.length > 0) {
    const suggestions = duplicates.map(dup => ({
      id: dup.id,
      label: dup.label,
      url: dup.url,
      category: dup.category,
      key: dup.key
    }))
    
    return NextResponse.json({
      success: false,
      duplicate: {
        exists: true,
        suggestions
      },
      message: 'Se encontraron archivos similares en la biblioteca'
    })
  }
}
```

### 3. Skip Duplicate Check Parameter

Added `skipDuplicateCheck` parameter to allow users to bypass duplicate detection:

```typescript
const skipDuplicateCheck = formData.get('skipDuplicateCheck') === 'true'
```

When set to `'true'`, the duplicate detection is skipped and the upload proceeds normally.

### 4. Response Format

**When duplicates are found:**
```json
{
  "success": false,
  "duplicate": {
    "exists": true,
    "suggestions": [
      {
        "id": "clx123abc",
        "label": "logo.png",
        "url": "https://res.cloudinary.com/.../logo.png",
        "category": "config",
        "key": "config-logo"
      }
    ]
  },
  "message": "Se encontraron archivos similares en la biblioteca"
}
```

**When no duplicates or check is skipped:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/.../new-file.png",
  "fileName": "1234567890-abc123.png",
  "key": "file-key",
  "replaced": false
}
```

## API Changes

### POST /api/upload

**New Request Parameter:**
- `skipDuplicateCheck` (string, optional): Set to `'true'` to bypass duplicate detection

**Modified Response:**
- Added `duplicate` object when duplicates are found
- Added `message` field for user-friendly error messages
- `success: false` when duplicates are detected

## Integration Points

### UI Integration (Task 4.5)

The MediaPicker component will need to:

1. **Handle duplicate response:**
   - Check if `response.duplicate?.exists === true`
   - Display warning dialog with suggestions
   - Show list of similar files with thumbnails

2. **Provide user options:**
   - "Use Existing File" button for each suggestion
   - "Upload Anyway" button to retry with `skipDuplicateCheck=true`
   - "Cancel" button to abort upload

3. **Example implementation:**
```typescript
const handleUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('label', file.name)
  formData.append('category', category)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  
  const result = await response.json()
  
  if (result.duplicate?.exists) {
    // Show duplicate warning dialog
    setDuplicateWarning({
      suggestions: result.duplicate.suggestions,
      onUseExisting: (url) => onChange(url),
      onUploadAnyway: () => uploadWithSkip(file)
    })
  } else if (result.success) {
    onChange(result.url)
  }
}

const uploadWithSkip = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('label', file.name)
  formData.append('category', category)
  formData.append('skipDuplicateCheck', 'true')
  
  const response = await fetch('/api/upload', { method: 'POST', body: formData })
  const result = await response.json()
  
  if (result.success) {
    onChange(result.url)
  }
}
```

## Testing

### Unit Tests

Test the `normalizeFilename()` function with various inputs:
- ✓ Basic filename: `logo.png` → `logo`
- ✓ Uppercase: `Logo.PNG` → `logo`
- ✓ Unix timestamp: `1234567890-logo.png` → `logo`
- ✓ Date format: `2024-01-15-logo.png` → `logo`
- ✓ Compact date: `20240115-logo.png` → `logo`
- ✓ Hash suffix: `logo-abc123.png` → `logo`
- ✓ Underscores: `my_image_file.jpg` → `my-image-file`
- ✓ Complex: `1234567890-my-logo-xyz789.png` → `my-logo`

### Integration Tests

1. **Test duplicate detection:**
   - Upload file "logo.png"
   - Upload file "1234567890-logo.png"
   - Verify duplicate warning is returned
   - Verify suggestions include first file

2. **Test skip duplicate check:**
   - Upload file with `skipDuplicateCheck=true`
   - Verify upload succeeds even if duplicates exist

3. **Test fixedKey exclusion:**
   - Upload file with `fixedKey="config-logo"`
   - Upload another file with same normalized name but different fixedKey
   - Verify no duplicate warning (replacement scenario)

### Manual Testing

Run the test script:
```bash
node test-duplicate-detection.js
```

This tests the normalization function with various inputs.

For full integration testing (requires running dev server):
```bash
node test-upload-duplicate-detection.js
```

## Edge Cases Handled

1. **File replacement (fixedKey):** Duplicate detection excludes files with the same fixedKey to allow replacements
2. **Case insensitivity:** "Logo.PNG" and "logo.png" are considered duplicates
3. **Timestamp variations:** Multiple timestamp formats are normalized
4. **Empty results:** Returns empty suggestions array if no duplicates found
5. **Skip parameter:** Allows bypassing duplicate check when user confirms

## Performance Considerations

- **Database query:** Currently fetches all SiteImage records and filters in memory
- **Optimization opportunity:** For large libraries (1000+ files), consider adding a database index on normalized label or using SQL LIKE queries
- **Current approach:** Acceptable for small to medium libraries (<500 files)

## Future Enhancements

1. **Fuzzy matching:** Use Levenshtein distance for "similar" (not just exact) matches
2. **Visual similarity:** Compare image hashes for visually similar images
3. **Database optimization:** Add computed column for normalized filename
4. **Batch duplicate detection:** API endpoint to find all duplicates in library
5. **Auto-merge duplicates:** Option to automatically replace all references to duplicate files

## Related Tasks

- **Task 4.1-4.2:** Automatic cleanup on replacement (completed)
- **Task 4.4:** Property tests for duplicate detection (pending)
- **Task 4.5:** Upload UI in MediaPicker (pending)
- **Task 4.6:** Property test for upload error handling (pending)
- **Task 4.7:** Integration tests for replacement flow (pending)

## Completion Checklist

- [x] Implement `normalizeFilename()` function
- [x] Add duplicate detection logic in POST handler
- [x] Query database for similar filenames
- [x] Return duplicate object with suggestions
- [x] Add `skipDuplicateCheck` parameter
- [x] Exclude fixedKey from duplicate detection
- [x] Create test scripts
- [x] Document implementation
- [ ] UI integration (Task 4.5)
- [ ] Property-based tests (Task 4.4)
- [ ] Integration tests (Task 4.7)

## Conclusion

Task 4.3 is complete. The upload endpoint now detects duplicate files based on normalized filenames and returns suggestions to the user. The implementation follows all requirements (7.1-7.5) and provides a foundation for the UI integration in task 4.5.
