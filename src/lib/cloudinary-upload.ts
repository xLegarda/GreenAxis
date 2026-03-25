'use client'

interface UploadOptions {
  folder?: string
  resourceType?: 'auto' | 'image' | 'video' | 'raw'
}

let scriptLoaded = false
let scriptPromise: Promise<void> | null = null
let currentWidget: any = null

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
    script.onerror = () => {
      scriptLoaded = false
      scriptPromise = null
      reject(new Error('Error cargando Cloudinary widget'))
    }
    document.head.appendChild(script)
  })

  return scriptPromise
}

export async function openCloudinaryUpload(options: UploadOptions = {}): Promise<string | null> {
  const { folder = 'green-axis', resourceType = 'auto' } = options

  try {
    await loadWidgetScript()
  } catch {
    console.error('No se pudo cargar el widget de Cloudinary')
    return null
  }

  try {
    const configRes = await fetch('/api/upload/widget-config')
    if (!configRes.ok) return null
    const { cloudName, apiKey } = await configRes.json()
  } catch {
    console.error('Error al obtener configuración del widget')
    return null
  }

  const { cloudName, apiKey } = await (await fetch('/api/upload/widget-config')).json()

  return new Promise((resolve) => {
    const cloudinary = (window as any).cloudinary

    if (currentWidget) {
      try {
        currentWidget.close()
      } catch {}
      currentWidget = null
    }

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
            .catch(() => {})
        },
        uploadSignatureTimestamp: Math.round(Date.now() / 1000),
        resourceType,
        folder,
        sources: ['local'],
        multiple: false,
        showCompletedButton: false,
        showUploadMoreButton: false,
        showAdvancedOptions: false,
        showInsecureUploadPlaceholder: false,
        cropping: false,
        showSkipCropButton: false,
        styles: {
          palette: {
            window: '#1e293b',
            windowBorder: '#475569',
            tabIcon: '#22c55e',
            menuIcons: '#cbd5e1',
            textDark: '#f8fafc',
            textLight: '#f8fafc',
            link: '#22c55e',
            action: '#22c55e',
            inactiveTabIcon: '#94a3b8',
            error: '#ef4444',
            inProgress: '#22c55e',
            complete: '#22c55e',
            sourceBg: '#0f172a',
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
              active: true,
            },
          },
        },
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
          currentWidget = null
          resolve(null)
        }
      }
    )

    currentWidget = widget
    widget.open()
  })
}
