/**
 * Cloudinary URL optimization utilities
 *
 * Applies automatic format, quality, and optional width transformations
 * to Cloudinary image URLs for better performance and SEO.
 */

/**
 * Checks if a URL is hosted on Cloudinary.
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com')
}

interface CloudinaryTransformOptions {
  /** Max width in pixels. E.g., 800 for thumbnails, 1200 for hero images. */
  width?: number
  /** Image quality. Defaults to 'auto'. */
  quality?: 'auto' | number
  /** Output format. Defaults to 'auto' (WebP/AVIF when browser supports it). */
  format?: 'auto' | 'webp' | 'jpg' | 'png'
}

/**
 * Injects Cloudinary transformation parameters into an image URL.
 * Handles URLs both with and without an existing transformation segment.
 *
 * @example
 * // Input:  https://res.cloudinary.com/cloud/image/upload/v123/green-axis/photo.jpg
 * // Output: https://res.cloudinary.com/cloud/image/upload/f_auto,q_auto,w_800/v123/green-axis/photo.jpg
 */
export function getCloudinaryImageUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || !isCloudinaryUrl(url)) {
    return url
  }

  const { width, quality = 'auto', format = 'auto' } = options

  // Build the transformation string
  const transforms: string[] = []
  if (format) transforms.push(`f_${format}`)
  if (quality) transforms.push(`q_${quality}`)
  if (width) transforms.push(`w_${width}`)

  const transformString = transforms.join(',')

  // Cloudinary URLs follow this pattern:
  // https://res.cloudinary.com/<cloud>/<resource_type>/upload/<optional_existing_transforms>/<version/public_id>
  // We need to insert our transforms right after "/upload/"
  const uploadSegment = '/upload/'
  const uploadIndex = url.indexOf(uploadSegment)

  if (uploadIndex === -1) {
    // Unexpected URL format, return as-is
    return url
  }

  const baseUrl = url.substring(0, uploadIndex + uploadSegment.length)
  const rest = url.substring(uploadIndex + uploadSegment.length)

  // Check if there are already transformations present (they look like "f_auto,q_auto/v123/...")
  // We detect this by checking if the first segment before the next "/" contains known transform keywords
  const firstSegmentEnd = rest.indexOf('/')
  const firstSegment = firstSegmentEnd > -1 ? rest.substring(0, firstSegmentEnd) : rest
  const hasExistingTransforms =
    firstSegment.includes('f_') ||
    firstSegment.includes('q_') ||
    firstSegment.includes('w_') ||
    firstSegment.includes('c_') ||
    firstSegment.includes('h_')

  if (hasExistingTransforms) {
    // Replace existing transforms with our optimized ones
    const remainingPath = firstSegmentEnd > -1 ? rest.substring(firstSegmentEnd) : ''
    return `${baseUrl}${transformString}${remainingPath}`
  }

  // No existing transforms, just prepend ours
  return `${baseUrl}${transformString}/${rest}`
}

// Preset helpers for common use cases

/** For hero/carousel images (full width, high quality) */
export const getHeroImageUrl = (url: string) =>
  getCloudinaryImageUrl(url, { format: 'auto', quality: 'auto', width: 1920 })

/** For news cards and grid thumbnails */
export const getThumbnailImageUrl = (url: string) =>
  getCloudinaryImageUrl(url, { format: 'auto', quality: 'auto', width: 800 })

/** For service images (medium size) */
export const getServiceImageUrl = (url: string) =>
  getCloudinaryImageUrl(url, { format: 'auto', quality: 'auto', width: 1000 })

/** For small thumbnails in admin panels */
export const getAdminThumbnailUrl = (url: string) =>
  getCloudinaryImageUrl(url, { format: 'auto', quality: 'auto', width: 400 })
