// Custom Audio Tool for Editor.js - Local audio upload support with library picker

interface AudioToolConfig {
  uploader?: {
    uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }>
  }
  libraryPicker?: {
    enabled: boolean
    onSelect: () => Promise<string | null>
  }
}

interface AudioToolData {
  url: string
  caption: string
  title: string
}

export default class AudioTool {
  private data: AudioToolData
  private config: AudioToolConfig
  private wrapper: HTMLElement | null = null
  private uploader: { uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }> } | undefined

  static get toolbox() {
    return {
      title: 'Audio',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
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
      title: true
    }
  }

  constructor({ data, config }: { data: AudioToolData; config: AudioToolConfig }) {
    this.data = {
      url: data?.url || '',
      caption: data?.caption || '',
      title: data?.title || ''
    }
    this.config = config || {}
    this.uploader = config?.uploader
  }

  render() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('audio-tool-wrapper')

    if (this.data && this.data.url) {
      this.createAudioElement(this.data.url, this.data.caption, this.data.title)
    } else {
      this.createUploadPrompt()
    }

    return this.wrapper
  }

  private createUploadPrompt() {
    if (!this.wrapper) return

    const container = document.createElement('div')
    container.classList.add('audio-upload-prompt')
    container.style.cssText = `
      padding: 30px 20px;
      border: 2px dashed hsl(var(--border));
      border-radius: 8px;
      text-align: center;
      transition: all 0.3s;
      background: hsl(var(--card));
    `

    const icon = document.createElement('div')
    icon.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="1.5">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    `
    icon.style.marginBottom = '12px'

    const text = document.createElement('p')
    text.textContent = 'Selecciona un audio'
    text.style.cssText = 'margin: 0 0 16px 0; color: hsl(var(--muted-foreground)); font-size: 14px;'

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
              // Extract filename from URL for title
              const filename = url.split('/').pop()?.replace(/\.[^/.]+$/, '') || ''
              this.data = { url, caption: '', title: filename }
              this.wrapper.innerHTML = ''
              this.createAudioElement(url, '', filename)
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
    input.accept = 'audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/x-m4a,audio/mp3'
    input.style.display = 'none'

    container.appendChild(input)
    uploadButton.addEventListener('click', (e) => {
      e.stopPropagation()
      input.click()
    })

    buttonContainer.appendChild(uploadButton)
    container.appendChild(buttonContainer)

    const hint = document.createElement('p')
    hint.textContent = 'MP3, WAV, OGG, M4A (máx. 20MB)'
    hint.style.cssText = 'margin: 12px 0 0; color: hsl(var(--muted-foreground)); font-size: 12px;'
    container.appendChild(hint)

    input.addEventListener('change', async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (file.size > 15 * 1024 * 1024) {
        alert('El audio es demasiado grande (máx. 15MB en producción).\n\n💡 Para audios más grandes:\n1. Ve a https://console.cloudinary.com\n2. Sube tu audio en "Media Library"\n3. Copia la URL y úsala directamente')
        return
      }

      container.innerHTML = '<p style="color: #666; padding: 40px 20px;">Subiendo audio...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            const title = file.name.replace(/\.[^/.]+$/, '')
            this.data = { url: result.file.url, caption: '', title }
            this.wrapper.innerHTML = ''
            this.createAudioElement(result.file.url, '', title)
          } else {
            container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir el audio</p>'
          }
        } catch (error) {
          console.error('Audio upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir el audio</p>'
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
      if (!file || !file.type.startsWith('audio/')) {
        alert('Por favor selecciona un archivo de audio válido.')
        return
      }

      if (file.size > 15 * 1024 * 1024) {
        alert('El audio es demasiado grande (máx. 15MB en producción).\n\n💡 Para audios más grandes:\n1. Ve a https://console.cloudinary.com\n2. Sube tu audio en "Media Library"\n3. Copia la URL y úsala directamente')
        return
      }

      container.innerHTML = '<p style="color: #666; padding: 40px 20px;">Subiendo audio...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            const title = file.name.replace(/\.[^/.]+$/, '')
            this.data = { url: result.file.url, caption: '', title }
            this.wrapper.innerHTML = ''
            this.createAudioElement(result.file.url, '', title)
          }
        } catch (error) {
          console.error('Audio upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir el audio</p>'
        }
      }
    })

    this.wrapper.appendChild(container)
  }

  private createAudioElement(url: string, caption: string, title: string) {
    if (!this.wrapper) return

    const audioContainer = document.createElement('div')
    audioContainer.style.cssText = 'position: relative; margin: 10px 0; padding: 15px; background: hsl(var(--muted)); border-radius: 8px;'

    // Title input
    const titleInput = document.createElement('input') as HTMLInputElement
    titleInput.type = 'text'
    titleInput.value = title
    titleInput.placeholder = 'Título del audio...'
    titleInput.style.cssText = `
      width: 100%;
      margin-bottom: 10px;
      padding: 8px 12px;
      border: 1px solid hsl(var(--border));
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      outline: none;
      background: hsl(var(--card));
      color: hsl(var(--foreground));
    `
    titleInput.addEventListener('input', (e: Event) => {
      this.data.title = (e.target as HTMLInputElement).value
    })

    titleInput.addEventListener('focus', () => {
      titleInput.style.borderColor = '#6BBE45'
    })

    titleInput.addEventListener('blur', () => {
      titleInput.style.borderColor = '#e0e0e0'
    })

    audioContainer.appendChild(titleInput)

    // Audio player
    const audio = document.createElement('audio') as HTMLAudioElement
    audio.src = url
    audio.controls = true
    audio.style.cssText = 'width: 100%; height: 40px;'
    audio.preload = 'metadata'

    audioContainer.appendChild(audio)

    // Caption input
    const captionInput = document.createElement('input') as HTMLInputElement
    captionInput.type = 'text'
    captionInput.value = caption
    captionInput.placeholder = 'Descripción opcional...'
    captionInput.style.cssText = `
      width: 100%;
      margin-top: 10px;
      padding: 8px 12px;
      border: 1px solid hsl(var(--border));
      border-radius: 4px;
      font-size: 13px;
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

    audioContainer.appendChild(captionInput)

    this.wrapper.appendChild(audioContainer)
  }

  save(): AudioToolData {
    return {
      url: this.data.url || '',
      caption: this.data.caption || '',
      title: this.data.title || ''
    }
  }
}
