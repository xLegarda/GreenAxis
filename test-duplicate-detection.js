/**
 * Test script for duplicate detection on upload (Task 4.3)
 * 
 * This script tests the duplicate detection functionality added to the upload endpoint.
 */

// Test the normalizeFilename function logic
function normalizeFilename(filename) {
  // Remover extensión
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // Convertir a minúsculas
  let normalized = nameWithoutExt.toLowerCase()
  
  // Remover patrones de timestamp comunes
  normalized = normalized.replace(/\d{10,13}-/g, '') // Unix timestamp con guión
  normalized = normalized.replace(/\d{4}-\d{2}-\d{2}-/g, '') // Fecha YYYY-MM-DD-
  normalized = normalized.replace(/\d{8}-/g, '') // Fecha YYYYMMDD-
  normalized = normalized.replace(/-[a-z0-9]{6,8}$/g, '') // Hash al final
  
  // Remover guiones y espacios múltiples
  normalized = normalized.replace(/[-_\s]+/g, '-')
  normalized = normalized.trim().replace(/^-+|-+$/g, '')
  
  return normalized
}

console.log('Testing normalizeFilename function:')
console.log('=====================================\n')

// Test cases
const testCases = [
  { input: 'logo.png', expected: 'logo' },
  { input: 'Logo.PNG', expected: 'logo' },
  { input: '1234567890-logo.png', expected: 'logo' },
  { input: '2024-01-15-logo.png', expected: 'logo' },
  { input: '20240115-logo.png', expected: 'logo' },
  { input: 'logo-abc123.png', expected: 'logo' },
  { input: 'my_image_file.jpg', expected: 'my-image-file' },
  { input: '1234567890-my-logo-xyz789.png', expected: 'my-logo' },
]

testCases.forEach(({ input, expected }) => {
  const result = normalizeFilename(input)
  const passed = result === expected
  console.log(`Input: "${input}"`)
  console.log(`Expected: "${expected}"`)
  console.log(`Got: "${result}"`)
  console.log(`Status: ${passed ? '✓ PASS' : '✗ FAIL'}`)
  console.log()
})

console.log('\nDuplicate Detection Flow:')
console.log('=========================\n')
console.log('1. User uploads file "1234567890-logo.png"')
console.log('2. System normalizes to "logo"')
console.log('3. System queries database for files with normalized name "logo"')
console.log('4. If matches found (excluding fixedKey), return duplicate warning')
console.log('5. User can choose to:')
console.log('   a) Select existing file from suggestions')
console.log('   b) Proceed with upload (skipDuplicateCheck=true)')
console.log('\nResponse format when duplicates found:')
console.log(JSON.stringify({
  success: false,
  duplicate: {
    exists: true,
    suggestions: [
      {
        id: 'example-id',
        label: 'logo.png',
        url: 'https://example.com/logo.png',
        category: 'config',
        key: 'config-logo'
      }
    ]
  },
  message: 'Se encontraron archivos similares en la biblioteca'
}, null, 2))
