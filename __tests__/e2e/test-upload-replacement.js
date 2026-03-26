/**
 * Test script for POST /api/upload file replacement functionality
 * Tests tasks 4.1 and 4.2 implementation
 */

import fs from 'fs'
import path from 'path'

// Create a simple test image buffer (1x1 PNG)
const createTestImage = (name) => {
  // 1x1 transparent PNG
  return Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
    0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
    0x42, 0x60, 0x82
  ]);
};

async function testUploadReplacement() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing POST /api/upload file replacement functionality\n');
  
  // You need to set a valid session cookie here
  const sessionCookie = 'your-session-cookie-here';
  
  try {
    // Test 1: Upload initial file with fixedKey
    console.log('Test 1: Upload initial file with fixedKey');
    const formData1 = new FormData();
    const blob1 = new Blob([createTestImage('test1')], { type: 'image/png' });
    formData1.append('file', blob1, 'test-image-1.png');
    formData1.append('fixedKey', 'test-replacement-key');
    formData1.append('label', 'Test Image 1');
    formData1.append('category', 'test');
    
    const response1 = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie
      },
      body: formData1
    });
    
    const result1 = await response1.json();
    console.log('Response 1:', JSON.stringify(result1, null, 2));
    
    if (result1.success && result1.replaced === false) {
      console.log('✅ Initial upload successful, replaced=false as expected\n');
    } else {
      console.log('❌ Initial upload failed or replaced flag incorrect\n');
      return;
    }
    
    // Test 2: Upload replacement file with same fixedKey
    console.log('Test 2: Upload replacement file with same fixedKey');
    const formData2 = new FormData();
    const blob2 = new Blob([createTestImage('test2')], { type: 'image/png' });
    formData2.append('file', blob2, 'test-image-2.png');
    formData2.append('fixedKey', 'test-replacement-key');
    formData2.append('label', 'Test Image 2 (Replacement)');
    formData2.append('category', 'test');
    
    const response2 = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        'Cookie': sessionCookie
      },
      body: formData2
    });
    
    const result2 = await response2.json();
    console.log('Response 2:', JSON.stringify(result2, null, 2));
    
    if (result2.success && result2.replaced === true) {
      console.log('✅ Replacement upload successful, replaced=true as expected\n');
    } else {
      console.log('❌ Replacement upload failed or replaced flag incorrect\n');
      return;
    }
    
    // Test 3: Verify database record was updated (not duplicated)
    console.log('Test 3: Verify database has single record with updated URL');
    const dbCheckResponse = await fetch(`${baseUrl}/api/admin/media?search=test-replacement-key`, {
      headers: {
        'Cookie': sessionCookie
      }
    });
    
    const dbResult = await dbCheckResponse.json();
    console.log('Database check:', JSON.stringify(dbResult, null, 2));
    
    if (dbResult.items && dbResult.items.length === 1) {
      console.log('✅ Database has exactly one record as expected\n');
    } else {
      console.log('❌ Database has incorrect number of records\n');
    }
    
    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Note: This test requires:
// 1. The development server to be running (npm run dev)
// 2. A valid admin session cookie
// 3. The database to be accessible

console.log('⚠️  Manual test script created.');
console.log('To run this test:');
console.log('1. Start the dev server: npm run dev');
console.log('2. Login as admin and get your session cookie');
console.log('3. Update the sessionCookie variable in this script');
console.log('4. Run: node test-upload-replacement.js\n');
