'use client'

interface UploadOptions {
  folder?: string
  resourceType?: 'auto' | 'image' | 'video' | 'raw'
}

let scriptLoaded = false
let scriptPromise: Promise<void> | null = null

function loadWidgetScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'))
    if ((window as any).cloudinary) {
      scriptLoaded = true
      return resolve()
    }

    const script = document.createElement('script')
    script.src = 'https://upload-widget.cloudinary.com/global/all.js'
    script.async = true
    script.onload = () => { scriptLoaded = true; resolve() }
    script.onerror = () => reject(new Error('Error cargando Cloudinary widget'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function openCloudinaryUpload(options: UploadOptions = {}): Promise<string | null> {
  const { folder = 'green-axis', resourceType = 'auto' } = options

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
        uploadSignature: (callback: (sig: string) => void, paramsToSign: Record<string, any>) => {
          fetch('/api/upload/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paramsToSign),
          })
            .then((r: Response) => r.json())
            .then((data: { signature: string }) => callback(data.signature))
            .catch(() => resolve(null))
        },
        uploadSignatureTimestamp: Math.round(Date.now() / 1000),
        resourceType,
        folder,
        sources: ['local'],
        multiple: false,
        showCompletedButton: false,
        showUploadMoreButton: false,
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Widget error:', error)
          resolve(null)
          return
        }
        if (result?.event === 'success') {
          resolve(result.info.secure_url)
        }
        if (result?.event === 'close') {
          resolve(null)
        }
      }
    )

    widget.open()
  })
}
