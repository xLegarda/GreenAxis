'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ImageIcon, Upload, AlertTriangle, X, ExternalLink } from 'lucide-react'

// Types
interface MediaItem {
  id: string
  key: string
  label: string
  description?: string
  url: string
  category?: string
  type: 'image' | 'video' | 'audio'
  usageCount: number
  createdAt: string
  updatedAt: string
}

interface DuplicateSuggestion {
  id: string
  label: string
  url: string
  category?: string
  key: string
}

interface MediaPickerCompactProps {
  /** Current media URL */
  value?: string
  /** Callback when media selected */
  onChange: (url: string) => void
  /** File type filter */
  accept?: 'image' | 'video' | 'audio' | 'all'
  /** Auto-assign category on upload */
  category?: string
  /** Prefix for generated keys */
  keyPrefix?: string
  /** Fixed key for replacement */
  fixedKey?: string
  /** Display size recommendation */
  recommendedSize?: string
  /** Additional format guidance */
  formatHint?: string
  /** Override default size limit */
  maxSizeMB?: number
  /** Show library tab (default: true) */
  showLibrary?: boolean
  /** Show upload tab (default: true) */
  showUpload?: boolean
}

interface MediaPickerCompactState {
  activeTab: 'library' | 'upload'
  mediaItems: MediaItem[]
  loading: boolean
  uploading: boolean
  uploadProgress: number
  error: string | null
  duplicateWarning: {
    file: File
    suggestions: DuplicateSuggestion[]
  } | null
  isDragging: boolean
}

/**
 * Determine media type from URL extension
 */
function getMediaType(url: string): 'image' | 'video' | 'audio' {
  const extension = url.split('.').pop()?.toLowerCase() || ''
  
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(extension)) {
    return 'video'
  }
  
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'].includes(extension)) {
    return 'audio'
  }
  
  return 'image'
}

/**
 * Compact Media Picker - Optimized for small panels
 * Only loads 4 most recent items to improve performance
 */
