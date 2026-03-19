// Custom Link Tool for Editor.js - Beautiful inline link popup

/**
 * Sanitize a link href to prevent XSS attacks
 * Blocks javascript:, data:, vbscript:, file: protocols
 */
function sanitizeLinkHref(href: string | null | undefined): string {
  if (!href) return ''
  
  const trimmedHref = href.trim()
  const lowerHref = trimmedHref.toLowerCase()
  
  // Block all dangerous protocols
  if (lowerHref.startsWith('javascript:')) return ''
  if (lowerHref.startsWith('data:')) return ''
  if (lowerHref.startsWith('vbscript:')) return ''
  if (lowerHref.startsWith('file:')) return ''
  
  // Allow relative URLs
  if (trimmedHref.startsWith('/')) return trimmedHref
  
  // Allow anchor links
  if (trimmedHref.startsWith('#')) return trimmedHref
  
  // Validate absolute URLs - only allow http and https
  try {
    const parsedUrl = new URL(trimmedHref)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return ''
    }
    return trimmedHref
  } catch {
    // If it's not a valid URL, try adding https://
    if (!trimmedHref.startsWith('http://') && !trimmedHref.startsWith('https://')) {
      try {
        const urlWithProtocol = `https://${trimmedHref}`
        new URL(urlWithProtocol)
        return urlWithProtocol
      } catch {
        return ''
      }
    }
    return ''
  }
}

interface LinkData {
  link: string
}

