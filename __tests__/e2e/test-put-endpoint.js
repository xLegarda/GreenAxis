/**
 * Test script for PUT /api/admin/media/:id endpoint
 * 
 * This script tests:
 * 1. Updating media metadata (label, description, category, alt)
 * 2. Validation that at least one field is provided
 * 3. Preserving existing category if not provided
 * 4. Authentication requirement
 * 5. 404 for non-existent media
 */

const BASE_URL = 'http://localhost:3000'

// Helper function to make authenticated requests
async function authenticatedRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': process.env.AUTH_COOKIE || '',
      ...options.headers,
    },
  })
  return response
}

// Test 1: Update media label
async function testUpdateLabel() {
  console.log('\n=== Test 1: Update media label ===')
  
  // First, get a media item to update
  const listResponse = await authenticatedRequest('/api/admin/media')
  const listData = await listResponse.json()
  
  if (!listData.items || listData.items.length === 0) {
    console.log('⚠️  No media items found. Skipping test.')
    return
  }
  
  const mediaId = listData.items[0].id
  const originalLabel = listData.items[0].label
  console.log(`Testing with media ID: ${mediaId}`)
  console.log(`Original label: ${originalLabel}`)
  
  // Update the label
  const newLabel = `Updated Label ${Date.now()}`
  const response = await authenticatedRequest(`/api/admin/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify({ label: newLabel }),
  })
  
  const data = await response.json()
  
  if (response.ok && data.success && data.media.label === newLabel) {
    console.log('✅ Label updated successfully')
    console.log(`New label: ${data.media.label}`)
  } else {
    console.log('❌ Failed to update label')
    console.log('Response:', data)
  }
  
  return mediaId
}

// Test 2: Update multiple fields
async function testUpdateMultipleFields(mediaId) {
  console.log('\n=== Test 2: Update multiple fields ===')
  
  if (!mediaId) {
    console.log('⚠️  No media ID provided. Skipping test.')
    return
  }
  
  const updates = {
    label: `Multi-field Update ${Date.now()}`,
    description: 'This is a test description',
    alt: 'Test alt text',
    category: 'test'
  }
  
  const response = await authenticatedRequest(`/api/admin/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
  
  const data = await response.json()
  
  if (response.ok && data.success) {
    console.log('✅ Multiple fields updated successfully')
    console.log('Updated media:', {
      label: data.media.label,
      description: data.media.description,
      alt: data.media.alt,
      category: data.media.category
    })
  } else {
    console.log('❌ Failed to update multiple fields')
    console.log('Response:', data)
  }
}

// Test 3: Validation - no fields provided
async function testValidationNoFields(mediaId) {
  console.log('\n=== Test 3: Validation - no fields provided ===')
  
  if (!mediaId) {
    console.log('⚠️  No media ID provided. Skipping test.')
    return
  }
  
  const response = await authenticatedRequest(`/api/admin/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify({}),
  })
  
  const data = await response.json()
  
  if (response.status === 400 && !data.success) {
    console.log('✅ Validation works - rejected empty update')
    console.log('Error message:', data.message)
  } else {
    console.log('❌ Validation failed - should reject empty update')
    console.log('Response:', data)
  }
}

// Test 4: Category preservation
async function testCategoryPreservation(mediaId) {
  console.log('\n=== Test 4: Category preservation ===')
  
  if (!mediaId) {
    console.log('⚠️  No media ID provided. Skipping test.')
    return
  }
  
  // First, set a category
  await authenticatedRequest(`/api/admin/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify({ category: 'news' }),
  })
  
  // Then update label without providing category
  const response = await authenticatedRequest(`/api/admin/media/${mediaId}`, {
    method: 'PUT',
    body: JSON.stringify({ label: 'Label update without category' }),
  })
  
  const data = await response.json()
  
  if (response.ok && data.success && data.media.category === 'news') {
    console.log('✅ Category preserved when not provided')
    console.log('Category:', data.media.category)
  } else {
    console.log('❌ Category not preserved')
    console.log('Response:', data)
  }
}

// Test 5: 404 for non-existent media
async function testNotFound() {
  console.log('\n=== Test 5: 404 for non-existent media ===')
  
  const fakeId = 'nonexistent-id-12345'
  const response = await authenticatedRequest(`/api/admin/media/${fakeId}`, {
    method: 'PUT',
    body: JSON.stringify({ label: 'Test' }),
  })
  
  const data = await response.json()
  
  if (response.status === 404 && !data.success) {
    console.log('✅ Returns 404 for non-existent media')
    console.log('Error message:', data.message)
  } else {
    console.log('❌ Should return 404 for non-existent media')
    console.log('Response:', data)
  }
}

// Test 6: Authentication required
async function testAuthRequired() {
  console.log('\n=== Test 6: Authentication required ===')
  
  const response = await fetch(`${BASE_URL}/api/admin/media/test-id`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ label: 'Test' }),
  })
  
  const data = await response.json()
  
  if (response.status === 401) {
    console.log('✅ Authentication required')
    console.log('Error message:', data.error)
  } else {
    console.log('❌ Should require authentication')
    console.log('Response:', data)
  }
}

// Run all tests
async function runTests() {
  console.log('Starting PUT endpoint tests...')
  console.log('Base URL:', BASE_URL)
  
  try {
    // Test authentication first
    await testAuthRequired()
    
    // Run authenticated tests
    const mediaId = await testUpdateLabel()
    await testUpdateMultipleFields(mediaId)
    await testValidationNoFields(mediaId)
    await testCategoryPreservation(mediaId)
    await testNotFound()
    
    console.log('\n=== All tests completed ===')
  } catch (error) {
    console.error('Error running tests:', error)
  }
}

// Run tests
runTests()