function MediaPickerCompact({
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
}: MediaPickerCompactProps) {
  // State management
  const [state, setState] = useState<MediaPickerCompactState>({
    activeTab: 'library',
    mediaItems: [],
    loading: false,
    uploading: false,
    uploadProgress: 0,
    error: null,
    duplicateWarning: null,
    isDragging: false
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Fetch media items when library tab is active
  useEffect(() => {
    if (state.activeTab === 'library' && showLibrary) {
      fetchMediaItems()
    }
  }, [state.activeTab])

  /**
   * Fetch only 4 most recent media items for compact display
   */
  const fetchMediaItems = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      // Build query parameters - OPTIMIZED: Only 4 items
      const params = new URLSearchParams({
        page: '1',
        limit: '4' // ← OPTIMIZED: Only load 4 most recent items
      })
      
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
          mediaItems: items,
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
   * Handle file upload using Cloudinary Upload Widget (direct browser upload)
   */
  const handleFileUpload = async (file: File, skipDuplicateCheck = false) => {
    setState(prev => ({ ...prev, uploading: true, uploadProgress: 0, error: null }))

    const mediaKey = fixedKey || `${keyPrefix}-${Date.now()}`
    const label = file.name.replace(/\.[^/.]+$/, '')

    try {
      // Step 1: Check for duplicates by filename
      if (!skipDuplicateCheck) {
        try {
          const checkRes = await fetch('/api/upload/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ label, key: mediaKey }),
          })
          if (checkRes.ok) {
            const checkData = await checkRes.json()
            if (checkData.duplicate?.exists) {
              setState(prev => ({
                ...prev,
                uploading: false,
                uploadProgress: 0,
                duplicateWarning: { file, suggestions: checkData.duplicate.suggestions },
              }))
              return
            }
          }
        } catch {}
      }

      // Step 2: Upload directly to Cloudinary (no widget popup)
      const { uploadToCloudinaryDirect } = await import('@/lib/cloudinary-direct')

      const uploadResult = await uploadToCloudinaryDirect(file, {
        folder: 'green-axis',
        resourceType: 'auto',
        onProgress: (percent) => setState(prev => ({ ...prev, uploadProgress: percent })),
      })

      const url = uploadResult.secure_url

      // Step 3: Save URL to database
      await fetch('/api/upload/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: mediaKey, url, label, category }),
      })

      onChange(url)
      setState(prev => ({ ...prev, uploading: false, uploadProgress: 100, error: null }))
      if (state.activeTab === 'library') fetchMediaItems()
    } catch (error) {
      console.error('Upload error:', error)
      setState(prev => ({
        ...prev,
        uploading: false,
        uploadProgress: 0,
        error: error instanceof Error ? error.message : 'Error al subir archivo',
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
   * Get accept attribute for file input based on accept prop
   */
  const getAcceptAttribute = () => {
    switch (accept) {
      case 'image':
        return 'image/jpeg,image/png,image/webp,image/gif'
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
    <div className="space-y-3">
      {/* Current selection preview */}
      {value && (
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{value}</p>
              <p className="text-xs text-muted-foreground">Archivo seleccionado</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="h-6 px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Card>
      )}

      {/* Format recommendations */}
      {(recommendedSize || formatHint) && (
        <Card className="p-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="text-xs">
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

      {/* Compact Tabbed interface */}
      <Tabs 
        value={state.activeTab} 
        onValueChange={(tab) => setState(prev => ({ ...prev, activeTab: tab as 'library' | 'upload' }))}
      >
        <TabsList className="grid w-full grid-cols-2 h-8">
          {showLibrary && (
            <TabsTrigger value="library" className="flex items-center gap-1 text-xs">
              <ImageIcon className="h-3 w-3" />
              Biblioteca
            </TabsTrigger>
          )}
          {showUpload && (
            <TabsTrigger value="upload" className="flex items-center gap-1 text-xs">
              <Upload className="h-3 w-3" />
              Subir
            </TabsTrigger>
          )}
        </TabsList>

        {/* Library Tab - COMPACT */}
        {showLibrary && (
          <TabsContent value="library" className="mt-3">
            <Card className="p-3">
              {state.loading ? (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  Cargando...
                </div>
              ) : state.mediaItems.length === 0 ? (
                <div className="text-center py-4 text-xs text-muted-foreground">
                  No hay archivos
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Compact media grid - 2x2 grid for 4 items */}
                  <div className="grid grid-cols-2 gap-2">
                    {state.mediaItems.map((item) => (
                      <div
                        key={item.id}
                        className={`relative group cursor-pointer rounded border-2 transition-colors ${
                          value === item.url 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => handleSelectMedia(item)}
                      >
                        <div className="aspect-square bg-muted rounded flex items-center justify-center overflow-hidden">
                          {item.type === 'image' ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.url}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-2">
                              {item.type === 'video' ? (
                                <div className="text-blue-500">📹</div>
                              ) : (
                                <div className="text-green-500">🎵</div>
                              )}
                              <p className="text-xs mt-1 truncate">{item.label}</p>
                            </div>
                          )}
                        </div>
                        {item.type === 'image' && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-1">
                            <p className="text-xs truncate">{item.label}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Link to full library */}
                  <div className="text-center pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => window.open('/admin/imagenes', '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver biblioteca completa
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        )}

        {/* Upload Tab - COMPACT */}
        {showUpload && (
          <TabsContent value="upload" className="mt-3">
            <Card className="p-4">
              {/* Error display */}
              {state.error && (
                <Alert variant="destructive" className="mb-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="text-sm">Error</AlertTitle>
                  <AlertDescription className="text-xs">
                    <p>{state.error}</p>
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => setState(prev => ({ ...prev, error: null }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Alert>
              )}

              {/* Upload progress */}
              {state.uploading && (
                <div className="mb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Subiendo...</span>
                    <span className="font-medium">{state.uploadProgress}%</span>
                  </div>
                  <Progress value={state.uploadProgress} className="h-1" />
                </div>
              )}

              {/* Compact drag and drop zone */}
              <div
                ref={dropZoneRef}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
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
                  id="media-upload-compact"
                  disabled={state.uploading}
                />
                <label
                  htmlFor="media-upload-compact"
                  className={`cursor-pointer ${state.uploading ? 'pointer-events-none' : ''}`}
                >
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${
                    state.isDragging ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="text-xs font-medium mb-1">
                    {state.isDragging 
                      ? 'Suelta aquí' 
                      : state.uploading 
                        ? 'Subiendo...' 
                        : 'Arrastra o haz clic'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {accept === 'image' && 'JPG, PNG, WebP, GIF'}
                    {accept === 'video' && 'MP4, WebM, MOV'}
                    {accept === 'audio' && 'MP3, WAV, OGG'}
                    {accept === 'all' && 'Imágenes, videos y audio'}
                  </p>
                </label>
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Duplicate warning dialog */}
      <Dialog open={!!state.duplicateWarning} onOpenChange={(open) => !open && handleCancelUpload()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Archivo similar encontrado
            </DialogTitle>
            <DialogDescription className="text-xs">
              Ya existen archivos similares. ¿Usar uno existente o continuar?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3">
            <p className="text-xs font-medium">Archivos similares:</p>
            {state.duplicateWarning?.suggestions.map((suggestion) => (
              <Card 
                key={suggestion.id}
                className="p-2 cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleUseExisting(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                    {getMediaType(suggestion.url) === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={suggestion.url}
                        alt={suggestion.label}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-xs">📁</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{suggestion.label}</p>
                    {suggestion.category && (
                      <p className="text-xs text-muted-foreground">
                        {suggestion.category}
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-6">
                    Usar
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleCancelUpload} className="text-xs h-7">
              Cancelar
            </Button>
            <Button onClick={handleUploadAnyway} className="text-xs h-7">
              Subir nuevo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MediaPickerCompact