export default class LinkTool {
  private data: LinkData
  private readonly popupSelector = '.link-tool-popup'
  private toolButton: HTMLButtonElement | null = null

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
  }

  render(): HTMLButtonElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.classList.add('ce-inline-tool')
    button.innerHTML = LinkTool.icon
    button.title = 'Enlace'
    this.toolButton = button
    return button
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

  private removeExistingPopup(): void {
    const existingPopup = document.querySelector(this.popupSelector)
    if (existingPopup) existingPopup.remove()
  }

  private getPopupMount(anchorEl?: Element | null): HTMLElement {
    if (!anchorEl) return document.body

    const dialogContent = anchorEl.closest('[data-slot="dialog-content"]') as HTMLElement | null
    if (dialogContent) return dialogContent

    return document.body
  }

  private positionPopup(popup: HTMLElement, mount: HTMLElement, anchorEl: HTMLElement): void {
    const anchorRect = anchorEl.getBoundingClientRect()

    if (mount === document.body) {
      popup.style.position = 'fixed'
      popup.style.top = `${anchorRect.bottom + 4}px`
      popup.style.left = `${anchorRect.left}px`
      return
    }

    popup.style.position = 'absolute'
    const mountRect = mount.getBoundingClientRect()
    // If the dialog content is scrollable, we must account for its scroll offset
    popup.style.top = `${anchorRect.bottom - mountRect.top + mount.scrollTop + 4}px`
    popup.style.left = `${anchorRect.left - mountRect.left + mount.scrollLeft}px`
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
    const savedRange = range.cloneRange()
    this.removeExistingPopup()

    const popup = document.createElement('div')
    popup.className = 'link-tool-popup'
    popup.style.cssText = `
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      pointer-events: auto;
    `

    if (document.documentElement.classList.contains('dark')) {
      popup.style.background = '#1f2937'
    }

    // Prevent Editor.js / Radix Dialog from treating popup clicks as "outside"
    popup.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
    })
    popup.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })
    popup.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    // URL Input
    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Ingresa la URL...'
    input.style.cssText = `
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
      outline: none;
      width: 200px;
      transition: border-color 0.2s;
    `

    input.style.background = document.documentElement.classList.contains('dark') ? '#374151' : '#fff'
    input.style.borderColor = document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb'
    input.style.color = document.documentElement.classList.contains('dark') ? '#fff' : '#1f2937'

    input.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
    })
    input.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })
    input.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    input.addEventListener('mouseenter', () => {
      input.style.borderColor = '#6BBE45'
    })
    input.addEventListener('mouseleave', () => {
      input.style.borderColor = document.documentElement.classList.contains('dark') ? '#4b5563' : '#e5e7eb'
    })

    // Save Button
    const saveBtn = document.createElement('button')
    saveBtn.textContent = 'Guardar'
    saveBtn.style.cssText = `
      padding: 8px 16px;
      background: #6BBE45;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    `
    
    saveBtn.addEventListener('mouseenter', () => {
      saveBtn.style.background = '#5CAE38'
    })
    saveBtn.addEventListener('mouseleave', () => {
      saveBtn.style.background = '#6BBE45'
    })

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

      // Sanitize URL to prevent XSS
      const safeUrl = sanitizeLinkHref(finalUrl)
      if (!safeUrl) return

       const link = document.createElement('a')
       link.href = safeUrl
       link.target = '_self'
       link.rel = 'noopener noreferrer'
       link.style.color = '#3b82f6'
       link.style.textDecoration = 'underline'

       const contents = savedRange.extractContents()
       link.appendChild(contents)
       savedRange.insertNode(link)

       // Place caret after the inserted link
       const selection = window.getSelection()
       if (selection) {
         selection.removeAllRanges()
         const afterLink = document.createRange()
         afterLink.setStartAfter(link)
         afterLink.collapse(true)
         selection.addRange(afterLink)
       }

       popup.remove()
     }

    input.addEventListener('keydown', (e) => {
      e.stopPropagation()
      if (e.key === 'Enter') {
        e.preventDefault()
        save()
      }
      if (e.key === 'Escape') {
        popup.remove()
      }
    })

    saveBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      save()
    })

    popup.appendChild(input)
    popup.appendChild(saveBtn)

    // Position popup near the toolbar button instead of the text
    const buttonEl = (this.toolButton?.isConnected ? this.toolButton : null)
      ?? (document.querySelector('.ce-inline-tool[title="Enlace"]') as HTMLElement | null)
    const mount = this.getPopupMount(buttonEl)
    if (buttonEl) {
      this.positionPopup(popup, mount, buttonEl)
    }

    mount.appendChild(popup)

    // Focus input
    setTimeout(() => {
      try {
        input.focus({ preventScroll: true })
      } catch {
        input.focus()
      }
    }, 50)

    // Close popup when clicking outside
    const closePopup = (e: MouseEvent) => {
      if (!popup.contains(e.target as Node)) {
        popup.remove()
        document.removeEventListener('mousedown', closePopup)
      }
    }
    
    setTimeout(() => {
      document.addEventListener('mousedown', closePopup)
    }, 200)
  }

  private showRemoveOption(link: HTMLAnchorElement): void {
    this.removeExistingPopup()

    const popup = document.createElement('div')
    popup.className = 'link-tool-popup'
    popup.style.cssText = `
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      pointer-events: auto;
    `

    if (document.documentElement.classList.contains('dark')) {
      popup.style.background = '#1f2937'
    }

    // Prevent Editor.js / Radix Dialog from treating popup clicks as "outside"
    popup.addEventListener('pointerdown', (e) => {
      e.stopPropagation()
    })
    popup.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })
    popup.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    // URL display
    const urlText = document.createElement('span')
    urlText.textContent = link.href.length > 30 ? link.href.substring(0, 30) + '...' : link.href
    urlText.style.cssText = `
      font-size: 12px;
      color: #6b7280;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `
    if (document.documentElement.classList.contains('dark')) {
      urlText.style.color = '#9ca3af'
    }

    // Remove Button
    const removeBtn = document.createElement('button')
    removeBtn.textContent = 'Eliminar'
    removeBtn.title = 'Eliminar enlace'
    removeBtn.style.cssText = `
      padding: 6px 12px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    `

    removeBtn.addEventListener('mouseenter', () => {
      removeBtn.style.background = '#dc2626'
    })
    removeBtn.addEventListener('mouseleave', () => {
      removeBtn.style.background = '#ef4444'
    })

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

    // Position popup near the toolbar button
    const buttonEl = (this.toolButton?.isConnected ? this.toolButton : null)
      ?? (document.querySelector('.ce-inline-tool[title="Enlace"]') as HTMLElement | null)
    const mount = this.getPopupMount(buttonEl)
    if (buttonEl) {
      this.positionPopup(popup, mount, buttonEl)
    }

    mount.appendChild(popup)

    // Close popup when clicking outside
    const closePopup = (e: MouseEvent) => {
      if (!popup.contains(e.target as Node)) {
        popup.remove()
        document.removeEventListener('mousedown', closePopup)
      }
    }
    
    setTimeout(() => {
      document.addEventListener('mousedown', closePopup)
    }, 200)
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
