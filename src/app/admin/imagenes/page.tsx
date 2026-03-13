'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Image as ImageIcon, Info, Search, ExternalLink, Copy, Check, AlertTriangle, X, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface SiteImage {
  id: string
  key: string
  label: string
  description: string | null
  url: string
  category: string | null
  createdAt: Date
}

const categoryLabels: Record<string, { label: string; color: string }> = {
  'carousel': { label: 'Carrusel', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  'services': { label: 'Servicios', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'news': { label: 'Noticias', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'gallery': { label: 'Galería', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'hero': { label: 'Principal', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'logo': { label: 'Logo', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  'videos': { label: 'Videos', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

// Helper to detect if URL is a video
function isVideoUrl(url: string): boolean {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv']
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

// Helper to detect if URL is an audio file
function isAudioUrl(url: string): boolean {
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac']
  return audioExtensions.some(ext => url.toLowerCase().endsWith(ext))
}

export default function ImagenesAdminPage() {
  const [images, setImages] = useState<SiteImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<SiteImage | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/imagenes')
      if (response.ok) {
        setImages(await response.json())
      }
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (4.5MB max - Vercel free tier limit)
    const maxSizeBytes = 4.5 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      toast({ 
        title: 'Archivo demasiado grande', 
        description: (
          <div className="space-y-2">
            <p>El archivo ({fileSizeMB} MB) es demasiado grande para el plan actual.</p>
            <p className="text-xs">💡 Alternativa: Sube el archivo directamente a <a href="https://console.cloudinary.com" target="_blank" rel="noopener" className="underline font-medium">Cloudinary</a> y copia la URL para usarla aquí.</p>
          </div>
        ),
        variant: 'destructive' 
      })
      return
    }
    await processFile(file)
  }

  const processFile = async (file: File) => {
    const isVideo = file.type.startsWith('video/')
    const isAudio = file.type.startsWith('audio/')
    
    // Check file size
    const maxSize = (isVideo || isAudio) ? 50 * 1024 * 1024 : 5 * 1024 * 1024 // 50MB for videos/audio, 5MB for images
    if (file.size > maxSize) {
      toast({ 
        title: 'Error', 
        description: `El archivo es muy grande. Máximo ${(isVideo || isAudio) ? '50MB' : '5MB'}.`,
        variant: 'destructive' 
      })
      return
    }

    setUploading(true)
    const uploadData = new FormData()
    uploadData.append('file', file)
    // Solo enviamos el archivo - todo lo demás se genera automáticamente

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })

      if (response.ok) {
        toast({ title: isVideo ? 'Video subido correctamente' : isAudio ? 'Audio subido correctamente' : 'Imagen subida correctamente' })
        fetchImages()
      } else if (response.status === 413) {
        // Payload Too Large
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        toast({ 
          title: 'Archivo demasiado grande', 
          description: (
            <div className="space-y-2">
              <p>El archivo ({fileSizeMB} MB) es demasiado grande para el plan actual.</p>
              <p className="text-xs">💡 Alternativa: Sube el archivo directamente a <a href="https://console.cloudinary.com" target="_blank" rel="noopener" className="underline font-medium">Cloudinary</a> y copia la URL para usarla aquí.</p>
            </div>
          ),
          variant: 'destructive' 
        })
      } else {
        const error = await response.json()
        toast({ title: 'Error al subir archivo', description: error.error, variant: 'destructive' })
      }
    } catch (error) {
      // Handle network errors or other exceptions
      toast({ 
        title: 'Error al subir archivo', 
        description: 'No se pudo conectar con el servidor. Verifica tu conexión.',
        variant: 'destructive' 
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await processFile(files[0])
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/upload?key=${deleteConfirm.key}`, { method: 'DELETE' })
      if (response.ok) {
        setImages(images.filter(img => img.id !== deleteConfirm.id))
        toast({ title: isVideoUrl(deleteConfirm.url) ? 'Video eliminado correctamente' : isAudioUrl(deleteConfirm.url) ? 'Audio eliminado correctamente' : 'Imagen eliminada correctamente' })
      } else {
        toast({ title: 'Error al eliminar', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  const copyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
      toast({ title: 'Key copiada al portapapeles' })
    } catch {
      toast({ title: 'No se pudo copiar', variant: 'destructive' })
    }
  }

  // Filtrar imágenes
  const filteredImages = images.filter(img => {
    const matchesSearch = !searchTerm || 
      img.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || img.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Obtener categorías únicas
  const categories = [...new Set(images.map(img => img.category).filter(Boolean))]

  // Count videos and audio
  const videoCount = images.filter(img => isVideoUrl(img.url)).length
  const audioCount = images.filter(img => isAudioUrl(img.url)).length
  const imageCount = images.length - videoCount - audioCount

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Biblioteca de Archivos</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona todas las imágenes, videos y audios del sitio. Total: {imageCount} imágenes, {videoCount} videos, {audioCount} audios
        </p>
      </div>

      {/* Info Card */}
      <Card className="mb-6 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-3">
              <div>
                <p className="font-medium mb-1">Información sobre archivos:</p>
                <ul className="text-xs space-y-0.5 text-blue-600 dark:text-blue-400">
                  <li>• <strong>Todos los archivos subidos</strong> se guardan automáticamente en esta biblioteca</li>
                  <li>• <strong>Key:</strong> Identificador único para reutilizar el archivo (ej: "hero-background")</li>
                  <li>• Si subes un archivo con una key existente, se reemplazará automáticamente</li>
                  <li>• <strong>Eliminar</strong> un archivo aquí NO lo eliminará del contenido donde se esté usando</li>
                </ul>
              </div>
              
              <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
                <p className="font-medium mb-1">Tamaños recomendados:</p>
                <ul className="text-xs space-y-0.5 text-blue-600 dark:text-blue-400">
                  <li>• <strong>Noticias/Blog:</strong> 1200 x 630 px (proporción 1.9:1 - ideal para redes sociales)</li>
                  <li>• <strong>Carrusel/Hero:</strong> 1920 x 800 px (proporción 2.4:1)</li>
                  <li>• <strong>Servicios:</strong> 800 x 600 px (proporción 4:3)</li>
                  <li>• <strong>Videos:</strong> MP4 o WebM, máximo 25MB en producción</li>
                  <li>• <strong>Audio:</strong> MP3 o WAV, máximo 15MB en producción</li>
                </ul>
              </div>
              
              <div className="border-t border-blue-200 dark:border-blue-800 pt-3">
                <p className="font-medium mb-1">💡 Para archivos más grandes:</p>
                <ul className="text-xs space-y-0.5 text-blue-600 dark:text-blue-400">
                  <li>• Ve a <a href="https://console.cloudinary.com" target="_blank" rel="noopener" className="underline">Cloudinary Console</a></li>
                  <li>• Sube tu archivo en "Media Library"</li>
                  <li>• Copia la URL y úsala directamente en tu contenido</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Form - Simplificado */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subir Nuevo Archivo</CardTitle>
          <CardDescription>Arrastra archivos aquí o haz clic para seleccionar. Se organizarán automáticamente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/m4a"
            className="hidden"
            onChange={handleUpload}
          />
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-2">
              {uploading ? 'Subiendo archivo...' : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <span><strong>Imágenes:</strong> JPG, PNG, WebP, GIF, SVG | Máx. 5MB</span>
              <span><strong>Videos:</strong> MP4, WebM, MOV | Máx. 25MB</span>
              <span><strong>Audio:</strong> MP3, WAV, OGG, M4A | Máx. 15MB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o key..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={selectedCategory === null ? 'bg-[#6BBE45] hover:bg-[#5CAE38]' : ''}
          >
            Todas
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'bg-[#6BBE45] hover:bg-[#5CAE38]' : ''}
            >
              {categoryLabels[cat || '']?.label || cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Images/Videos/Audio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredImages.map((image) => {
          const isVideo = isVideoUrl(image.url)
          const isAudio = isAudioUrl(image.url)
          return (
            <Card key={image.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-accent">
                  {isVideo ? (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <Video className="h-12 w-12 text-white/60" />
                    </div>
                  ) : isAudio ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
                      <audio 
                        src={image.url} 
                        controls 
                        preload="metadata"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <img 
                      src={image.url} 
                      alt={image.label} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open(image.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(image.key)}
                    >
                      {copiedKey === image.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirm(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {image.category && (
                    <div className="absolute top-2 left-2">
                      <Badge className={cn('text-[10px]', categoryLabels[image.category]?.color || 'bg-gray-100 text-gray-700')}>
                        {categoryLabels[image.category]?.label || image.category}
                      </Badge>
                    </div>
                  )}
                  {isVideo && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-500 text-white text-[10px]">
                        Video
                      </Badge>
                    </div>
                  )}
                  {isAudio && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-purple-500 text-white text-[10px]">
                        Audio
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate flex-1">{image.label}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono truncate max-w-[150px]">
                      {image.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => copyToClipboard(image.key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredImages.length === 0 && images.length > 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron archivos con ese criterio</p>
          </div>
        )}

        {images.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay archivos subidos</p>
            <p className="text-sm mt-2">Sube archivos desde el formulario de arriba o desde otras secciones del admin</p>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {deleteConfirm && (isVideoUrl(deleteConfirm.url) ? 'Eliminar video' : isAudioUrl(deleteConfirm.url) ? 'Eliminar audio' : 'Eliminar imagen')}
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El archivo será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          
          {deleteConfirm && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="relative rounded-lg overflow-hidden border bg-muted max-h-48">
                  {isVideoUrl(deleteConfirm.url) ? (
                    <div className="h-48 w-48 bg-black flex items-center justify-center">
                      <Video className="h-16 w-16 text-white/60" />
                    </div>
                  ) : isAudioUrl(deleteConfirm.url) ? (
                    <div className="h-48 w-64 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
                      <audio 
                        src={deleteConfirm.url} 
                        controls 
                        preload="metadata"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <img 
                      src={deleteConfirm.url} 
                      alt={deleteConfirm.label}
                      className="max-h-48 w-auto object-contain"
                    />
                  )}
                </div>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Nombre:</span>
                  <span className="text-sm">{deleteConfirm.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Key:</span>
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {deleteConfirm.key}
                  </code>
                </div>
                {deleteConfirm.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Categoría:</span>
                    <Badge className={cn('text-[10px]', categoryLabels[deleteConfirm.category]?.color || 'bg-gray-100 text-gray-700')}>
                      {categoryLabels[deleteConfirm.category]?.label || deleteConfirm.category}
                    </Badge>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                ¿Estás seguro de que deseas eliminar {isVideoUrl(deleteConfirm.url) ? 'este video' : isAudioUrl(deleteConfirm.url) ? 'este audio' : 'esta imagen'}?
              </p>
            </div>
          )}
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
