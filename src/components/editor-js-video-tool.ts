// Custom Video Tool for Editor.js - Local video upload support with library picker

interface VideoToolConfig {
  uploader?: {
    uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }>
  }
  libraryPicker?: {
    enabled: boolean
    onSelect: () => Promise<string | null>
  }
}

interface VideoToolData {
  url: string
  caption: string
  muted: boolean
}

export default class VideoTool {
  private data: VideoToolData
  private config: VideoToolConfig
  private wrapper: HTMLElement | null = null
  private uploader: { uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }> } | undefined

  static get toolbox() {
    return {
      title: 'Video Local',
      icon: '<svg width="10" height="10" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  // Sanitize data when saving
  static get sanitize() {
    return {
      url: false,
      caption: true,
      muted: false
    }
  }

  constructor({ data, config }: { data: VideoToolData; config: VideoToolConfig }) {
    this.data = {
      url: data?.url || '',
      caption: data?.caption || '',
      muted: data?.muted || false
    }
    this.config = config || {}
    this.uploader = config?.uploader
  }

  render() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('video-tool-wrapper')

    if (this.data && this.data.url) {
      this.createVideoElement(this.data.url, this.data.caption, this.data.muted)
    } else {
      this.createUploadPrompt()
    }

    return this.wrapper
  }

  private createUploadPrompt() {
    if (!this.wrapper) return

    const container = document.createElement('div')
    container.classList.add('video-upload-prompt')
    container.style.cssText = `
      padding: 30px 20px;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s;
      background: #f9fafb;
    `
    
    // Apply dark mode styles
    if (document.documentElement.classList.contains('dark')) {
      container.style.background = '#374151'
      container.style.borderColor = '#6b7280'
    }

    const icon = document.createElement('div')
    icon.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `
    icon.style.marginBottom = '12px'

    const text = document.createElement('p')
    text.textContent = 'Selecciona un video'
    text.style.cssText = 'margin: 0 0 16px 0; font-size: 14px;'
    text.style.color = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'

    container.appendChild(icon)
    container.appendChild(text)

    // Button container
    const buttonContainer = document.createElement('div')
    buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;'

    // Library picker button (if enabled)
    if (this.config.libraryPicker?.enabled) {
      const libraryButton = document.createElement('button')
      libraryButton.type = 'button'
      libraryButton.textContent = 'Seleccionar de la Biblioteca'
      libraryButton.style.cssText = `
        padding: 10px 20px;
        background: #6BBE45;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      `
      libraryButton.addEventListener('mouseenter', () => {
        libraryButton.style.background = '#5aa838'
      })
      libraryButton.addEventListener('mouseleave', () => {
        libraryButton.style.background = '#6BBE45'
      })
      libraryButton.addEventListener('click', async (e) => {
        e.stopPropagation()
        if (this.config.libraryPicker?.onSelect) {
          try {
            const url = await this.config.libraryPicker.onSelect()
            if (url && this.wrapper) {
              this.data = { url, caption: '', muted: false }
              this.wrapper.innerHTML = ''
              this.createVideoElement(url, '', false)
            }
          } catch (error) {
            console.error('Library picker error:', error)
          }
        }
      })
      buttonContainer.appendChild(libraryButton)
    }

    // Upload button
    const uploadButton = document.createElement('button')
    uploadButton.type = 'button'
    uploadButton.textContent = 'Subir Nuevo'
    uploadButton.style.cssText = `
      padding: 10px 20px;
      background: #005A7A;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    `
    uploadButton.addEventListener('mouseenter', () => {
      uploadButton.style.background = '#004560'
    })
    uploadButton.addEventListener('mouseleave', () => {
      uploadButton.style.background = '#005A7A'
    })

    const input = document.createElement('input') as HTMLInputElement
    input.type = 'file'
    input.accept = 'video/mp4,video/webm,video/quicktime,video/x-msvideo'
    input.style.display = 'none'

    container.appendChild(input)
    uploadButton.addEventListener('click', (e) => {
      e.stopPropagation()
      input.click()
    })

    buttonContainer.appendChild(uploadButton)
    container.appendChild(buttonContainer)

    const hint = document.createElement('p')
    hint.textContent = 'MP4, WebM, MOV (máx. 50MB)'
    hint.style.cssText = 'margin: 12px 0 0; color: hsl(var(--muted-foreground)); font-size: 12px;'
    container.appendChild(hint)

    input.addEventListener('change', async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (file.size > 50 * 1024 * 1024) {
        alert('El video es demasiado grande. El tamaño máximo es 50MB.')
        return
      }

      container.innerHTML = '<p style="color: #666; padding: 40px 20px;">Subiendo video...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            this.data = { url: result.file.url, caption: '', muted: false }
            this.wrapper.innerHTML = ''
            this.createVideoElement(result.file.url, '', false)
          } else {
            container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir el video</p>'
          }
        } catch (error) {
          console.error('Video upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir el video</p>'
        }
      }
    })

    container.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault()
      container.style.borderColor = '#6BBE45'
      container.style.backgroundColor = 'rgba(107, 190, 69, 0.05)'
    })

    container.addEventListener('dragleave', () => {
      container.style.borderColor = 'hsl(var(--border))'
      container.style.backgroundColor = 'hsl(var(--card))'
    })

    container.addEventListener('drop', async (e: DragEvent) => {
      e.preventDefault()
      container.style.borderColor = 'hsl(var(--border))'
      container.style.backgroundColor = 'hsl(var(--card))'

      const file = e.dataTransfer?.files?.[0]
      if (!file || !file.type.startsWith('video/')) {
        alert('Por favor selecciona un archivo de video válido.')
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('El video es demasiado grande. El tamaño máximo es 50MB.')
        return
      }

      container.innerHTML = '<p style="color: #666; padding: 40px 20px;">Subiendo video...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            this.data = { url: result.file.url, caption: '', muted: false }
            this.wrapper.innerHTML = ''
            this.createVideoElement(result.file.url, '', false)
          }
        } catch (error) {
          console.error('Video upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir el video</p>'
        }
      }
    })

    this.wrapper.appendChild(container)
  }

  private createVideoElement(url: string, caption: string, muted: boolean) {
    if (!this.wrapper) return

    const videoContainer = document.createElement('div')
    videoContainer.style.cssText = 'position: relative; margin: 10px 0;'

    const video = document.createElement('video') as HTMLVideoElement
    video.src = url
    video.controls = true
    video.muted = muted
    video.style.cssText = 'width: 100%; max-width: 100%; border-radius: 8px; background: #000;'
    video.preload = 'metadata'

    videoContainer.appendChild(video)

    const captionInput = document.createElement('input') as HTMLInputElement
    captionInput.type = 'text'
    captionInput.value = caption
    captionInput.placeholder = 'Agregar descripción del video...'
    captionInput.style.cssText = `
      width: 100%;
      margin-top: 10px;
      padding: 8px 12px;
      border: 1px solid hsl(var(--border));
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      background: hsl(var(--card));
      color: hsl(var(--foreground));
    `
    captionInput.addEventListener('input', (e: Event) => {
      this.data.caption = (e.target as HTMLInputElement).value
    })

    captionInput.addEventListener('focus', () => {
      captionInput.style.borderColor = '#6BBE45'
    })

    captionInput.addEventListener('blur', () => {
      captionInput.style.borderColor = '#e0e0e0'
    })

    videoContainer.appendChild(captionInput)

    this.wrapper.appendChild(videoContainer)
  }

  save(): VideoToolData {
    return {
      url: this.data.url || '',
      caption: this.data.caption || '',
      muted: this.data.muted || false
    }
  }
}
