'use client'

interface UploadResult {
  secure_url: string
  public_id: string
  resource_type: string
}

export async function uploadToCloudinaryDirect(
  file: File,
  options: {
    folder?: string
    resourceType?: 'auto' | 'image' | 'video' | 'raw'
    onProgress?: (percent: number) => void
  } = {}
): Promise<UploadResult> {
  const { folder = 'green-axis', resourceType = 'auto', onProgress } = options

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Configuración de Cloudinary no disponible')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)
  formData.append('resource_type', resourceType)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText)
          resolve(result)
        } catch {
          reject(new Error('Error parsing response'))
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText)
          reject(new Error(error.error?.message || 'Upload failed'))
        } catch {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      }
    }

    xhr.onerror = () => reject(new Error('Network error'))

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
    xhr.open('POST', url)
    xhr.send(formData)
  })
}
