/**
 * Manual test script for POST /api/admin/media/check-references endpoint
 * 
 * This script tests the check-references endpoint by:
 * 1. Finding a media URL from the database
 * 2. Calling the endpoint to check references
 * 3. Verifying the response structure
 * 
 * Run with: node test-check-references.js
 */

const BASE_URL = 'http://localhost:3000'

async function testCheckReferences() {
  console.log('🧪 Testing POST /api/admin/media/check-references endpoint\n')

  try {
    // First, get a media item to test with
    console.log('1. Fetching media items...')
    const mediaResponse = await fetch(`${BASE_URL}/api/admin/media?limit=1`, {
      credentials: 'include',
    })

    if (!mediaResponse.ok) {
      console.error('❌ Failed to fetch media items')
      console.error('Status:', mediaResponse.status)
      console.error('Response:', await mediaResponse.text())
      return
    }

    const mediaData = await mediaResponse.json()
    
    if (!mediaData.items || mediaData.items.length === 0) {
      console.log('⚠️  No media items found in database. Please add some media first.')
      return
    }

    const testUrl = mediaData.items[0].url
    console.log('✅ Found test URL:', testUrl)
    console.log('   Media item:', mediaData.items[0].label)
    console.log('')

    // Test 1: Check references for the URL
    console.log('2. Testing check-references endpoint...')
    const checkResponse = await fetch(`${BASE_URL}/api/admin/media/check-references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ url: testUrl }),
    })

    if (!checkResponse.ok) {
      console.error('❌ Check-references request failed')
      console.error('Status:', checkResponse.status)
      console.error('Response:', await checkResponse.text())
      return
    }

    const checkData = await checkResponse.json()
    console.log('✅ Response received:')
    console.log(JSON.stringify(checkData, null, 2))
    console.log('')

    // Validate response structure
    console.log('3. Validating response structure...')
    const validations = [
      { field: 'inUse', type: 'boolean', value: checkData.inUse },
      { field: 'references', type: 'array', value: checkData.references },
      { field: 'usageCount', type: 'number', value: checkData.usageCount },
    ]

    let allValid = true
    for (const validation of validations) {
      const actualType = Array.isArray(validation.value) ? 'array' : typeof validation.value
      const isValid = actualType === validation.type
      
      if (isValid) {
        console.log(`✅ ${validation.field}: ${actualType} (${validation.value})`)
      } else {
        console.log(`❌ ${validation.field}: expected ${validation.type}, got ${actualType}`)
        allValid = false
      }
    }

    // Validate references structure if any exist
    if (checkData.references && checkData.references.length > 0) {
      console.log('\n4. Validating reference structure...')
      const ref = checkData.references[0]
      const refFields = ['table', 'id', 'field', 'displayName', 'editUrl']
      
      for (const field of refFields) {
        if (ref[field] !== undefined) {
          console.log(`✅ Reference has ${field}: ${ref[field]}`)
        } else {
          console.log(`❌ Reference missing ${field}`)
          allValid = false
        }
      }
    }

    // Test 2: Invalid request (missing URL)
    console.log('\n5. Testing error handling (missing URL)...')
    const errorResponse = await fetch(`${BASE_URL}/api/admin/media/check-references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({}),
    })

    if (errorResponse.status === 400) {
      console.log('✅ Correctly returns 400 for missing URL')
    } else {
      console.log(`❌ Expected 400, got ${errorResponse.status}`)
      allValid = false
    }

    // Test 3: Non-existent URL
    console.log('\n6. Testing with non-existent URL...')
    const nonExistentResponse = await fetch(`${BASE_URL}/api/admin/media/check-references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ url: 'https://example.com/nonexistent.jpg' }),
    })

    if (nonExistentResponse.ok) {
      const nonExistentData = await nonExistentResponse.json()
      if (nonExistentData.inUse === false && nonExistentData.usageCount === 0) {
        console.log('✅ Correctly returns no references for non-existent URL')
      } else {
        console.log('❌ Unexpected response for non-existent URL')
        allValid = false
      }
    } else {
      console.log(`❌ Request failed with status ${nonExistentResponse.status}`)
      allValid = false
    }

    // Summary
    console.log('\n' + '='.repeat(50))
    if (allValid) {
      console.log('✅ All tests passed!')
    } else {
      console.log('❌ Some tests failed')
    }
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    console.error(error)
  }
}

// Run the test
testCheckReferences()
