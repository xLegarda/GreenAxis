'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Save, Link, Palette, Sparkles, ImagePlus, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { MediaPicker } from '@/components/media-picker'

interface CarouselSlide {
  id: string
  title: string | null
  subtitle: string | null
  description: string | null
  imageUrl: string
  buttonText: string | null
  buttonUrl: string | null
  linkUrl: string | null
  gradientEnabled: boolean | null
  animationEnabled: boolean | null
  gradientColor: string | null
  order: number
  active: boolean
}

export default function CarruselAdminPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    buttonText: '',
    buttonUrl: '',
    linkUrl: '',
    gradientEnabled: true,
    animationEnabled: true,
    gradientColor: '',
    active: true,
  })

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/carrusel')
      if (response.ok) {
        setSlides(await response.json())
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.imageUrl) {
      toast({ title: 'Error', description: 'La imagen es requerida', variant: 'destructive' })
      return
    }

    try {
      const url = '/api/carrusel'
      const method = editingSlide ? 'PUT' : 'POST'
      const body = editingSlide 
        ? { ...formData, id: editingSlide.id, order: editingSlide.order }
        : { ...formData, order: slides.length }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({ title: editingSlide ? 'Slide actualizado' : 'Slide creado' })
        setDialogOpen(false)
        setEditingSlide(null)
        resetForm()
        fetchSlides()
      }
    } catch (error) {
      toast({ title: 'Error al guardar', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este slide?')) return
    try {
      await fetch(`/api/carrusel?id=${id}`, { method: 'DELETE' })
      toast({ title: 'Slide eliminado' })
      fetchSlides()
    } catch (error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      buttonText: '',
      buttonUrl: '',
      linkUrl: '',
      gradientEnabled: true,
      animationEnabled: true,
      gradientColor: '',
      active: true,
    })
  }

  const openEditDialog = (slide: CarouselSlide) => {
    setEditingSlide(slide)
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText || '',
      buttonUrl: slide.buttonUrl || '',
      linkUrl: slide.linkUrl || '',
      gradientEnabled: slide.gradientEnabled !== false,
      animationEnabled: slide.animationEnabled !== false,
      gradientColor: slide.gradientColor || '',
      active: slide.active,
    })
    setDialogOpen(true)
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Carrusel Principal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Slides que aparecen en la página de inicio
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setEditingSlide(null); setDialogOpen(true); }} 
          className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Slide
        </Button>
      </div>

      {/* Info Card */}
      <Card className="mb-6 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Recomendaciones para imágenes del carrusel:</p>
            <ul className="text-xs space-y-0.5 text-blue-600 dark:text-blue-400">
              <li>• <strong>Tamaño ideal:</strong> 1920 x 700 píxeles (proporción 2.7:1)</li>
              <li>• <strong>Formato:</strong> JPG o WebP (PNG para transparencias)</li>
              <li>• <strong>Peso máximo:</strong> 2 MB por imagen</li>
              <li>• <strong>Importante:</strong> El contenido importante debe estar a la izquierda (60% del ancho)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Slides List */}
      <div className="space-y-3">
        {slides.map((slide, index) => (
          <Card key={slide.id} className={!slide.active ? 'opacity-60' : ''}>
            <CardContent className="p-4 flex items-center gap-4">
              {/* Preview */}
              <div className="w-56 h-32 rounded-lg overflow-hidden bg-accent shrink-0 relative">
                <img src={slide.imageUrl} alt={slide.title || ''} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-medium">
                  #{index + 1}
                </div>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {!slide.gradientEnabled && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Sin gradiente</Badge>
                  )}
                  {!slide.animationEnabled && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Sin animación</Badge>
                  )}
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{slide.title || 'Sin título'}</h3>
                  {!slide.active && (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                  {slide.linkUrl && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <Link className="h-3 w-3 mr-1" />
                      Con link
                    </Badge>
                  )}
                </div>
                {slide.subtitle && (
                  <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  {slide.buttonText && <span>Botón: {slide.buttonText}</span>}
                  {slide.gradientColor && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: `#${slide.gradientColor}` }} />
                      Color: #{slide.gradientColor}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(slide)} title="Editar">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(slide.id)} title="Eliminar" className="hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {slides.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No hay slides en el carrusel</p>
              <Button onClick={() => { resetForm(); setDialogOpen(true); }} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer slide
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingSlide ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingSlide ? 'Editar Slide' : 'Nuevo Slide'}
            </DialogTitle>
            <DialogDescription>
              Configura la imagen, textos y efectos del slide.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Image Upload */}
            <div className="space-y-3">
              <Label>Imagen del Slide *</Label>
              
              <MediaPicker
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                accept="image"
                category="carousel"
                keyPrefix={editingSlide ? `carousel-${editingSlide.id}` : 'carousel-new'}
                recommendedSize="1920x700px"
                formatHint="Proporción 2.7:1 - El contenido importante debe estar a la izquierda (60% del ancho)"
                maxSizeMB={5}
              />
            </div>

            {/* Text Content */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título principal del slide"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Texto secundario"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Texto descriptivo que aparece bajo el título"
              />
            </div>

            {/* Links */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Enlaces (opcionales)
              </Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Texto del botón</Label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Conoce más"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">URL del botón</Label>
                  <Input
                    value={formData.buttonUrl}
                    onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                    placeholder="/servicios"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Link completo del slide (click en imagen/título)</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://... o /pagina (opcional)"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Si se configura, todo el slide será clickeable y llevará a esta URL
                </p>
              </div>
            </div>

            {/* Effects */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Efectos visuales
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Degradado</Label>
                    <p className="text-xs text-muted-foreground">Overlay oscuro sobre la imagen</p>
                  </div>
                  <Switch
                    checked={formData.gradientEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, gradientEnabled: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Animación Zoom</Label>
                    <p className="text-xs text-muted-foreground">Efecto Ken Burns</p>
                  </div>
                  <Switch
                    checked={formData.animationEnabled}
                    onCheckedChange={(checked) => setFormData({ ...formData, animationEnabled: checked })}
                  />
                </div>
              </div>

              {formData.gradientEnabled && (
                <div className="space-y-2 pt-2 border-t border-border">
                  <Label className="text-sm">Color del degradado (opcional)</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-muted-foreground">#</span>
                      <Input
                        value={formData.gradientColor}
                        onChange={(e) => setFormData({ ...formData, gradientColor: e.target.value.replace(/[^a-fA-F0-9]/g, '').slice(0, 6) })}
                        placeholder="005A7A (azul por defecto)"
                        className="font-mono"
                        maxLength={6}
                      />
                    </div>
                    {formData.gradientColor && (
                      <div 
                        className="w-10 h-10 rounded-lg border"
                        style={{ backgroundColor: `#${formData.gradientColor}` }}
                      />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deja vacío para usar el color azul de la marca (#005A7A). Ingresa el código hexadecimal sin #.
                  </p>
                </div>
              )}
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
              <Label className="cursor-pointer">
                {formData.active ? '✅ Slide activo (visible en el sitio)' : '⏸️ Slide inactivo (oculto)'}
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white">
              <Save className="h-4 w-4 mr-2" />
              {editingSlide ? 'Guardar cambios' : 'Crear slide'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
