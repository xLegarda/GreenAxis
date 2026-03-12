// Custom Strikethrough Tool for Editor.js
// Allows strikethrough text formatting

export default class Strikethrough {
  static get isInline() {
    return true
  }

  static get title() {
    return 'Tachado'
  }

  static get icon() {
    return '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 12.5c0-.5.2-1 .6-1.4.4-.4.9-.6 1.4-.6h4c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4s-.2 1-.6 1.4c-.4.4-.9.6-1.4.6H8c-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4zM3 9h14v2H3V9z" fill="currentColor"/></svg>'
  }

  static get sanitize() {
    return {
      s: true,
      del: true,
      span: {
        class: 'cdx-strikethrough',
        style: true
      }
    }
  }

  surround(range: Range): void {
    if (!range) return

    const selectedText = range.extractContents()
    const s = document.createElement('s')
    s.classList.add('cdx-strikethrough')
    s.appendChild(selectedText)
    
    range.insertNode(s)
  }

  checkState(): boolean {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return false
    
    const anchor = selection.anchorNode
    if (!anchor) return false
    
    const parent = anchor.parentElement
    if (!parent) return false
    
    return parent.tagName === 'S' || parent.tagName === 'DEL' || parent.classList.contains('cdx-strikethrough')
  }

  clear(): void {
    // Nothing to clear
  }

  render(): HTMLElement {
    const button = document.createElement('button')
    button.type = 'button'
    button.innerHTML = Strikethrough.icon
    button.classList.add('ce-inline-tool')
    return button
  }
}
