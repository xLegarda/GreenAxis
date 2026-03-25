'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type EditorJS from '@editorjs/editorjs'
import { createRoot } from 'react-dom/client'
import MediaPickerCompact from './media-picker-compact'
import { MediaPickerInlineDialog } from './media-picker-inline-dialog'
import { MARKER_COLORS, TEXT_COLORS } from './editor-colors'

/**
 * Passthrough - content from the editor is trusted
 */
function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html
}

interface EditorProps {
  data?: any
  onChange: (data: any) => void
  placeholder?: string
}

// Spanish translations for Editor.js
const i18nConfig = {
  direction: 'ltr' as const,
  messages: {
    ui: {
      "blockTunes": {
        "toggler": {
          "Click to tune": "Haz clic para configurar",
          "or drag to move": "o arrastra para mover"
        },
      },
      "inlineToolbar": {
        "converter": {
          "Convert to": "Convertir a"
        }
      },
      "toolbar": {
        "toolbox": {
          "Add": "Añadir"
        }
      },
      "popover": {
        "Filter": "Buscar",
        "Nothing found": "No se encontró nada",
        "Convert to": "Convertir a"
      }
    },
    toolNames: {
      "Text": "Párrafo",
      "Heading": "Título",
      "List": "Lista",
      "Warning": "Advertencia",
      "Checklist": "Lista de verificación",
      "Quote": "Cita",
      "Code": "Código",
      "Delimiter": "Separador",
      "Raw HTML": "HTML sin formato",
      "Table": "Tabla",
      "Link": "Enlace",
      "Marker": "Resaltado",
      "Marker Color": "Resaltado color",
      "Text Color": "Color de texto",
      "Convert to": "Convertir a",
      "Bold": "Negrita",
      "Italic": "Cursiva",
      "InlineCode": "Código",
      "Image": "Imagen",
      "Embed": "Incrustar",
      "Video Local": "Video local",
      "Audio": "Audio",
      "Ordered List": "Lista numerada",
      "Unordered List": "Lista con viñetas",
      "Underline": "Subrayado",
      "Strikethrough": "Tachado",
      "Subscript": "Subíndice",
      "Superscript": "Superíndice",
      "Titulo 1": "Título 1",
      "Titulo 2": "Título 2",
      "Titulo 3": "Título 3",
      "Titulo 4": "Título 4"
    },
    tools: {
      "warning": {
        "Title": "Título",
        "Message": "Mensaje",
      },
      "link": {
        "Add a link": "Añadir un enlace",
        "Link": "Enlace",
        "Remove link": "Quitar enlace"
      },
      "stub": {
        'The block can not be displayed correctly.': 'El bloque no puede mostrarse correctamente.'
      },
      "image": {
        "Caption": "Descripción",
        "Select an Image": "Selecciona una imagen",
        "With border": "Con borde",
        "Stretch image": "Estirer imagen",
        "With background": "Con fondo",
        "Add an Image": "Añadir imagen",
        "Upload": "Subir",
        "By URL": "Por URL",
        "Paste an image URL...": "Pega la URL de la imagen...",
        "Add image from file": "Añadir imagen desde archivo"
      },
      "header": {
        "Heading 1": "Título 1",
        "Heading 2": "Título 2",
        "Heading 3": "Título 3",
        "Heading 4": "Título 4",
        "Heading 5": "Título 5",
        "Heading 6": "Título 6",
        "Add a Header": "Añadir un título"
      },
      "paragraph": {
        "Enter something": "Escribe algo...",
        "Add a paragraph": "Añadir un párrafo"
      },
      "list": {
        "Ordered": "Numerada",
        "Unordered": "Con viñetas",
        "Checklist": "Lista de verificación",
        "Add an unordered list": "Añadir lista con viñetas",
        "Add an ordered list": "Añadir lista numerada",
        "Ordered List": "Lista numerada",
        "Unordered List": "Lista con viñetas",
        "Unordered list": "Lista con viñetas",
        "Ordered list": "Lista numerada"
      },
      "quote": {
        "Quote": "Cita",
        "Add a quote": "Añadir una cita",
        "Align Left": "Alinear a la izquierda",
        "Align Center": "Centrar"
      },
      "embed": {
        "Embed": "Incrustar",
        "Enter URL to embed": "Introduce la URL para incrustar"
      },
      "videoLocal": {
        "Video Local": "Video local",
        "Add a video": "Añadir un video",
        "Click to upload a video": "Haz clic para subir un video"
      },
      "audioLocal": {
        "Audio": "Audio",
        "Add an audio": "Añadir un audio"
      },
      "textColor": {
        "Text Color": "Color de texto"
      },
      "markerColor": {
        "Highlight": "Resaltado"
      },
      "convertTo": {
          "Convert to": "Convertir a"
      },
    },
    blockTunes: {
      "delete": {
        "Delete": "Eliminar",
        "Click to delete": "Haz clic para eliminar"
      },
      "moveUp": {
        "Move up": "Mover arriba"
      },
      "moveDown": {
        "Move down": "Mover abajo"
      }
    },
  }
}

