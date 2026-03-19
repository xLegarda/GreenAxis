'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, ImageIcon, Video, Music, AlertTriangle, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MediaCard, type MediaItem } from './media-card'
import { MediaPreviewModal } from './media-preview-modal'
import { MediaLibraryBrowser } from './media-library-browser'

/**
 * MediaPicker Component
 * 
 * Unified component for selecting media from library or uploading new files.
 * Supports images, videos, and audio files.
 * 
 * Requirements: 1.1, 2.1, 12.1-12.6
 */

interface MediaPickerProps {
  value: string
  onChange: (url: string) => void
  accept?: 'image' | 'video' | 'audio' | 'all'
  category?: string
  keyPrefix?: string
  fixedKey?: string
  recommendedSize?: string
  formatHint?: string
  maxSizeMB?: number
  showLibrary?: boolean
  showUpload?: boolean
}



interface DuplicateSuggestion {
  id: string
  label: string
  url: string
  category: string | null
  key: string
}

interface MediaPickerState {
  activeTab: 'library' | 'upload'
  mediaItems: MediaItem[]
  loading: boolean
  uploading: boolean
  uploadProgress: number
  searchQuery: string
  selectedCategory: string | null
  page: number
  hasMore: boolean
  error: string | null
  duplicateWarning: {
    file: File
    suggestions: DuplicateSuggestion[]
  } | null
  isDragging: boolean
  previewItem: MediaItem | null
}

/**
 * Helper function to determine media type from URL
 */
function getMediaType(url: string): 'image' | 'video' | 'audio' {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogg']
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac']
  
  const lowerUrl = url.toLowerCase()
  
  if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) {
    return 'video'
  }
  if (audioExtensions.some(ext => lowerUrl.endsWith(ext))) {
    return 'audio'
  }
  return 'image'
}

/**
 * Helper function to get icon for media type
 */
function getMediaIcon(type: 'image' | 'video' | 'audio') {
  switch (type) {
    case 'video':
      return Video
    case 'audio':
      return Music
    default:
      return ImageIcon
  }
}

