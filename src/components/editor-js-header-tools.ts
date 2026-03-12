// Simple Header Tools for Editor.js - Standalone tools for H1-H4
// Each header level is a separate tool that appears in the toolbox

interface HeaderData {
  text: string
  level: number
}

interface HeaderConfig {
  placeholder?: string
}

// Título 1 (H1)
export class Titulo1 {
  private data: HeaderData
  private config: HeaderConfig
  private element: HTMLHeadingElement | null = null

  static get toolbox() {
    return {
      title: 'Título 1',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276"><path d="M291 0V15H181V261H155V15H45V0H291Z"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  static get sanitize() {
    return {
      text: true,
      level: false
    }
  }

  constructor({ data, config }: { data?: HeaderData; config?: HeaderConfig }) {
    this.data = {
      text: data?.text || '',
      level: 1
    }
    this.config = config || { placeholder: 'Escribe un título 1...' }
  }

  render() {
    this.element = document.createElement('h1')
    this.element.innerHTML = this.data.text || ''
    this.element.classList.add('ce-header')
    this.element.setAttribute('contenteditable', 'true')
    this.element.setAttribute('data-placeholder', this.config.placeholder || 'Escribe un título 1...')
    
    return this.element
  }

  save(blockContent: HTMLElement): HeaderData {
    return {
      text: blockContent.innerHTML,
      level: 1
    }
  }
}

// Título 2 (H2)
export class Titulo2 {
  private data: HeaderData
  private config: HeaderConfig
  private element: HTMLHeadingElement | null = null

  static get toolbox() {
    return {
      title: 'Título 2',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276"><path d="M291 0V15H181V261H155V15H45V0H291Z"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  static get sanitize() {
    return {
      text: true,
      level: false
    }
  }

  constructor({ data, config }: { data?: HeaderData; config?: HeaderConfig }) {
    this.data = {
      text: data?.text || '',
      level: 2
    }
    this.config = config || { placeholder: 'Escribe un título 2...' }
  }

  render() {
    this.element = document.createElement('h2')
    this.element.innerHTML = this.data.text || ''
    this.element.classList.add('ce-header')
    this.element.setAttribute('contenteditable', 'true')
    this.element.setAttribute('data-placeholder', this.config.placeholder || 'Escribe un título 2...')
    
    return this.element
  }

  save(blockContent: HTMLElement): HeaderData {
    return {
      text: blockContent.innerHTML,
      level: 2
    }
  }
}

// Título 3 (H3)
export class Titulo3 {
  private data: HeaderData
  private config: HeaderConfig
  private element: HTMLHeadingElement | null = null

  static get toolbox() {
    return {
      title: 'Título 3',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276"><path d="M291 0V15H181V261H155V15H45V0H291Z"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  static get sanitize() {
    return {
      text: true,
      level: false
    }
  }

  constructor({ data, config }: { data?: HeaderData; config?: HeaderConfig }) {
    this.data = {
      text: data?.text || '',
      level: 3
    }
    this.config = config || { placeholder: 'Escribe un título 3...' }
  }

  render() {
    this.element = document.createElement('h3')
    this.element.innerHTML = this.data.text || ''
    this.element.classList.add('ce-header')
    this.element.setAttribute('contenteditable', 'true')
    this.element.setAttribute('data-placeholder', this.config.placeholder || 'Escribe un título 3...')
    
    return this.element
  }

  save(blockContent: HTMLElement): HeaderData {
    return {
      text: blockContent.innerHTML,
      level: 3
    }
  }
}

// Título 4 (H4)
export class Titulo4 {
  private data: HeaderData
  private config: HeaderConfig
  private element: HTMLHeadingElement | null = null

  static get toolbox() {
    return {
      title: 'Título 4',
      icon: '<svg width="17" height="15" viewBox="0 0 336 276"><path d="M291 0V15H181V261H155V15H45V0H291Z"/></svg>'
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  static get sanitize() {
    return {
      text: true,
      level: false
    }
  }

  constructor({ data, config }: { data?: HeaderData; config?: HeaderConfig }) {
    this.data = {
      text: data?.text || '',
      level: 4
    }
    this.config = config || { placeholder: 'Escribe un título 4...' }
  }

  render() {
    this.element = document.createElement('h4')
    this.element.innerHTML = this.data.text || ''
    this.element.classList.add('ce-header')
    this.element.setAttribute('contenteditable', 'true')
    this.element.setAttribute('data-placeholder', this.config.placeholder || 'Escribe un título 4...')
    
    return this.element
  }

  save(blockContent: HTMLElement): HeaderData {
    return {
      text: blockContent.innerHTML,
      level: 4
    }
  }
}
