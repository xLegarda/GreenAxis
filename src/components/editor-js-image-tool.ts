// Custom Image Tool for Editor.js - Local image upload support with library picker

interface ImageToolConfig {
  uploader?: {
    uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }>
  }
  libraryPicker?: {
    enabled: boolean
    onSelect: () => Promise<string | null>
  }
}

interface ImageToolData {
  url: string
  caption: string
  withBorder: boolean
  withBackground: boolean
  stretched: boolean
}

export default class ImageTool {
  private data: ImageToolData
  private config: ImageToolConfig
  private wrapper: HTMLElement | null = null
  private uploader: { uploadByFile: (file: File) => Promise<{ success: number; file?: { url: string } }> } | undefined

  static get toolbox() {
    return {
      title: 'Imagen',
      icon: '<svg width="17" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
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
      withBorder: false,
      withBackground: false,
      stretched: false
    }
  }

  constructor({ data, config }: { data: ImageToolData; config: ImageToolConfig }) {
    this.data = {
      url: data?.url || '',
      caption: data?.caption || '',
      withBorder: data?.withBorder || false,
      withBackground: data?.withBackground || false,
      stretched: data?.stretched || false
    }
    this.config = config || {}
    this.uploader = config?.uploader
  }

  render() {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('image-tool-wrapper')

    if (this.data && this.data.url) {
      this.createImageElement(this.data.url, this.data.caption)
    } else {
      this.createUploadPrompt()
    }

    return this.wrapper
  }

  private createUploadPrompt() {
    if (!this.wrapper) return

    const container = document.createElement('div')
    container.classList.add('image-upload-prompt')
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
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    `
    icon.style.marginBottom = '12px'

    const text = document.createElement('p')
    text.textContent = 'Selecciona una imagen'
    text.style.cssText = 'margin: 0 0 16px 0; color: #6b7280; font-size: 14px;'
    
    // Apply dark mode styles
    if (document.documentElement.classList.contains('dark')) {
      text.style.color = '#9ca3af'
    }

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
              this.data = { url, caption: '', withBorder: false, withBackground: false, stretched: false }
              this.wrapper.innerHTML = ''
              this.createImageElement(url, '')
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
    uploadButton.textContent = 'Subir Nueva'
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
    input.accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp'
    input.style.display = 'none'

    container.appendChild(input)
    uploadButton.addEventListener('click', (e) => {
      e.stopPropagation()
      input.click()
    })

    buttonContainer.appendChild(uploadButton)
    container.appendChild(buttonContainer)

    const hint = document.createElement('p')
    hint.textContent = 'PNG, JPG, GIF, WebP, SVG (máx. 10MB)'
    hint.style.cssText = 'margin: 12px 0 0; color: #9ca3af; font-size: 12px;'
    
    // Apply dark mode styles
    if (document.documentElement.classList.contains('dark')) {
      hint.style.color = '#6b7280'
    }
    container.appendChild(hint)

    input.addEventListener('change', async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      if (file.size > 10 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 10MB.')
        return
      }

      container.innerHTML = '<p style="color: #666; padding: 40px 20px;">Subiendo imagen...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            this.data = { url: result.file.url, caption: '', withBorder: false, withBackground: false, stretched: false }
            this.wrapper.innerHTML = ''
            this.createImageElement(result.file.url, '')
          } else {
            container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir la imagen</p>'
          }
        } catch (error) {
          console.error('Image upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir la imagen</p>'
        }
      }
    })

    container.addEventListener('dragover', (e: DragEvent) => {
      e.preventDefault()
      container.style.borderColor = '#6BBE45'
      container.style.backgroundColor = 'rgba(107, 190, 69, 0.05)'
    })

    container.addEventListener('dragleave', () => {
      const isDark = document.documentElement.classList.contains('dark')
      container.style.borderColor = isDark ? '#6b7280' : '#d1d5db'
      container.style.backgroundColor = isDark ? '#374151' : '#f9fafb'
    })

    container.addEventListener('drop', async (e: DragEvent) => {
      e.preventDefault()
      const isDark = document.documentElement.classList.contains('dark')
      container.style.borderColor = isDark ? '#6b7280' : '#d1d5db'
      container.style.backgroundColor = isDark ? '#374151' : '#f9fafb'

      const file = e.dataTransfer?.files?.[0]
      if (!file || !file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('La imagen es demasiado grande. El tamaño máximo es 10MB.')
        return
      }

      container.innerHTML = '<p style="color: #666; padding: 40px 20px;">Subiendo imagen...</p>'

      if (this.uploader) {
        try {
          const result = await this.uploader.uploadByFile(file)
          if (result.success && result.file && this.wrapper) {
            this.data = { url: result.file.url, caption: '', withBorder: false, withBackground: false, stretched: false }
            this.wrapper.innerHTML = ''
            this.createImageElement(result.file.url, '')
          }
        } catch (error) {
          console.error('Image upload error:', error)
          container.innerHTML = '<p style="color: #d32f2f; padding: 40px 20px;">Error al subir la imagen</p>'
        }
      }
    })

    this.wrapper.appendChild(container)
  }

  private createImageElement(url: string, caption: string) {
    if (!this.wrapper) return

    const imageContainer = document.createElement('div')
    imageContainer.style.cssText = 'position: relative; margin: 10px 0;'

    const img = document.createElement('img')
    img.src = url
    img.alt = caption || ''
    img.style.cssText = 'width: 100%; max-width: 100%; border-radius: 8px; display: block;'

    imageContainer.appendChild(img)

    const captionInput = document.createElement('input') as HTMLInputElement
    captionInput.type = 'text'
    captionInput.value = caption
    captionInput.placeholder = 'Agregar descripción de la imagen...'
    captionInput.style.cssText = `
      width: 100%;
      margin-top: 10px;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 14px;
      outline: none;
      background: white;
      color: #1f2937;
    `
    
    // Apply dark mode styles
    if (document.documentElement.classList.contains('dark')) {
      captionInput.style.background = '#374151'
      captionInput.style.borderColor = '#6b7280'
      captionInput.style.color = '#f9fafb'
    }
    captionInput.addEventListener('input', (e: Event) => {
      this.data.caption = (e.target as HTMLInputElement).value
      img.alt = this.data.caption
    })

    captionInput.addEventListener('focus', () => {
      captionInput.style.borderColor = '#6BBE45'
    })

    captionInput.addEventListener('blur', () => {
      captionInput.style.borderColor = '#e0e0e0'
    })

    imageContainer.appendChild(captionInput)

    this.wrapper.appendChild(imageContainer)
  }

  save(): ImageToolData {
    return {
      url: this.data.url || '',
      caption: this.data.caption || '',
      withBorder: this.data.withBorder || false,
      withBackground: this.data.withBackground || false,
      stretched: this.data.stretched || false
    }
  }
}
