// Custom Link Tool for Editor.js - Simple inline link with popup

interface LinkData {
  link: string
}

export default class LinkTool {
  private data: LinkData
  private button: HTMLButtonElement

  static get isInline() {
    return true
  }

  static get title() {
    return 'Enlace'
  }

  static get icon() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"></path><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"></path></svg>'
  }

  static get sanitize() {
    return {
      a: {
        href: true,
        target: true,
        rel: true
      }
    }
  }

  constructor() {
    this.data = { link: '' }
    this.button = document.createElement('button')
  }

  render(): HTMLButtonElement {
    this.button.type = 'button'
    this.button.classList.add('ce-inline-tool', 'ce-toolbar__tool')
    this.button.innerHTML = LinkTool.icon
    this.button.title = 'Enlace'
    this.button.style.width = '24px'
    this.button.style.height = '24px'
    return this.button
  }

  surround(range: Range): void {
    if (!range) return

    const existingLink = this.findLinkInSelection()
    
    if (existingLink) {
      this.showRemoveOption(existingLink)
    } else if (!range.collapsed) {
      this.showInputPopup(range)
    }
  }

  private findLinkInSelection(): HTMLAnchorElement | null {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null

    const container = selection.anchorNode
    if (!container) return null

    const element = container.nodeType === Node.TEXT_NODE
      ? container.parentElement
      : container as Element

    return element?.closest('a') as HTMLAnchorElement
  }

  private showInputPopup(range: Range): void {
    const popup = document.createElement('div')
    popup.className = 'link-tool-popup'
    popup.style.cssText = `
      position: absolute;
      z-index: 1000;
      display: flex;
      gap: 6px;
      padding: 6px 8px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      align-items: center;
    `

    if (document.documentElement.classList.contains('dark')) {
      popup.style.background = '#1f2937'
    }

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'URL'
    input.style.cssText = `
      padding: 6px 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 13px;
      outline: none;
      width: 180px;
    `

    if (document.documentElement.classList.contains('dark')) {
      input.style.background = '#374151'
      input.style.borderColor = '#4b5563'
      input.style.color = '#fff'
    }

    const saveBtn = document.createElement('button')
    saveBtn.textContent = '✓'
    saveBtn.style.cssText = `
      padding: 6px 10px;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    `

    const save = () => {
      const url = input.value.trim()
      if (!url) {
        popup.remove()
        return
      }

      let finalUrl = url
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        finalUrl = 'https://' + url
      }

      const link = document.createElement('a')
      link.href = finalUrl
      link.target = '_self'
      link.rel = 'noopener noreferrer'
      link.style.color = '#3b82f6'
      link.style.textDecoration = 'underline'

      const contents = range.extractContents()
      link.appendChild(contents)
      range.insertNode(link)

      popup.remove()
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') save()
      if (e.key === 'Escape') popup.remove()
    })

    saveBtn.addEventListener('click', save)

    popup.appendChild(input)
    popup.appendChild(saveBtn)

    document.body.appendChild(popup)

    const rect = this.button.getBoundingClientRect()
    popup.style.top = (rect.bottom + window.scrollY + 4) + 'px'
    popup.style.left = (rect.left + window.scrollX) + 'px'

    setTimeout(() => input.focus(), 50)

    const closePopup = (e: MouseEvent) => {
      if (!popup.contains(e.target as Node) && e.target !== this.button) {
        popup.remove()
        document.removeEventListener('click', closePopup)
      }
    }
    setTimeout(() => document.addEventListener('click', closePopup), 100)
  }

  private showRemoveOption(link: HTMLAnchorElement): void {
    const popup = document.createElement('div')
    popup.className = 'link-tool-popup'
    popup.style.cssText = `
      position: absolute;
      z-index: 1000;
      display: flex;
      gap: 6px;
      padding: 6px 8px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      align-items: center;
    `

    if (document.documentElement.classList.contains('dark')) {
      popup.style.background = '#1f2937'
    }

    const urlText = document.createElement('span')
    urlText.textContent = link.href.length > 25 ? link.href.substring(0, 25) + '...' : link.href
    urlText.style.cssText = `
      font-size: 12px;
      color: #6b7280;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `

    const removeBtn = document.createElement('button')
    removeBtn.textContent = '✕'
    removeBtn.title = 'Eliminar enlace'
    removeBtn.style.cssText = `
      padding: 4px 8px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    `

    removeBtn.addEventListener('click', () => {
      const parent = link.parentNode
      if (parent) {
        while (link.firstChild) {
          parent.insertBefore(link.firstChild, link)
        }
        parent.removeChild(link)
      }
      popup.remove()
    })

    popup.appendChild(urlText)
    popup.appendChild(removeBtn)

    document.body.appendChild(popup)

    const rect = link.getBoundingClientRect()
    popup.style.top = (rect.bottom + window.scrollY + 4) + 'px'
    popup.style.left = (rect.left + window.scrollX) + 'px'

    const closePopup = (e: MouseEvent) => {
      if (!popup.contains(e.target as Node)) {
        popup.remove()
        document.removeEventListener('click', closePopup)
      }
    }
    setTimeout(() => document.addEventListener('click', closePopup), 100)
  }

  checkState(): boolean {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return false

    return !!this.findLinkInSelection()
  }

  clear(): void {
    this.data = { link: '' }
  }
}
