// Custom Color Tool for Editor.js
// Allows text color selection

interface ColorToolData {
  color: string
}

interface ColorToolConfig {
  colors?: string[]
  defaultColor?: string
}

export default class ColorTool {
  private data: ColorToolData
  private wrapper: HTMLElement | undefined
  private colorPicker: HTMLElement | undefined
  private config: ColorToolConfig

  static get CSS() {
    return 'cdx-color-text'
  }

  static get isInline() {
    return true
  }

  static get title() {
    return 'Color de texto'
  }

  constructor({ data, config }: { data: ColorToolData; config?: ColorToolConfig }) {
    this.data = data || { color: config?.defaultColor || '#000000' }
    this.config = config || {}
  }

  static get sanitize() {
    return {
      span: {
        class: ColorTool.CSS,
        style: true
      }
    }
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('color-tool-wrapper')

    const colors = this.config.colors || [
      '#000000', // Negro
      '#374151', // Gris oscuro
      '#6BBE45', // Verde Green Axis
      '#005A7A', // Azul Green Axis
      '#DC2626', // Rojo
      '#EA580C', // Naranja
      '#CA8A04', // Amarillo
      '#7C3AED', // Púrpura
      '#DB2777', // Rosa
      '#0891B2', // Cian
    ]

    const grid = document.createElement('div')
    grid.classList.add('color-grid')
    grid.style.display = 'grid'
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)'
    grid.style.gap = '4px'
    grid.style.padding = '8px'
    grid.style.background = '#fff'
    grid.style.borderRadius = '8px'
    grid.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'

    colors.forEach((color) => {
      const colorBtn = document.createElement('button')
      colorBtn.type = 'button'
      colorBtn.style.width = '28px'
      colorBtn.style.height = '28px'
      colorBtn.style.borderRadius = '4px'
      colorBtn.style.border = '2px solid #e5e7eb'
      colorBtn.style.background = color
      colorBtn.style.cursor = 'pointer'
      colorBtn.style.transition = 'transform 0.1s'
      
      colorBtn.addEventListener('mouseenter', () => {
        colorBtn.style.transform = 'scale(1.1)'
      })
      colorBtn.addEventListener('mouseleave', () => {
        colorBtn.style.transform = 'scale(1)'
      })

      colorBtn.addEventListener('click', () => {
        this.data = { color }
        this.wrapper?.dispatchEvent(new CustomEvent('color-selected', { detail: { color } }))
      })

      grid.appendChild(colorBtn)
    })

    this.wrapper.appendChild(grid)
    return this.wrapper
  }

  surround(range: Range): void {
    if (!range) return

    const selectedText = range.extractContents()
    
    // Check if selection is already inside a color span
    let parent = range.commonAncestorContainer.parentElement
    let existingSpan: HTMLElement | null = null
    
    while (parent) {
      if (parent.classList.contains(ColorTool.CSS)) {
        existingSpan = parent
        break
      }
      parent = parent.parentElement
    }
    
    // If clicking the same color, remove the format
    if (existingSpan && existingSpan.style.color === this.data.color) {
      const text = existingSpan.textContent || ''
      const textNode = document.createTextNode(text)
      existingSpan.parentNode?.replaceChild(textNode, existingSpan)
      return
    }
    
    // If there's an existing color span, replace it
    if (existingSpan) {
      const span = document.createElement('span')
      span.classList.add(ColorTool.CSS)
      span.style.color = this.data.color
      span.textContent = existingSpan.textContent || ''
      existingSpan.parentNode?.replaceChild(span, existingSpan)
      return
    }
    
    // Apply new color
    const span = document.createElement('span')
    span.classList.add(ColorTool.CSS)
    span.style.color = this.data.color
    span.appendChild(selectedText)
    
    range.insertNode(span)
  }

  handleDblClick(): void {
    // Remove color format on double click
    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return
    
    const range = selection.getRangeAt(0)
    const parent = range.commonAncestorContainer.parentElement
    
    if (parent && parent.classList.contains(ColorTool.CSS)) {
      const text = parent.textContent || ''
      const textNode = document.createTextNode(text)
      parent.parentNode?.replaceChild(textNode, parent)
    }
  }

  checkState(): boolean {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return false
    
    const anchor = selection.anchorNode
    if (!anchor) return false
    
    const parent = anchor.parentElement
    if (!parent) return false
    
    return parent.classList.contains(ColorTool.CSS)
  }

  clear(): void {
    this.data = { color: this.config.defaultColor || '#000000' }
  }
}