/**
 * Create uploader config for media types (image, video, audio)
 * Uses server-side upload with 4.5MB limit
 */
const createMediaUploader = (
  type: 'image' | 'video' | 'audio',
  category: string
) => ({
  async uploadByFile(file: File) {
    // Validate file size (4.5MB limit)
    const maxSizeBytes = 4.5 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      console.error(`File too large (${fileSizeMB} MB). Upload from library instead.`)
      return { success: 0 }
    }

    const mediaKey = `${type}-${Date.now()}`
    const label = file.name.replace(/\.[^/.]+$/, '')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', mediaKey)
    formData.append('label', label)
    formData.append('category', category)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          return { success: 1, file: { url: data.url } }
        }
      }
      return { success: 0 }
    } catch (e) {
      console.error(`${type} upload error:`, e)
      return { success: 0 }
    }
  },
  libraryPicker: {
    enabled: true,
    onSelect: async () => {
      return await openMediaPickerModal(type)
    }
  }
})

/**
 * Open media picker modal using Radix Dialog (fixes click-outside bug with tab switching)
 */
function openMediaPickerModal(accept: 'image' | 'video' | 'audio'): Promise<string | null> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)
    let resolved = false

    const cleanup = (url: string | null) => {
      if (resolved) return
      resolved = true
      root.unmount()
      container.remove()
      resolve(url)
    }

    const handleSelect = (url: string) => cleanup(url)
    const handleCancel = () => cleanup(null)

    root.render(
      <MediaPickerInlineDialog
        open={true}
        onSelect={handleSelect}
        onCancel={handleCancel}
        accept={accept}
      />
    )
  })
}

