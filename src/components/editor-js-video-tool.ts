// Custom Video Tool for Editor.js - Local video upload support

interface VideoToolConfig {
  uploader?: {
    uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }>
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
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
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
      padding: 40px 20px;
      border: 2px dashed #ccc;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
    `

    const icon = document.createElement('div')
    icon.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    `
    icon.style.marginBottom = '12px'

    const text = document.createElement('p')
    text.textContent = 'Haz clic para subir un video'
    text.style.cssText = 'margin: 0; color: #666; font-size: 14px;'

    const hint = document.createElement('p')
    hint.textContent = 'MP4, WebM, MOV (máx. 50MB)'
    hint.style.cssText = 'margin: 8px 0 0; color: #999; font-size: 12px;'

    container.appendChild(icon)
    container.appendChild(text)
    container.appendChild(hint)

    const input = document.createElement('input') as HTMLInputElement
    input.type = 'file'
    input.accept = 'video/mp4,video/webm,video/quicktime,video/x-msvideo'
    input.style.display = 'none'

    container.appendChild(input)

    container.addEventListener('click', () => input.click())

    input.addEventListener('change', async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (file.size > 50 * 1024 * 1024) {
        alert('El video es demasiado grande. El tamaño máximo es 50MB.')
        return
      }

      container.innerHTML = '<p style="color: #666;">Subiendo video...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            this.data = { url: result.file.url, caption: '', muted: false }
            this.wrapper.innerHTML = ''
            this.createVideoElement(result.file.url, '', false)
          } else {
            container.innerHTML = '<p style="color: #d32f2f;">Error al subir el video</p>'
          }
        } catch (error) {
          console.error('Video upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f;">Error al subir el video</p>'
        }
      }
    })

    container.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault()
      container.style.borderColor = '#6BBE45'
      container.style.backgroundColor = 'rgba(107, 190, 69, 0.05)'
    })

    container.addEventListener('dragleave', () => {
      container.style.borderColor = '#ccc'
      container.style.backgroundColor = 'transparent'
    })

    container.addEventListener('drop', async (e: DragEvent) => {
      e.preventDefault()
      container.style.borderColor = '#ccc'
      container.style.backgroundColor = 'transparent'

      const file = e.dataTransfer?.files?.[0]
      if (!file || !file.type.startsWith('video/')) {
        alert('Por favor selecciona un archivo de video válido.')
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        alert('El video es demasiado grande. El tamaño máximo es 50MB.')
        return
      }

      container.innerHTML = '<p style="color: #666;">Subiendo video...</p>'

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
          container.innerHTML = '<p style="color: #d32f2f;">Error al subir el video</p>'
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
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
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
