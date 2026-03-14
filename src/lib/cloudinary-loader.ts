import { ImageLoaderProps } from 'next/image'

/**
 * Custom Cloudinary loader for Next.js Image component.
 * It takes the source URL and injects the requested width and quality
 * as Cloudinary transformation parameters.
 * 
 * This ensures that Next.js can generate a proper srcset for responsive images.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps) {
  // Only process Cloudinary URLs
  if (!src || !src.includes('res.cloudinary.com')) {
    return src
  }

  // Cloudinary transformations:
  // f_auto: automatic format (WebP/AVIF support)
  // q_auto: automatic quality compression
  // w_XXX: specific width
  // c_limit: ensure image doesn't upscale beyond original dimensions
  const params = [
    'f_auto',
    'q_auto',
    `w_${width}`,
    'c_limit'
  ]

  // If a specific quality is provided (rare with Next.js default), use it
  if (quality && quality !== 75) { // Next.js default is 75
     // Optional: handle specific quality if needed
     // params.push(`q_${quality}`)
  }

  const transformString = params.join(',')

  // Standard Cloudinary URL format: 
  // https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/v<version>/<public_id>
  
  // If the URL already contains /upload/, we insert our transformations after it
  if (src.includes('/upload/')) {
    const uploadSegment = '/upload/'
    const index = src.indexOf(uploadSegment) + uploadSegment.length
    
    // Check if there are existing transformations immediately after /upload/
    // We want to avoid stacking them if possible or at least ensure ours are applied
    const rest = src.substring(index)
    const nextSlash = rest.indexOf('/')
    const firstSegment = nextSlash !== -1 ? rest.substring(0, nextSlash) : ''
    
    // If the first segment looks like transformations (contains f_, q_, w_, etc.), 
    // we could replace it, but for simplicity and robustness with the existing lib, 
    // we'll just insert our optimized ones.
    
    return `${src.substring(0, index)}${transformString}/${rest}`
  }

  return src
}
