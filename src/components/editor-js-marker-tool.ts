// Custom Marker Tool with multiple colors for Editor.js
// Allows highlight color selection

interface MarkerToolData {
  color: string
}

interface MarkerToolConfig {
  colors?: { name: string; value: string }[]
  defaultColor?: string
}

export default class MarkerTool {
  private data: MarkerToolData
  private wrapper: HTMLElement | undefined
  private config: MarkerToolConfig

  static get CSS() {
    return 'cdx-marker-custom'
  }

  static get isInline() {
    return true
  }

  static get title() {
    return 'Resaltado'
  }

  constructor({ data, config }: { data: MarkerToolData; config?: MarkerToolConfig }) {
    this.data = data || { color: config?.defaultColor || '#FFEB3B' }
    this.config = config || {}
  }

  static get sanitize() {
    return {
      mark: {
        class: MarkerTool.CSS,
        style: true
      }
    }
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div')
    this.wrapper.classList.add('marker-tool-wrapper')

    const colors = this.config.colors || [
      { name: 'Amarillo', value: 'rgba(255, 235, 59, 0.4)' },
      { name: 'Verde', value: 'rgba(107, 190, 69, 0.4)' },
      { name: 'Azul', value: 'rgba(59, 130, 246, 0.4)' },
      { name: 'Rosa', value: 'rgba(236, 72, 153, 0.4)' },
      { name: 'Naranja', value: 'rgba(249, 115, 22, 0.4)' },
      { name: 'Púrpura', value: 'rgba(139, 92, 246, 0.4)' },
      { name: 'Cian', value: 'rgba(6, 182, 212, 0.4)' },
      { name: 'Rojo', value: 'rgba(239, 68, 68, 0.4)' },
    ]

    const grid = document.createElement('div')
    grid.classList.add('marker-grid')
    grid.style.display = 'grid'
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)'
    grid.style.gap = '6px'
    grid.style.padding = '8px'
    grid.style.background = '#fff'
    grid.style.borderRadius = '8px'
    grid.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'

    colors.forEach((color) => {
      const colorBtn = document.createElement('button')
      colorBtn.type = 'button'
      colorBtn.setAttribute('title', color.name)
      colorBtn.style.width = '32px'
      colorBtn.style.height = '32px'
      colorBtn.style.borderRadius = '6px'
      colorBtn.style.border = '2px solid #e5e7eb'
      colorBtn.style.background = color.value
      colorBtn.style.cursor = 'pointer'
      colorBtn.style.transition = 'transform 0.1s, border-color 0.1s'
      
      colorBtn.addEventListener('mouseenter', () => {
        colorBtn.style.transform = 'scale(1.1)'
        colorBtn.style.borderColor = '#6BBE45'
      })
      colorBtn.addEventListener('mouseleave', () => {
        colorBtn.style.transform = 'scale(1)'
        colorBtn.style.borderColor = '#e5e7eb'
      })

      colorBtn.addEventListener('click', () => {
        this.data = { color: color.value }
        this.wrapper?.dispatchEvent(new CustomEvent('marker-color-selected', { detail: { color: color.value } }))
      })

      grid.appendChild(colorBtn)
    })

    this.wrapper.appendChild(grid)
    return this.wrapper
  }

  surround(range: Range): void {
    if (!range) return

    const selectedText = range.extractContents()
    
    // Check if selection is already inside a marker
    let parent = range.commonAncestorContainer.parentElement
    let existingMark: HTMLElement | null = null
    
    while (parent) {
      if (parent.classList.contains(MarkerTool.CSS)) {
        existingMark = parent
        break
      }
      parent = parent.parentElement
    }
    
    // If clicking the same color, remove the format
    if (existingMark && existingMark.style.background === this.data.color) {
      const text = existingMark.textContent || ''
      const textNode = document.createTextNode(text)
      existingMark.parentNode?.replaceChild(textNode, existingMark)
      return
    }
    
    // If there's an existing marker, replace it
    if (existingMark) {
      const mark = document.createElement('mark')
      mark.classList.add(MarkerTool.CSS)
      mark.style.background = this.data.color
      mark.style.padding = '0.1em 0.2em'
      mark.style.borderRadius = '2px'
      mark.textContent = existingMark.textContent || ''
      existingMark.parentNode?.replaceChild(mark, existingMark)
      return
    }
    
    // Apply new marker
    const mark = document.createElement('mark')
    
    mark.classList.add(MarkerTool.CSS)
    mark.style.background = this.data.color
    mark.style.padding = '0.1em 0.2em'
    mark.style.borderRadius = '2px'
    mark.appendChild(selectedText)
    
    range.insertNode(mark)
  }

  handleDblClick(): void {
    // Remove marker format on double click
    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return
    
    const range = selection.getRangeAt(0)
    const parent = range.commonAncestorContainer.parentElement
    
    if (parent && parent.classList.contains(MarkerTool.CSS)) {
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
    
    return parent.classList.contains(MarkerTool.CSS)
  }

  clear(): void {
    this.data = { color: this.config.defaultColor || 'rgba(255, 235, 59, 0.4)' }
  }
}
