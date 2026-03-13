#!/usr/bin/env tsx

/**
 * Script to delete all media files from the library
 * This will delete both from database and Cloudinary storage
 */

import { db } from '../src/lib/db'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL)
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  })
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

/**
 * Extract Cloudinary public_id from URL
 */
function extractCloudinaryPublicId(url: string): string | null {
  if (!url.includes('cloudinary.com')) {
    return null
  }
  
  try {
    const parts = url.split('/')
    const uploadIndex = parts.findIndex(part => part === 'upload')
    
    if (uploadIndex === -1 || uploadIndex >= parts.length - 1) {
      return null
    }
    
    let startIndex = uploadIndex + 1
    if (parts[startIndex].startsWith('v') && !isNaN(Number(parts[startIndex].substring(1)))) {
      startIndex++
    }
    
    const publicIdParts = parts.slice(startIndex)
    const lastPart = publicIdParts[publicIdParts.length - 1]
    publicIdParts[publicIdParts.length - 1] = lastPart.split('.')[0]
    
    return publicIdParts.join('/')
  } catch (error) {
    console.error('Error extracting Cloudinary public_id:', error)
    return null
  }
}

/**
 * Delete file from Cloudinary
 */
async function deleteFromCloudinary(url: string): Promise<boolean> {
  const publicId = extractCloudinaryPublicId(url)
  
  if (!publicId) {
    console.log(`Skipping non-Cloudinary URL: ${url}`)
    return true
  }

  try {
    // Try as image first
    await cloudinary.uploader.destroy(publicId)
    console.log(`✓ Deleted from Cloudinary (image): ${publicId}`)
    return true
  } catch (error) {
    try {
      // Try as video
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
      console.log(`✓ Deleted from Cloudinary (video): ${publicId}`)
      return true
    } catch (videoError) {
      try {
        // Try as raw
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
        console.log(`✓ Deleted from Cloudinary (raw): ${publicId}`)
        return true
      } catch (rawError) {
        console.warn(`⚠ Failed to delete from Cloudinary: ${publicId}`)
        return false
      }
    }
  }
}

async function main() {
  try {
    console.log('🗑️  Starting media library cleanup...\n')

    // Get all media files
    const allMedia = await db.siteImage.findMany({
      select: {
        id: true,
        key: true,
        label: true,
        url: true
      }
    })

    console.log(`Found ${allMedia.length} media files to delete\n`)

    if (allMedia.length === 0) {
      console.log('✅ No media files found. Library is already empty.')
      return
    }

    let deletedFromCloudinary = 0
    let deletedFromDatabase = 0
    let errors = 0

    // Delete each file
    for (const media of allMedia) {
      console.log(`Processing: ${media.label} (${media.key})`)
      
      // Delete from Cloudinary
      const cloudinarySuccess = await deleteFromCloudinary(media.url)
      if (cloudinarySuccess) {
        deletedFromCloudinary++
      } else {
        errors++
      }

      // Delete from database
      try {
        await db.siteImage.delete({
          where: { id: media.id }
        })
        console.log(`✓ Deleted from database: ${media.label}`)
        deletedFromDatabase++
      } catch (dbError) {
        console.error(`✗ Failed to delete from database: ${media.label}`, dbError)
        errors++
      }

      console.log('') // Empty line for readability
    }

    // Summary
    console.log('📊 Cleanup Summary:')
    console.log(`   • Files deleted from Cloudinary: ${deletedFromCloudinary}`)
    console.log(`   • Files deleted from database: ${deletedFromDatabase}`)
    console.log(`   • Errors: ${errors}`)
    
    if (errors === 0) {
      console.log('\n✅ All media files deleted successfully!')
    } else {
      console.log(`\n⚠️  Completed with ${errors} errors. Check logs above.`)
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

main()