export function EditorJSComponent({ data, onChange, placeholder }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null)
  const holderRef = useRef<HTMLDivElement>(null)
  const onChangeRef = useRef(onChange)
  const [isReady, setIsReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dataRef = useRef(data)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    setMounted(true)
  }, [])

  const saveData = useCallback(async () => {
    if (editorRef.current && !(editorRef.current as any).isDestroyed) {
      try {
        const output = await editorRef.current.save()
        onChangeRef.current(output)
      } catch (e) {
        console.error('Error saving editor data:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted || !holderRef.current || isReady) return

    let isSubscribed = true

    const initEditor = async () => {
      try {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Titulos = await import('./editor-js-header-tools')
        const List = (await import('@editorjs/list')).default
        const ImageTool = (await import('./editor-js-image-tool')).default
        const Quote = (await import('@editorjs/quote')).default
        const Paragraph = (await import('@editorjs/paragraph')).default
        const Embed = (await import('@editorjs/embed')).default
        const Marker = (await import('@editorjs/marker')).default
        const Link = (await import('./editor-js-link-tool')).default
        const Underline = (await import('@editorjs/underline')).default
        const Strikethrough = (await import('./editor-js-strikethrough-tool')).default
        const VideoTool = (await import('./editor-js-video-tool')).default
        const AudioTool = (await import('./editor-js-audio-tool')).default
        const ColorTool = (await import('./editor-js-color-tool')).default
        const MarkerTool = (await import('./editor-js-marker-tool')).default

        if (!isSubscribed || !holderRef.current) return

        const editor = new EditorJS({
          holder: holderRef.current,
          data: dataRef.current || { blocks: [] },
          placeholder: placeholder || 'Escribe aquí tu contenido...',
          i18n: i18nConfig,
          minHeight: 60,
          tools: {
            titulo1: {
              class: Titulos.Titulo1,
              inlineToolbar: true
            },
            titulo2: {
              class: Titulos.Titulo2,
              inlineToolbar: true
            },
            titulo3: {
              class: Titulos.Titulo3,
              inlineToolbar: true
            },
            titulo4: {
              class: Titulos.Titulo4,
              inlineToolbar: true
            },
            list: {
              class: List,
              inlineToolbar: true,
              config: {
                defaultStyle: 'unordered'
              }
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: 'Escribe una cita...',
                captionPlaceholder: 'Autor...'
              }
            },
            image: {
              class: ImageTool as any,
              config: {
                uploader: createMediaUploader('image', 'news'),
                libraryPicker: {
                  enabled: true,
                  onSelect: async () => {
                    return await openMediaPickerModal('image')
                  }
                }
              }
            },
            paragraph: {
              class: Paragraph as any,
              inlineToolbar: true
            },
            embed: {
              class: Embed,
              inlineToolbar: true,
              config: {
                services: {
                  youtube: true,
                  vimeo: true,
                  coub: true,
                  facebook: true,
                  instagram: true,
                  twitter: true,
                  tiktok: true,
                  pinterest: true,
                  codepen: true,
                  spotify: true,
                  soundcloud: true,
                }
              }
            },
            videoLocal: {
              class: VideoTool as any,
              config: {
                uploader: createMediaUploader('video', 'videos'),
                libraryPicker: {
                  enabled: true,
                  onSelect: async () => {
                    return await openMediaPickerModal('video')
                  }
                }
              }
            },
            audioLocal: {
              class: AudioTool as any,
              config: {
                uploader: createMediaUploader('audio', 'audio'),
                libraryPicker: {
                  enabled: true,
                  onSelect: async () => {
                    return await openMediaPickerModal('audio')
                  }
                }
              }
            },
            marker: {
              class: Marker
            },
            markerColor: {
              class: MarkerTool as any,
              config: {
                colors: MARKER_COLORS
              }
            },
            textColor: {
              class: ColorTool as any,
              config: {
                colors: TEXT_COLORS
              }
            },
            link: {
              class: Link,
              inlineToolbar: true
            },
            underline: {
              class: Underline
            },
            strikethrough: {
              class: Strikethrough
            }
          },
          onChange: () => {
            saveData()
          },
          onReady: () => {
            if (isSubscribed) {
              setIsReady(true)
            }
          }
        })

        if (isSubscribed) {
          editorRef.current = editor
        } else {
          try {
            editor.destroy()
          } catch {}
        }
      } catch (error) {
        console.error('Failed to initialize Editor.js:', error)
      }
    }

    initEditor()

    return () => {
      isSubscribed = false
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        try {
          editorRef.current.destroy()
        } catch {}
        editorRef.current = null
        setIsReady(false)
      }
    }
  }, [mounted, saveData, placeholder])

  if (!mounted) {
    return (
      <div className="min-h-[400px] border rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center">
        <span className="text-muted-foreground">Cargando editor...</span>
      </div>
    )
  }

  return (
    <div className="prose-editor-wrapper">
      <div
        ref={holderRef}
        className="min-h-[400px] border rounded-lg bg-white dark:bg-gray-900"
      />
    </div>
  )
}

// Helper to convert EditorJS data to plain text
export function editorDataToText(data: any): string {
  if (!data || !data.blocks) return ''
  
  return data.blocks.map((block: any) => {
    switch (block.type) {
      case 'paragraph':
        return block.data.text?.replace(/<[^>]*>/g, '') || ''
      case 'header':
        return block.data.text || ''
      case 'titulo1':
      case 'titulo2':
      case 'titulo3':
      case 'titulo4':
        return block.data.text || ''
      case 'list':
        return (block.data.items || []).map((item: string) => `• ${item.replace(/<[^>]*>/g, '')}`).join('\n')
      case 'quote':
        return `${block.data.text || ''}${block.data.caption ? ` — ${block.data.caption}` : ''}`
      case 'embed':
        return block.data.caption || block.data.source || ''
      case 'videoLocal':
        return block.data.caption || '[Video]'
      case 'audioLocal':
        return block.data.title || block.data.caption || '[Audio]'
      case 'image':
        return block.data.caption || '[Imagen]'
      default:
        return ''
    }
  }).filter(Boolean).join('\n\n')
}

