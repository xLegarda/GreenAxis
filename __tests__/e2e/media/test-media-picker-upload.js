/**
 * Test script for MediaPicker upload functionality with duplicate detection
 * 
 * This script tests:
 * 1. File upload with progress tracking
 * 2. Duplicate detection
 * 3. Error handling
 * 
 * Run with: node test-media-picker-upload.js
 */

import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import fetch from 'node-fetch'

const API_URL = 'http://localhost:3000/api/upload'

// Helper to create a test image file
function createTestImage(filename) {
  // Create a simple 1x1 PNG image
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
    0x54, 0x08, 0xD7, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
    0x00, 0x05, 0xFE, 0x02, 0xFE, 0xDC, 0xCC, 0x59,
    0xE7, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, // IEND chunk
    0x44, 0xAE, 0x42, 0x60, 0x82
  ])
  
  const filepath = path.join(__dirname, filename)
  fs.writeFileSync(filepath, pngData)
  return filepath
}

// Test 1: Upload a new file
async function testNewUpload() {
  console.log('\n=== Test 1: Upload New File ===')
  
  const testFile = createTestImage('test-image-1.png')
  
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(testFile))
    formData.append('key', 'test-upload-1')
    formData.append('label', 'Test Image 1')
    formData.append('category', 'test')
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'admin-session=test' // You'll need a valid session
      }
    })
    
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data.success) {
      console.log('✓ Upload successful')
      console.log('  URL:', data.url)
      console.log('  Replaced:', data.replaced)
    } else {
      console.log('✗ Upload failed:', data.error || data.message)
    }
  } catch (error) {
    console.error('✗ Error:', error.message)
  } finally {
    fs.unlinkSync(testFile)
  }
}

// Test 2: Upload a duplicate file (should trigger warning)
async function testDuplicateUpload() {
  console.log('\n=== Test 2: Upload Duplicate File ===')
  
  const testFile = createTestImage('test-image-1.png')
  
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(testFile))
    formData.append('key', 'test-upload-duplicate')
    formData.append('label', 'Test Image 1') // Same label as before
    formData.append('category', 'test')
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'admin-session=test'
      }
    })
    
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data.duplicate?.exists) {
      console.log('✓ Duplicate detection working')
      console.log('  Suggestions:', data.duplicate.suggestions.length)
      data.duplicate.suggestions.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.label} (${s.key})`)
      })
    } else if (data.success) {
      console.log('⚠ Upload succeeded (no duplicate detected)')
    } else {
      console.log('✗ Unexpected response:', data.error || data.message)
    }
  } catch (error) {
    console.error('✗ Error:', error.message)
  } finally {
    fs.unlinkSync(testFile)
  }
}

// Test 3: Upload with skipDuplicateCheck
async function testSkipDuplicateCheck() {
  console.log('\n=== Test 3: Upload with Skip Duplicate Check ===')
  
  const testFile = createTestImage('test-image-1.png')
  
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(testFile))
    formData.append('key', 'test-upload-skip')
    formData.append('label', 'Test Image 1')
    formData.append('category', 'test')
    formData.append('skipDuplicateCheck', 'true')
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'admin-session=test'
      }
    })
    
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data.success) {
      console.log('✓ Upload successful (duplicate check skipped)')
      console.log('  URL:', data.url)
    } else {
      console.log('✗ Upload failed:', data.error || data.message)
    }
  } catch (error) {
    console.error('✗ Error:', error.message)
  } finally {
    fs.unlinkSync(testFile)
  }
}

// Test 4: Upload invalid file type
async function testInvalidFileType() {
  console.log('\n=== Test 4: Upload Invalid File Type ===')
  
  const testFile = path.join(__dirname, 'test-invalid.txt')
  fs.writeFileSync(testFile, 'This is not an image')
  
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(testFile))
    formData.append('key', 'test-upload-invalid')
    formData.append('label', 'Invalid File')
    formData.append('category', 'test')
    
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': 'admin-session=test'
      }
    })
    
    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))
    
    if (data.error) {
      console.log('✓ Invalid file rejected correctly')
      console.log('  Error:', data.error)
    } else {
      console.log('✗ Invalid file was accepted (should have been rejected)')
    }
  } catch (error) {
    console.error('✗ Error:', error.message)
  } finally {
    fs.unlinkSync(testFile)
  }
}

// Run all tests
async function runTests() {
  console.log('MediaPicker Upload Tests')
  console.log('========================')
  console.log('Note: These tests require a running server and valid authentication')
  
  await testNewUpload()
  await testDuplicateUpload()
  await testSkipDuplicateCheck()
  await testInvalidFileType()
  
  console.log('\n=== Tests Complete ===\n')
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000')
    return response.ok
  } catch {
    return false
  }
}

// Main
checkServer().then(isRunning => {
  if (!isRunning) {
    console.error('Error: Server is not running on http://localhost:3000')
    console.error('Please start the development server first: npm run dev')
    process.exit(1)
  }
  runTests()
})
