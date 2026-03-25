'use client'

interface CloudinaryResult {
  event: string
  info: {
    secure_url: string
    public_id: string
    resource_type: string
    format: string
    width?: number
    height?: number
    bytes: number
  }
}

interface UploadOptions {
  onProgress?: (percent: number) => void
  onSuccess?: (url: string) => void
  onError?: (error: string) => void
  folder?: string
  resourceType?: 'auto' | 'image' | 'video' | 'raw'
  maxFileSize?: number
  multiple?: boolean
}

let widgetScriptLoaded = false
let widgetScriptPromise: Promise<void> | null = null

function loadWidgetScript(): Promise<void> {
  if (widgetScriptLoaded) return Promise.resolve()
  if (widgetScriptPromise) return widgetScriptPromise

  widgetScriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'))
      return
    }

    if ((window as any).cloudinary) {
      widgetScriptLoaded = true
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => {
      widgetScriptLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error('Error loading Cloudinary widget'))
    document.head.appendChild(script)
  })

  return widgetScriptPromise
}

export async function openCloudinaryUpload(options: UploadOptions = {}): Promise<string | null> {
  const { onProgress, onSuccess, onError, folder = 'green-axis', resourceType = 'auto' } = options

  // Load script
  await loadWidgetScript()

  // Get config from backend
  const configRes = await fetch('/api/upload/widget-config')
  if (!configRes.ok) {
    onError?.('Error al obtener configuración de Cloudinary')
    return null
  }
  const { cloudName, apiKey } = await configRes.json()

  return new Promise((resolve) => {
    const cloudinary = (window as any).cloudinary

    const widget = cloudinary.createUploadWidget(
      {
        cloudName,
        apiKey,
        uploadSignature: async (callback: (signature: string) => void, paramsToSign: Record<string, any>) => {
          try {
            const signRes = await fetch('/api/upload/sign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paramsToSign),
            })
            if (signRes.ok) {
              const { signature } = await signRes.json()
              callback(signature)
            } else {
              onError?.('Error al firmar upload')
            }
          } catch {
            onError?.('Error al conectar con el servidor')
          }
        },
        uploadSignatureTimestamp: Math.round(Date.now() / 1000),
        resourceType,
        folder,
        sources: ['local', 'url'],
        multiple: false,
        showCompletedButton: false,
        showUploadMoreButton: false,
        styles: {
          palette: {
            window: '#1e1e1e',
            sourceBg: '#2d2d2d',
            windowBorder: '#6BBE45',
            tabIcon: '#6BBE45',
            inactiveTabIcon: '#888888',
            menuIcons: '#6BBE45',
            link: '#6BBE45',
            action: '#6BBE45',
            inProgress: '#6BBE45',
            complete: '#6BBE45',
            error: '#d32f2f',
            textDark: '#000000',
            textLight: '#ffffff',
          },
        },
      },
      (error: any, result: CloudinaryResult) => {
        if (error) {
          console.error('Cloudinary widget error:', error)
          onError?.(error.statusText || 'Error al subir archivo')
          resolve(null)
          return
        }

        if (result && result.event === 'success') {
          const url = result.info.secure_url
          onSuccess?.(url)
          resolve(url)
        }

        if (result && result.event === 'close') {
          resolve(null)
        }
      }
    )

    widget.open()
  })
}

export async function uploadFileToCloudinary(file: File, folder = 'green-axis'): Promise<string | null> {
  await loadWidgetScript()

  const configRes = await fetch('/api/upload/widget-config')
  if (!configRes.ok) return null
  const { cloudName, apiKey } = await configRes.json()

  return new Promise((resolve) => {
    const cloudinary = (window as any).cloudinary

    const widget = cloudinary.createUploadWidget(
      {
        cloudName,
        apiKey,
        uploadSignature: async (callback: (signature: string) => void, paramsToSign: Record<string, any>) => {
          try {
            const signRes = await fetch('/api/upload/sign', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(paramsToSign),
            })
            if (signRes.ok) {
              const { signature } = await signRes.json()
              callback(signature)
            }
          } catch {
            resolve(null)
          }
        },
        uploadSignatureTimestamp: Math.round(Date.now() / 1000),
        resourceType: 'auto',
        folder,
        sources: ['local'],
        multiple: false,
        showCompletedButton: false,
        showUploadMoreButton: false,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov', 'mp3', 'wav', 'ogg', 'm4a'],
      },
      (error: any, result: CloudinaryResult) => {
        if (error) {
          console.error('Cloudinary widget error:', error)
          resolve(null)
          return
        }
        if (result && result.event === 'success') {
          resolve(result.info.secure_url)
        }
        if (result && result.event === 'close') {
          resolve(null)
        }
      }
    )

    widget.open()
  })
}
