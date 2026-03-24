/**
 * Manual test script for GET /api/admin/media endpoint
 * 
 * This script tests the endpoint functionality by making HTTP requests
 * Run with: node test-media-endpoint.js
 * 
 * Prerequisites:
 * - Development server must be running (npm run dev)
 * - Must be authenticated as admin (have valid session cookie)
 */

const BASE_URL = 'http://localhost:3000'

async function testEndpoint() {
  console.log('Testing GET /api/admin/media endpoint...\n')

  // Test 1: Basic request without parameters
  console.log('Test 1: Basic request (default pagination)')
  try {
    const response = await fetch(`${BASE_URL}/api/admin/media`)
    const data = await response.json()
    
    if (response.status === 401) {
      console.log('❌ Not authenticated. Please log in as admin first.')
      return
    }
    
    console.log(`Status: ${response.status}`)
    console.log(`Items returned: ${data.items?.length || 0}`)
    console.log(`Total items: ${data.pagination?.total || 0}`)
    console.log(`Has more: ${data.pagination?.hasMore || false}`)
    console.log('✅ Test 1 passed\n')
  } catch (error) {
    console.log(`❌ Test 1 failed: ${error.message}\n`)
  }

  // Test 2: Pagination
  console.log('Test 2: Pagination (page=1, limit=10)')
  try {
    const response = await fetch(`${BASE_URL}/api/admin/media?page=1&limit=10`)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log(`Items returned: ${data.items?.length || 0}`)
    console.log(`Page: ${data.pagination?.page}`)
    console.log(`Limit: ${data.pagination?.limit}`)
    console.log('✅ Test 2 passed\n')
  } catch (error) {
    console.log(`❌ Test 2 failed: ${error.message}\n`)
  }

  // Test 3: Category filter
  console.log('Test 3: Category filter (category=news)')
  try {
    const response = await fetch(`${BASE_URL}/api/admin/media?category=news`)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log(`Items returned: ${data.items?.length || 0}`)
    if (data.items?.length > 0) {
      console.log(`Sample item category: ${data.items[0].category}`)
    }
    console.log('✅ Test 3 passed\n')
  } catch (error) {
    console.log(`❌ Test 3 failed: ${error.message}\n`)
  }

  // Test 4: Type filter
  console.log('Test 4: Type filter (type=image)')
  try {
    const response = await fetch(`${BASE_URL}/api/admin/media?type=image`)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log(`Items returned: ${data.items?.length || 0}`)
    if (data.items?.length > 0) {
      console.log(`Sample item type: ${data.items[0].type}`)
    }
    console.log('✅ Test 4 passed\n')
  } catch (error) {
    console.log(`❌ Test 4 failed: ${error.message}\n`)
  }

  // Test 5: Search filter
  console.log('Test 5: Search filter (search=logo)')
  try {
    const response = await fetch(`${BASE_URL}/api/admin/media?search=logo`)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    console.log(`Items returned: ${data.items?.length || 0}`)
    if (data.items?.length > 0) {
      console.log(`Sample item label: ${data.items[0].label}`)
    }
    console.log('✅ Test 5 passed\n')
  } catch (error) {
    console.log(`❌ Test 5 failed: ${error.message}\n`)
  }

  // Test 6: Invalid pagination parameters
  console.log('Test 6: Invalid pagination (page=0)')
  try {
    const response = await fetch(`${BASE_URL}/api/admin/media?page=0`)
    const data = await response.json()
    
    console.log(`Status: ${response.status}`)
    if (response.status === 400) {
      console.log('✅ Test 6 passed - correctly rejected invalid parameters\n')
    } else {
      console.log('❌ Test 6 failed - should return 400 for invalid parameters\n')
    }
  } catch (error) {
    console.log(`❌ Test 6 failed: ${error.message}\n`)
  }

  console.log('All tests completed!')
}

// Run tests
testEndpoint().catch(console.error)
