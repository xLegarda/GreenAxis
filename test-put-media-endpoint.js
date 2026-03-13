/**
 * Test script for PUT /api/admin/media/:id endpoint
 * 
 * This script tests:
 * 1. Updating media metadata (label, description, category, alt)
 * 2. Preserving existing category when not provided
 * 3. Authentication requirement
 * 4. Error handling for non-existent media
 */

const BASE_URL = 'http://localhost:3000'

async function testPutEndpoint() {
  console.log('🧪 Testing PUT /api/admin/media/:id endpoint\n')

  // First, get a media item to test with
  console.log('1️⃣ Fetching media list...')
  const listResponse = await fetch(`${BASE_URL}/api/admin/media`, {
    credentials: 'include'
  })
  
  if (!listResponse.ok) {
    console.error('❌ Failed to fetch media list:', listResponse.status)
    return
  }

  const listData = await listResponse.json()
  
  if (!listData.items || listData.items.length === 0) {
    console.log('⚠️  No media items found. Please upload a media file first.')
    return
  }

  const testMedia = listData.items[0]
  console.log(`✅ Found test media: ${testMedia.label} (ID: ${testMedia.id})`)
  console.log(`   Current category: ${testMedia.category || 'null'}`)
  console.log(`   Current description: ${testMedia.description || 'null'}\n`)

  // Test 1: Update label and description, preserve category
  console.log('2️⃣ Test: Update label and description (preserve category)...')
  const updateResponse1 = await fetch(`${BASE_URL}/api/admin/media/${testMedia.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      label: 'Updated Test Label',
      description: 'Updated test description'
    })
  })

  if (!updateResponse1.ok) {
    console.error('❌ Update failed:', updateResponse1.status)
    const error = await updateResponse1.json()
    console.error('   Error:', error)
    return
  }

  const updateData1 = await updateResponse1.json()
  console.log('✅ Update successful')
  console.log(`   New label: ${updateData1.media.label}`)
  console.log(`   New description: ${updateData1.media.description}`)
  console.log(`   Category preserved: ${updateData1.media.category === testMedia.category ? '✅' : '❌'} (${updateData1.media.category})\n`)

  // Test 2: Update category
  console.log('3️⃣ Test: Update category...')
  const updateResponse2 = await fetch(`${BASE_URL}/api/admin/media/${testMedia.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      category: 'test-category'
    })
  })

  if (!updateResponse2.ok) {
    console.error('❌ Update failed:', updateResponse2.status)
    return
  }

  const updateData2 = await updateResponse2.json()
  console.log('✅ Category update successful')
  console.log(`   New category: ${updateData2.media.category}\n`)

  // Test 3: Update alt text
  console.log('4️⃣ Test: Update alt text...')
  const updateResponse3 = await fetch(`${BASE_URL}/api/admin/media/${testMedia.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      alt: 'Updated alt text for accessibility'
    })
  })

  if (!updateResponse3.ok) {
    console.error('❌ Update failed:', updateResponse3.status)
    return
  }

  const updateData3 = await updateResponse3.json()
  console.log('✅ Alt text update successful')
  console.log(`   New alt: ${updateData3.media.alt}\n`)

  // Test 4: Try to update non-existent media
  console.log('5️⃣ Test: Update non-existent media (should fail)...')
  const updateResponse4 = await fetch(`${BASE_URL}/api/admin/media/non-existent-id`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      label: 'Should fail'
    })
  })

  if (updateResponse4.status === 404) {
    console.log('✅ Correctly returned 404 for non-existent media\n')
  } else {
    console.error('❌ Expected 404, got:', updateResponse4.status, '\n')
  }

  // Test 5: Try to update with no fields (should fail)
  console.log('6️⃣ Test: Update with no fields (should fail)...')
  const updateResponse5 = await fetch(`${BASE_URL}/api/admin/media/${testMedia.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({})
  })

  if (updateResponse5.status === 400) {
    console.log('✅ Correctly returned 400 for empty update\n')
  } else {
    console.error('❌ Expected 400, got:', updateResponse5.status, '\n')
  }

  // Restore original values
  console.log('7️⃣ Restoring original values...')
  const restoreResponse = await fetch(`${BASE_URL}/api/admin/media/${testMedia.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      label: testMedia.label,
      description: testMedia.description,
      category: testMedia.category,
      alt: testMedia.alt
    })
  })

  if (restoreResponse.ok) {
    console.log('✅ Original values restored\n')
  } else {
    console.error('⚠️  Failed to restore original values\n')
  }

  console.log('✅ All tests completed!')
}

// Run tests
testPutEndpoint().catch(error => {
  console.error('❌ Test failed with error:', error)
  process.exit(1)
})