// Helper to render EditorJS data in frontend
export function renderEditorBlocks(blocks: any[]) {
  if (!blocks || blocks.length === 0) return null

  return blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p 
            key={index} 
            className="text-lg leading-relaxed text-muted-foreground mb-6"
            style={{ textAlign: 'justify', textWrap: 'pretty' }}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
          />
        )
      case 'header':
        const level = block.data.level || 2
        if (level === 1) {
          return (
            <h1 
              key={index} 
              className="text-4xl font-bold mt-10 mb-4 text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
            />
          )
        }
        if (level === 2) {
          return (
            <h2 
              key={index} 
              className="text-3xl font-bold mt-8 mb-3 text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
            />
          )
        }
        if (level === 3) {
          return (
            <h3 
              key={index} 
              className="text-2xl font-semibold mt-6 mb-2 text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
            />
          )
        }
        if (level === 4) {
          return (
            <h4 
              key={index} 
              className="text-xl font-semibold mt-4 mb-2 text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
            />
          )
        }
        if (level === 5) {
          return (
            <h5 
              key={index} 
              className="text-lg font-semibold mt-4 mb-2 text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
            />
          )
        }
        return (
          <h6 
            key={index} 
            className="text-base font-semibold mt-4 mb-2 text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
          />
        )
      case 'titulo1':
        return (
          <h1 
            key={index} 
            className="text-4xl font-bold mt-10 mb-4 text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
          />
        )
      case 'titulo2':
        return (
          <h2 
            key={index} 
            className="text-3xl font-bold mt-8 mb-3 text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
          />
        )
      case 'titulo3':
        return (
          <h3 
            key={index} 
            className="text-2xl font-semibold mt-6 mb-2 text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
          />
        )
      case 'titulo4':
        return (
          <h4 
            key={index} 
            className="text-xl font-semibold mt-4 mb-2 text-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }}
          />
        )
      case 'list':
        const items = block.data.items || []
        if (block.data.style === 'ordered') {
          return (
            <ol key={index} className="my-6 space-y-2 list-decimal list-inside">
              {items.map((item: string, i: number) => (
                <li key={i} className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }} />
              ))}
            </ol>
          )
        }
        return (
          <ul key={index} className="my-6 space-y-2 list-disc list-inside">
            {items.map((item: string, i: number) => (
              <li key={i} className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(item) }} />
            ))}
          </ul>
        )
      case 'image':
        return (
          <figure key={index} className="my-8">
            <div className="relative rounded-xl overflow-hidden">
              <img 
                src={block.data.file?.url || block.data.url} 
                alt={block.data.caption || ''} 
                className="w-full h-auto"
              />
            </div>
            {block.data.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        )
      case 'quote':
        return (
          <blockquote key={index} className="my-8 pl-6 border-l-4 border-primary bg-muted/30 py-4 pr-4 rounded-r-lg">
            <p className="text-xl italic text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.data.text || '') }} />
            {block.data.caption && (
              <cite className="block mt-2 text-sm text-muted-foreground not-italic">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        )
      case 'embed':
        const embedData = block.data || {}
        if (embedData.embed || embedData.source) {
          return (
            <div key={index} className="my-8">
              <div 
                className="relative w-full rounded-xl overflow-hidden bg-muted"
                style={{ paddingBottom: embedData.height && embedData.width ? `${(embedData.height / embedData.width) * 100}%` : '56.25%' }}
              >
                <iframe
                  src={embedData.embed || ''}
                  width={embedData.width || 580}
                  height={embedData.height || 320}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerPolicy="no-referrer"
                />
              </div>
              {embedData.caption && (
                <p className="text-center text-sm text-muted-foreground mt-3 italic">
                  {embedData.caption}
                </p>
              )}
            </div>
          )
        }
        return null
      case 'videoLocal':
        const videoData = block.data || {}
        if (videoData.url) {
          return (
            <figure key={index} className="my-8">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  controls
                  muted={videoData.muted}
                  className="w-full h-auto"
                  preload="metadata"
                >
                  <source src={videoData.url} />
                  Tu navegador no soporta videos HTML5.
                </video>
              </div>
              {videoData.caption && (
                <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                  {videoData.caption}
                </figcaption>
              )}
            </figure>
          )
        }
        return null
      case 'audioLocal':
        const audioData = block.data || {}
        if (audioData.url) {
          return (
            <figure key={index} className="my-8">
              <div className="bg-muted rounded-xl p-4">
                {audioData.title && (
                  <p className="font-semibold text-foreground mb-2">{audioData.title}</p>
                )}
                <audio
                  controls
                  className="w-full"
                  preload="metadata"
                  src={audioData.url}
                  onError={(e) => {
                    console.error('Audio loading error:', e)
                    console.log('Audio URL:', audioData.url)
                  }}
                  onLoadStart={() => {
                    console.log('Audio loading started:', audioData.url)
                  }}
                >
                  Tu navegador no soporta audio HTML5.
                </audio>
              </div>
              {audioData.caption && (
                <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                  {audioData.caption}
                </figcaption>
              )}
            </figure>
          )
        }
        return null
      default:
        return null
    }
  })
}