export function MediaPicker({
  value,
  onChange,
  accept = 'all',
  category = 'general',
  keyPrefix = 'media',
  fixedKey,
  recommendedSize,
  formatHint,
  maxSizeMB = 50,
  showLibrary = true,
  showUpload = true
}: MediaPickerProps) {
  // State management
  const [state, setState] = useState<MediaPickerState>({
    activeTab: 'library',
    mediaItems: [],
    loading: false,
    uploading: false,
    uploadProgress: 0,
    searchQuery: '',
    selectedCategory: null,
    page: 1,
    hasMore: false,
    error: null,
    duplicateWarning: null,
    isDragging: false,
    previewItem: null
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Fetch media items when library tab is active
  useEffect(() => {
    if (state.activeTab === 'library' && showLibrary) {
      fetchMediaItems()
    }
  }, [state.activeTab, state.searchQuery, state.selectedCategory, state.page])

  /**
   * Fetch media items from API
   */
  const fetchMediaItems = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: state.page.toString(),
        limit: '50'
      })
      
      if (state.selectedCategory) {
        params.append('category', state.selectedCategory)
      }
      
      if (state.searchQuery) {
        params.append('search', state.searchQuery)
      }
      
      if (accept !== 'all') {
        params.append('type', accept)
      }
      
      const response = await fetch(`/api/admin/media?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        
        // Map response to MediaItem format
        const items: MediaItem[] = data.items.map((item: any) => ({
          ...item,
          type: getMediaType(item.url)
        }))
        
        setState(prev => ({
          ...prev,
          mediaItems: state.page === 1 ? items : [...prev.mediaItems, ...items],
          hasMore: data.pagination.hasMore,
          loading: false
        }))
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
        console.error('Failed to fetch media items:', response.status, errorData)
        setState(prev => ({ ...prev, loading: false }))
      }
    } catch (error) {
      console.error('Error fetching media items:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  /**
   * Handle file upload with progress tracking and duplicate detection
   */
  const handleFileUpload = async (file: File, skipDuplicateCheck = false) => {
    // Validate file size before uploading
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      setState(prev => ({ 
        ...prev, 
        error: `El archivo es demasiado grande (${fileSizeMB} MB) para el plan actual. 

💡 Alternativa: Si no puedes comprimir más el archivo, súbelo directamente a Cloudinary Console (https://console.cloudinary.com) y copia la URL para usarla aquí.`
      }))
      return
    }

    // Reset error state
    setState(prev => ({ ...prev, uploading: true, uploadProgress: 0, error: null }))

    const formData = new FormData()
    formData.append('file', file)
    
    // Use fixedKey if provided, otherwise generate unique key
    const mediaKey = fixedKey || `${keyPrefix}-${Date.now()}`
    formData.append('key', mediaKey)
    formData.append('label', file.name.replace(/\.[^/.]+$/, ''))
    formData.append('category', category)
    
    if (skipDuplicateCheck) {
      formData.append('skipDuplicateCheck', 'true')
    }

    try {
      // Create XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest()
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          setState(prev => ({ ...prev, uploadProgress: percentComplete }))
        }
      })

      // Handle response
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText))
          } else if (xhr.status === 413) {
            // Payload Too Large
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
            reject(new Error(`El archivo es demasiado grande (${fileSizeMB} MB) para el plan actual.

💡 Alternativa: Sube el archivo directamente a Cloudinary Console (https://console.cloudinary.com) y copia la URL para usarla aquí.`))
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              const errorMsg = errorData.error || xhr.responseText || 'Error desconocido'
              const details = errorData.details ? `\n\nDetalles: ${errorData.details}` : ''
              reject(new Error(errorMsg + details))
            } catch {
              reject(new Error(`Error ${xhr.status}: ${xhr.responseText || 'Error al subir archivo'}`))
            }
          }
        })
        xhr.addEventListener('error', () => reject(new Error('Error de red al subir archivo')))
        xhr.addEventListener('abort', () => reject(new Error('Subida cancelada')))
      })

      xhr.open('POST', '/api/upload')
      xhr.send(formData)

      const data = await uploadPromise

      // Check for duplicate warning
      if (!data.success && data.duplicate?.exists) {
        setState(prev => ({ 
          ...prev, 
          uploading: false,
          uploadProgress: 0,
          duplicateWarning: {
            file,
            suggestions: data.duplicate.suggestions
          }
        }))
        return
      }

      // Success - update with new URL
      if (data.success) {
        onChange(data.url)
        setState(prev => ({ 
          ...prev, 
          uploading: false,
          uploadProgress: 100,
          error: null
        }))
        
        // Refresh library if on library tab
        if (state.activeTab === 'library') {
          fetchMediaItems()
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al subir archivo. Por favor, intenta de nuevo.'
      
      setState(prev => ({ 
        ...prev, 
        uploading: false,
        uploadProgress: 0,
        error: errorMessage
      }))
    }
  }

  /**
   * Handle file input change
   */
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFileUpload(file)
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Handle drag and drop events
   */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState(prev => ({ ...prev, isDragging: true }))
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set isDragging to false if leaving the drop zone entirely
    if (e.currentTarget === dropZoneRef.current) {
      setState(prev => ({ ...prev, isDragging: false }))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState(prev => ({ ...prev, isDragging: false }))

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      
      // Validate file type
      const acceptAttr = getAcceptAttribute()
      const acceptedTypes = acceptAttr.split(',').map(t => t.trim())
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0]
          return file.type.startsWith(category + '/')
        }
        return file.type === type
      })

      if (!isAccepted) {
        setState(prev => ({ 
          ...prev, 
          error: 'Tipo de archivo no permitido. Por favor, selecciona un archivo válido.'
        }))
        return
      }

      await handleFileUpload(file)
    }
  }

  /**
   * Handle duplicate warning - use existing file
   */
  const handleUseExisting = (suggestion: DuplicateSuggestion) => {
    onChange(suggestion.url)
    setState(prev => ({ ...prev, duplicateWarning: null }))
  }

  /**
   * Handle duplicate warning - upload anyway
   */
  const handleUploadAnyway = async () => {
    if (!state.duplicateWarning) return
    const { file } = state.duplicateWarning
    setState(prev => ({ ...prev, duplicateWarning: null }))
    await handleFileUpload(file, true)
  }

  /**
   * Handle duplicate warning - cancel
   */
  const handleCancelUpload = () => {
    setState(prev => ({ ...prev, duplicateWarning: null }))
  }

  /**
   * Handle media selection
   */
  const handleSelectMedia = (item: MediaItem) => {
    onChange(item.url)
  }

  /**
   * Handle media deletion
   * Requirements: 12.6
   */
  const handleDeleteMedia = (item: MediaItem) => {
    // Remove from local state
    setState(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.filter(i => i.id !== item.id)
    }))
  }

  /**
   * Handle media update
   * Requirements: 12.6
   */
  const handleUpdateMedia = (item: MediaItem) => {
    // Update in local state
    setState(prev => ({
      ...prev,
      mediaItems: prev.mediaItems.map(i => i.id === item.id ? item : i)
    }))
  }

  /**
   * Handle info button click
   * Requirements: 12.1, 12.2
   */
  const handleInfoClick = (item: MediaItem) => {
    setState(prev => ({ ...prev, previewItem: item }))
  }

  /**
   * Get accept attribute for file input based on accept prop
   */
  const getAcceptAttribute = () => {
    switch (accept) {
      case 'image':
        return 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
      case 'video':
        return 'video/mp4,video/webm,video/quicktime,video/x-msvideo'
      case 'audio':
        return 'audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/aac'
      default:
        return 'image/*,video/*,audio/*'
    }
  }

  // Determine which tabs to show
  const defaultTab = showLibrary ? 'library' : 'upload'

  return (
    <div className="space-y-4">
      {/* Current selection preview */}
      {value && (
        <Card className="p-4">
          <div className="flex items-center gap-3">
            {(() => {
              const type = getMediaType(value)
              const Icon = getMediaIcon(type)
              return (
                <>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{value}</p>
                    <p className="text-xs text-muted-foreground">Archivo seleccionado</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange('')}
                  >
                    Limpiar
                  </Button>
                </>
              )
            })()}
          </div>
        </Card>
      )}

      {/* Format recommendations */}
      {(recommendedSize || formatHint) && (
        <Card className="p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="text-sm">
            {recommendedSize && (
              <p className="font-medium text-blue-700 dark:text-blue-300">
                Tamaño recomendado: {recommendedSize}
              </p>
            )}
            {formatHint && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {formatHint}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Tabbed interface */}
      <Tabs 
        value={state.activeTab} 
        onValueChange={(tab) => setState(prev => ({ ...prev, activeTab: tab as 'library' | 'upload' }))}
        defaultValue={defaultTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          {showLibrary && (
            <TabsTrigger value="library" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Biblioteca
            </TabsTrigger>
          )}
          {showUpload && (
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Subir Nuevo
            </TabsTrigger>
          )}
        </TabsList>

        {/* Library Tab */}
        {showLibrary && (
          <TabsContent value="library" className="mt-4">
            <Card className="p-4">
              {state.loading && state.mediaItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Cargando biblioteca...
                </div>
              ) : state.mediaItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay archivos en la biblioteca
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Media grid using MediaCard component */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {state.mediaItems.map((item) => (
                      <MediaCard
                        key={item.id}
                        item={item}
                        isSelected={value === item.url}
                        onSelect={handleSelectMedia}
                        onDelete={handleDeleteMedia}
                        onInfo={handleInfoClick}
                        showActions={true}
                      />
                    ))}
                  </div>

                  {/* Load more button */}
                  {state.hasMore && (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => setState(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={state.loading}
                      >
                        {state.loading ? 'Cargando...' : 'Cargar más'}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        )}

        {/* Upload Tab */}
        {showUpload && (
          <TabsContent value="upload" className="mt-4">
            <Card className="p-6">
              {/* Error display */}
              {state.error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>{state.error}</p>
                    {state.error.includes('Cloudinary') && (
                      <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                        <p className="font-medium text-blue-700 dark:text-blue-300">💡 Alternativa para archivos grandes:</p>
                        <ol className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1">
                          <li>1. Ve a <a href="https://console.cloudinary.com" target="_blank" rel="noopener" className="underline">Cloudinary Console</a></li>
                          <li>2. Sube tu archivo en "Media Library"</li>
                          <li>3. Copia la URL del archivo</li>
                          <li>4. Úsala directamente en tu contenido</li>
                        </ol>
                      </div>
                    )}
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setState(prev => ({ ...prev, error: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              )}

              {/* Upload progress */}
              {state.uploading && (
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subiendo archivo...</span>
                    <span className="font-medium">{state.uploadProgress}%</span>
                  </div>
                  <Progress value={state.uploadProgress} className="h-2" />
                </div>
              )}

              {/* Drag and drop zone */}
              <div
                ref={dropZoneRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  state.isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-muted-foreground/25 hover:border-primary/50'
                } ${state.uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptAttribute()}
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="media-upload"
                  disabled={state.uploading}
                />
                <label
                  htmlFor="media-upload"
                  className={`cursor-pointer ${state.uploading ? 'pointer-events-none' : ''}`}
                >
                  <Upload className={`h-12 w-12 mx-auto mb-3 ${
                    state.isDragging ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="text-sm font-medium mb-2">
                    {state.isDragging 
                      ? 'Suelta el archivo aquí' 
                      : state.uploading 
                        ? 'Subiendo archivo...' 
                        : 'Arrastra un archivo o haz clic para seleccionar'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {accept === 'image' && 'Imágenes: JPG, PNG, WebP, GIF, SVG (máx. 5MB)'}
                    {accept === 'video' && 'Videos: MP4, WebM, MOV (máx. 25MB en producción)'}
                    {accept === 'audio' && 'Audio: MP3, WAV, OGG, M4A (máx. 15MB en producción)'}
                    {accept === 'all' && 'Imágenes (5MB), videos (25MB) y audio (15MB) en producción'}
                  </p>
                </label>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Duplicate warning dialog */}
      <Dialog open={!!state.duplicateWarning} onOpenChange={(open) => !open && handleCancelUpload()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Archivo similar encontrado
            </DialogTitle>
            <DialogDescription>
              Ya existen archivos con nombres similares en la biblioteca. ¿Deseas usar uno de los archivos existentes o continuar con la subida?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <p className="text-sm font-medium">Archivos similares:</p>
            {state.duplicateWarning?.suggestions.map((suggestion) => (
              <Card 
                key={suggestion.id}
                className="p-3 cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleUseExisting(suggestion)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {getMediaType(suggestion.url) === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={suggestion.url}
                        alt={suggestion.label}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      (() => {
                        const Icon = getMediaIcon(getMediaType(suggestion.url))
                        return <Icon className="h-8 w-8 text-muted-foreground" />
                      })()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{suggestion.label}</p>
                    {suggestion.category && (
                      <p className="text-xs text-muted-foreground">
                        Categoría: {suggestion.category}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    Usar este
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancelUpload}>
              Cancelar
            </Button>
            <Button onClick={handleUploadAnyway}>
              Subir archivo nuevo de todas formas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Preview Modal - Requirements: 12.1-12.6 */}
      <MediaPreviewModal
        item={state.previewItem}
        open={!!state.previewItem}
        onOpenChange={(open) => !open && setState(prev => ({ ...prev, previewItem: null }))}
        onDelete={handleDeleteMedia}
        onUpdate={handleUpdateMedia}
      />
    </div>
  )
}
