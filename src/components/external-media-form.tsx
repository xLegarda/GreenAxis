'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ExternalLink, Plus, AlertTriangle, CheckCircle, Video, Music, Image } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface ExternalMediaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

/**
 * Determine media type from URL
 */
function getMediaTypeFromUrl(url: string): 'image' | 'video' | 'audio' {
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
 * Extract filename from URL
 */
function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop() || 'archivo'
    return filename.split('.')[0] // Remove extension
  } catch {
    return 'archivo-externo'
  }
}

/**
 * Validate if URL is from Cloudinary
 */
function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com')
}

export function ExternalMediaForm({ open, onOpenChange, onSuccess }: ExternalMediaFormProps) {
  const [formData, setFormData] = useState({
    url: '',
    label: '',
    description: '',
    category: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [urlAnalysis, setUrlAnalysis] = useState<{
    type: 'image' | 'video' | 'audio'
    filename: string
    isCloudinary: boolean
  } | null>(null)

  // Analyze URL when it changes
  React.useEffect(() => {
    if (formData.url.trim()) {
      const type = getMediaTypeFromUrl(formData.url)
      const filename = getFilenameFromUrl(formData.url)
      const isCloudinary = isCloudinaryUrl(formData.url)
      
      setUrlAnalysis({ type, filename, isCloudinary })
      
      // Auto-fill label if empty
      if (!formData.label) {
        setFormData(prev => ({ ...prev, label: filename }))
      }
    } else {
      setUrlAnalysis(null)
    }
  }, [formData.url, formData.label])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.url.trim()) {
      toast({ title: 'Error', description: 'La URL es requerida', variant: 'destructive' })
      return
    }

    if (!formData.label.trim()) {
      toast({ title: 'Error', description: 'El nombre es requerido', variant: 'destructive' })
      return
    }

    setLoading(true)

    try {
      // Generate a unique key for the external media
      const timestamp = Date.now()
      const key = `external-${timestamp}-${Math.random().toString(36).substring(2, 8)}`

      const response = await fetch('/api/admin/media/external', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          url: formData.url.trim(),
          label: formData.label.trim(),
          description: formData.description.trim() || null,
          category: formData.category || 'general'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al registrar archivo')
      }

      toast({ 
        title: 'Archivo registrado', 
        description: 'El archivo externo se agregó a la biblioteca correctamente' 
      })

      // Reset form
      setFormData({
        url: '',
        label: '',
        description: '',
        category: 'general'
      })
      setUrlAnalysis(null)

      // Close dialog and refresh
      onOpenChange(false)
      onSuccess?.()

    } catch (error) {
      console.error('Error registering external media:', error)
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Error al registrar archivo',
        variant: 'destructive' 
      })
    } finally {
      setLoading(false)
    }
  }

  const getMediaIcon = (type: 'image' | 'video' | 'audio') => {
    switch (type) {
      case 'video': return Video
      case 'audio': return Music
      default: return Image
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Registrar archivo externo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">URL del archivo *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://res.cloudinary.com/tu-cloud/video/upload/..."
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Pega aquí la URL del archivo subido a Cloudinary o cualquier plataforma externa
            </p>
          </div>

          {/* URL Analysis */}
          {urlAnalysis && (
            <Card className="p-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getMediaIcon(urlAnalysis.type)
                  return <Icon className="h-5 w-5 text-muted-foreground" />
                })()}
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {urlAnalysis.type === 'video' && 'Video detectado'}
                    {urlAnalysis.type === 'audio' && 'Audio detectado'}
                    {urlAnalysis.type === 'image' && 'Imagen detectada'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Archivo: {urlAnalysis.filename}
                  </p>
                </div>
                {urlAnalysis.isCloudinary ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs">Cloudinary</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Externo</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Label Input */}
          <div className="space-y-2">
            <Label htmlFor="label">Nombre del archivo *</Label>
            <Input
              id="label"
              placeholder="Mi video importante"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              required
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descripción del archivo..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="news">Noticias</SelectItem>
                <SelectItem value="services">Servicios</SelectItem>
                <SelectItem value="config">Configuración</SelectItem>
                <SelectItem value="carousel">Carrusel</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Importante:</strong> Este formulario solo registra la URL en tu biblioteca. 
              El archivo debe estar previamente subido a Cloudinary u otra plataforma externa.
            </AlertDescription>
          </Alert>
        </form>

        <DialogFooter className="gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || !formData.url.trim() || !formData.label.trim()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {loading ? 'Registrando...' : 'Registrar archivo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ExternalMediaForm