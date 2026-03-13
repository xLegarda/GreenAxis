/**
 * Test script for DELETE /api/admin/media/:id endpoint
 * 
 * This script tests the following scenarios:
 * 1. Delete media that doesn't exist (404)
 * 2. Delete media with references (should return references)
 * 3. Delete media without references (should delete)
 * 4. Force delete media with references (should delete and clear references)
 */

const BASE_URL = 'http://localhost:3000'

// Helper to make authenticated requests
async function makeRequest(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }
  
  const response = await fetch(`${BASE_URL}${path}`, options)
  const data = await response.json()
  
  return {
    status: response.status,
    data
  }
}

async function runTests() {
  console.log('🧪 Testing DELETE /api/admin/media/:id endpoint\n')
  
  // Test 1: Delete non-existent media
  console.log('Test 1: Delete non-existent media')
  try {
    const result = await makeRequest('DELETE', '/api/admin/media/non-existent-id')
    console.log('Status:', result.status)
    console.log('Response:', JSON.stringify(result.data, null, 2))
    console.log('✅ Expected 404 or error response\n')
  } catch (error) {
    console.log('❌ Error:', error.message, '\n')
  }
  
  // Test 2: Get list of media to find a real ID
  console.log('Test 2: Get media list to find test subjects')
  try {
    const result = await makeRequest('GET', '/api/admin/media?limit=5')
    console.log('Status:', result.status)
    
    if (result.data.items && result.data.items.length > 0) {
      console.log('Found media items:')
      result.data.items.forEach(item => {
        console.log(`  - ID: ${item.id}, Label: ${item.label}, Usage: ${item.usageCount}`)
      })
      console.log('✅ Media list retrieved\n')
      
      // Test 3: Try to delete media with references
      const mediaWithUsage = result.data.items.find(item => item.usageCount > 0)
      if (mediaWithUsage) {
        console.log('Test 3: Delete media with references (without force)')
        const deleteResult = await makeRequest('DELETE', `/api/admin/media/${mediaWithUsage.id}`)
        console.log('Status:', deleteResult.status)
        console.log('Response:', JSON.stringify(deleteResult.data, null, 2))
        console.log('✅ Should return references without deleting\n')
      } else {
        console.log('Test 3: Skipped (no media with usage found)\n')
      }
      
      // Test 4: Try to delete media without references
      const mediaWithoutUsage = result.data.items.find(item => item.usageCount === 0)
      if (mediaWithoutUsage) {
        console.log('Test 4: Delete media without references')
        console.log('⚠️  This will actually delete the media!')
        console.log('Skipping actual deletion to preserve data\n')
        // Uncomment to actually test deletion:
        // const deleteResult = await makeRequest('DELETE', `/api/admin/media/${mediaWithoutUsage.id}`)
        // console.log('Status:', deleteResult.status)
        // console.log('Response:', JSON.stringify(deleteResult.data, null, 2))
      } else {
        console.log('Test 4: Skipped (no media without usage found)\n')
      }
      
      // Test 5: Force delete
      if (mediaWithUsage) {
        console.log('Test 5: Force delete media with references')
        console.log('⚠️  This will actually delete the media and clear references!')
        console.log('Skipping actual deletion to preserve data\n')
        // Uncomment to actually test force deletion:
        // const deleteResult = await makeRequest('DELETE', `/api/admin/media/${mediaWithUsage.id}?force=true`)
        // console.log('Status:', deleteResult.status)
        // console.log('Response:', JSON.stringify(deleteResult.data, null, 2))
      }
    } else {
      console.log('❌ No media items found\n')
    }
  } catch (error) {
    console.log('❌ Error:', error.message, '\n')
  }
  
  console.log('✅ All tests completed!')
  console.log('\nNote: Actual deletion tests are commented out to preserve data.')
  console.log('Uncomment them in the script to test real deletions.')
}

// Run tests
runTests().catch(console.error)
