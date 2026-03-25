'use client'

import { useState, useEffect } from 'react'
import { Upload, ImageIcon, Trash2, X, Check, AlertTriangle, Video, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

interface ImageSelectorProps {
  value?: string
  onChange: (url: string) => void
  category?: string
  keyPrefix?: string
  /** Key fija para sobrescribir imagen anterior al subir una nueva */
  fixedKey?: string
  recommendedSize?: string
  /** Additional help text for image format */
  formatHint?: string
}

interface SiteImage {
  id: string
  key: string
  label: string
  url: string
  category?: string
  createdAt: string
}

// Helper to detect if URL is a video
function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogg']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

export function ImageSelector({ 
  value, 
  onChange, 
  category = 'general', 
  keyPrefix = 'img',
  fixedKey,
  recommendedSize,
  formatHint
}: ImageSelectorProps) {
  const [activeTab, setActiveTab] = useState('upload')
  const [images, setImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<SiteImage | null>(null)

  useEffect(() => {
    if (activeTab === 'library') {
      fetchImages()
    }
  }, [activeTab, category])

  const fetchImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/images')
      if (response.ok) {
        const data = await response.json()
        // Filtrar por categoría si se especifica
        const filtered = category 
          ? data.filter((img: SiteImage) => img.category === category || !img.category)
          : data
        setImages(filtered)
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const imageKey = fixedKey || `${keyPrefix}-${Date.now()}`
    const label = file.name.replace(/\.[^/.]+$/, '')

    try {
      const { openCloudinaryUpload } = await import('@/lib/cloudinary-upload')
      const url = await openCloudinaryUpload({ folder: 'green-axis', resourceType: 'auto' })

      if (!url) {
        setUploading(false)
        return
      }

      await fetch('/api/upload/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: imageKey, url, label, category }),
      })

      onChange(url)
      toast({ title: 'Archivo subido correctamente' })
    } catch (error) {
      toast({ title: 'Error al subir archivo', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async (image: SiteImage) => {
    try {
      const response = await fetch(`/api/admin/images?id=${image.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setImages(images.filter(img => img.id !== image.id))
        // Si la imagen eliminada era la seleccionada, limpiar
        if (value === image.url) {
          onChange('')
        }
        toast({ title: isVideoUrl(image.url) ? 'Video eliminado correctamente' : 'Imagen eliminada correctamente' })
      } else {
        toast({ 
          title: 'Error al eliminar', 
          variant: 'destructive' 
        })
      }
    } catch (error) {
      toast({ 
        title: 'Error al eliminar', 
        variant: 'destructive' 
      })
    } finally {
      setDeleteConfirm(null)
    }
  }

  const selectedIsVideo = value ? isVideoUrl(value) : false

  return (
    <div className="space-y-3">
      {/* Preview de imagen/video seleccionado */}
      {value && (
        <div className="relative inline-block">
          <div className="relative rounded-lg overflow-hidden border bg-muted">
            {selectedIsVideo ? (
              <video 
                src={value} 
                className="max-h-48 w-auto"
                controls
                muted
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={value} 
                alt="Imagen seleccionada" 
                className="max-h-48 w-auto object-contain"
              />
            )}
            <button
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Info de formato recomendado */}
      {(recommendedSize || formatHint) && (
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-blue-700 dark:text-blue-300">
            {recommendedSize && (
              <p className="font-medium">Tamaño recomendado: {recommendedSize}</p>
            )}
            {formatHint && (
              <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">{formatHint}</p>
            )}
          </div>
        </div>
      )}

      {/* Selector de imagen/video */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          {/* ORDEN INVERTIDO: Subir Nueva primero */}
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Subir Nuevo
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Biblioteca
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label 
              htmlFor="image-upload" 
              className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium">
                {uploading ? 'Subiendo...' : 'Haz clic para subir archivo'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Imágenes: JPG, PNG, WebP, GIF, SVG
              </p>
              <p className="text-xs text-muted-foreground">
                Videos: MP4, WebM, MOV (máx. 50MB)
              </p>
            </label>
          </div>
        </TabsContent>

        <TabsContent value="library" className="mt-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando...
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay archivos en la biblioteca
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
              {images.map((image) => {
                const isVideo = isVideoUrl(image.url)
                return (
                  <div 
                    key={image.id} 
                    className={`relative group rounded-lg overflow-hidden border bg-muted cursor-pointer transition-all ${
                      value === image.url ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                    }`}
                  >
                    {isVideo ? (
                      <div 
                        className="aspect-square bg-black flex items-center justify-center"
                        onClick={() => onChange(image.url)}
                      >
                        <Video className="h-12 w-12 text-white/60" />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={image.url} 
                        alt={image.label}
                        className="aspect-square object-cover"
                        onClick={() => onChange(image.url)}
                      />
                    )}
                    
                    {/* Overlay con acciones */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => onChange(image.url)}
                        className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                        title="Seleccionar"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteConfirm(image)
                        }}
                        className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Indicador de seleccionado */}
                    {value === image.url && (
                      <div className="absolute top-2 left-2 p-1 bg-primary text-primary-foreground rounded-full">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    
                    {/* Indicador de video */}
                    {isVideo && (
                      <div className="absolute bottom-2 right-2 p-1 bg-black/70 rounded">
                        <Video className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog de confirmación para eliminar */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {deleteConfirm && isVideoUrl(deleteConfirm.url) ? 'Eliminar video' : 'Eliminar imagen'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {deleteConfirm && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  ¿Estás seguro de que deseas eliminar {isVideoUrl(deleteConfirm.url) ? 'este video' : 'esta imagen'}? Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center">
                  {isVideoUrl(deleteConfirm.url) ? (
                    <div className="max-h-32 rounded-lg border bg-black flex items-center justify-center p-4">
                      <Video className="h-12 w-12 text-white/60" />
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={deleteConfirm.url} 
                      alt={deleteConfirm.label}
                      className="max-h-32 rounded-lg border"
                    />
                  )}
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  <strong>{deleteConfirm.label}</strong>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDeleteImage(deleteConfirm)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
