import crypto from 'crypto'
import { v2 as cloudinary } from 'cloudinary'

interface CloudinaryConfig {
  cloud_name: string
  api_key: string
  api_secret: string
}

let _config: CloudinaryConfig | null = null

export function getCloudinaryConfig(): CloudinaryConfig {
  if (_config) return _config

  if (process.env.CLOUDINARY_URL) {
    const url = new URL(process.env.CLOUDINARY_URL)
    _config = {
      cloud_name: url.hostname,
      api_key: url.username,
      api_secret: url.password,
    }
  } else {
    _config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    }
  }

  cloudinary.config({
    cloud_name: _config.cloud_name,
    api_key: _config.api_key,
    api_secret: _config.api_secret,
    secure: true,
  })

  return _config
}

export function configureCloudinary() {
  getCloudinaryConfig()
  return cloudinary
}

export function generateCloudinarySignature(
  params: Record<string, string>,
  apiSecret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&')
  return crypto
    .createHash('sha1')
    .update(sortedParams + apiSecret)
    .digest('hex')
}

export function emptyToNull(value: string | null | undefined): string | null {
  if (value === '' || value === undefined) return null
  return value ?? null
}
