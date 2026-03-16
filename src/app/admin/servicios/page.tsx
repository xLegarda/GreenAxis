'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Pencil, Trash2, Save, GripVertical, Eye, EyeOff, Sparkles, FileText, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import MediaPickerCompact from '@/components/media-picker-compact'
import { toast } from '@/hooks/use-toast'
import { EditorJSComponent, editorDataToText } from '@/components/editor-js'
import { 
  Leaf, Recycle, TreePine, Droplets, Wind, Building2, 
  Sun, CloudRain, Mountain, Flower2, Landmark, Factory,
  Tractor, Droplet, CloudSun, Waves, Bird, Bug
} from 'lucide-react'

// Iconos disponibles con sus componentes y categorías
const iconOptions = [
  { value: 'Leaf', label: 'Hoja', icon: Leaf, category: 'naturaleza' },
  { value: 'Recycle', label: 'Reciclaje', icon: Recycle, category: 'gestión' },
  { value: 'TreePine', label: 'Árbol', icon: TreePine, category: 'naturaleza' },
  { value: 'Droplets', label: 'Gotas', icon: Droplets, category: 'agua' },
  { value: 'Wind', label: 'Viento', icon: Wind, category: 'aire' },
  { value: 'Building2', label: 'Edificio', icon: Building2, category: 'infraestructura' },
  { value: 'Sun', label: 'Sol', icon: Sun, category: 'naturaleza' },
  { value: 'CloudRain', label: 'Lluvia', icon: CloudRain, category: 'agua' },
  { value: 'Mountain', label: 'Montaña', icon: Mountain, category: 'naturaleza' },
  { value: 'Flower2', label: 'Flor', icon: Flower2, category: 'naturaleza' },
  { value: 'Landmark', label: 'Monumento', icon: Landmark, category: 'infraestructura' },
  { value: 'Factory', label: 'Fábrica', icon: Factory, category: 'infraestructura' },
  { value: 'Tractor', label: 'Tractor', icon: Tractor, category: 'gestión' },
  { value: 'Droplet', label: 'Gota', icon: Droplet, category: 'agua' },
  { value: 'CloudSun', label: 'Nube', icon: CloudSun, category: 'aire' },
  { value: 'Waves', label: 'Olas', icon: Waves, category: 'agua' },
  { value: 'Bird', label: 'Ave', icon: Bird, category: 'naturaleza' },
  { value: 'Bug', label: 'Insecto', icon: Bug, category: 'naturaleza' },
]

const iconCategories = [
  { id: 'naturaleza', label: '🌿 Naturaleza' },
  { id: 'agua', label: '💧 Agua' },
  { id: 'aire', label: '🌬️ Aire' },
  { id: 'gestión', label: '♻️ Gestión' },
  { id: 'infraestructura', label: '🏛️ Infraestructura' },
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildBlocksFromContent(content: string) {
  const lines = content.split('\n').map((line) => line.trim()).filter(Boolean)
  return {
    blocks: lines.map((text) => ({
      type: 'paragraph',
      data: { text }
    }))
  }
}

interface Service {
  id: string
  title: string
  slug?: string | null
  description: string | null
  content: string | null
  blocks?: string | null
  icon: string | null
  imageUrl: string | null
  order: number
  active: boolean
  featured: boolean
}

export default function ServiciosAdminPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const editorDataRef = useRef<any>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; service: Service | null }>({
    open: false,
    service: null
  })
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    icon: 'Leaf',
    imageUrl: '',
    active: true,
    featured: false,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/servicios')
      if (response.ok) {
        setServices(await response.json())
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditorChange = useCallback((data: any) => {
    editorDataRef.current = data
  }, [])

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'El título es obligatorio', variant: 'destructive' })
      return
    }

    try {
      let blocks: string | null = null
      let content = formData.content

      if (editorDataRef.current) {
        blocks = JSON.stringify(editorDataRef.current)
        content = editorDataToText(editorDataRef.current)
      }

      const nextSlug = generateSlug(formData.title)
      const slug = editingService
        ? (editingService.title === formData.title && editingService.slug ? editingService.slug : nextSlug)
        : nextSlug

      const url = '/api/servicios'
      const method = editingService ? 'PUT' : 'POST'
      const body = editingService 
        ? { ...formData, id: editingService.id, slug, blocks, content }
        : { ...formData, slug, blocks, content }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({ title: editingService ? 'Servicio actualizado' : 'Servicio creado' })
        setDialogOpen(false)
        setEditingService(null)
        resetForm()
        fetchServices()
      }
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar', variant: 'destructive' })
    }
  }

  const handleDelete = (service: Service) => {
    setDeleteDialog({ open: true, service })
  }

  const confirmDelete = async () => {
    if (!deleteDialog.service) return

    try {
      await fetch(`/api/servicios?id=${deleteDialog.service.id}`, { method: 'DELETE' })
      toast({ title: 'Servicio eliminado correctamente' })
      fetchServices()
      setDeleteDialog({ open: false, service: null })
    } catch (error) {
      toast({ title: 'Error al eliminar servicio', variant: 'destructive' })
    }
  }

  const handleToggleActive = async (service: Service) => {
    try {
      await fetch('/api/servicios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, active: !service.active })
      })
      fetchServices()
    } catch (error) {
      console.error('Error toggling service:', error)
    }
  }

  const handleToggleFeatured = async (service: Service) => {
    try {
      await fetch('/api/servicios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, featured: !service.featured })
      })
      fetchServices()
    } catch (error) {
      console.error('Error toggling featured:', error)
    }
  }

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      icon: 'Leaf',
      imageUrl: '',
      active: true,
      featured: false,
    })
    editorDataRef.current = null
  }

  const openEditDialog = (service: Service) => {
    let blocksData = null
    if (service.blocks) {
      try {
        blocksData = JSON.parse(service.blocks)
      } catch {
        blocksData = null
      }
    }
    if (!blocksData && service.content) {
      blocksData = buildBlocksFromContent(service.content)
    }

    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description || '',
      content: service.content || '',
      icon: service.icon || 'Leaf',
      imageUrl: service.imageUrl || '',
      active: service.active,
      featured: service.featured,
    })
    editorDataRef.current = blocksData
    setDialogOpen(true)
  }

  const getIconComponent = (iconName: string | null) => {
    const found = iconOptions.find(opt => opt.value === iconName)
    return found ? found.icon : Leaf
  }

  const filteredIcons = selectedCategory === 'all' 
    ? iconOptions 
    : iconOptions.filter(opt => opt.category === selectedCategory)

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando servicios...</div>
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Servicios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona los servicios que ofrece Green Axis S.A.S.
          </p>
        </div>
        <Button 
          onClick={() => { resetForm(); setEditingService(null); setDialogOpen(true); }} 
          className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white shadow-lg shadow-green-500/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#6BBE45]">{services.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[#005A7A]">{services.filter(s => s.active).length}</p>
            <p className="text-xs text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{services.filter(s => s.featured).length}</p>
            <p className="text-xs text-muted-foreground">Destacados</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-500">{services.filter(s => !s.active).length}</p>
            <p className="text-xs text-muted-foreground">Inactivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service) => {
          const IconComponent = getIconComponent(service.icon)
          
          return (
            <Card 
              key={service.id} 
              className={`transition-all hover:shadow-md ${!service.active ? 'opacity-60 bg-muted/50' : 'bg-card'}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground cursor-grab">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    service.imageUrl 
                      ? 'bg-cover bg-center' 
                      : 'bg-gradient-to-br from-[#6BBE45] to-[#005A7A]'
                  }`}
                  style={service.imageUrl ? { backgroundImage: `url(${service.imageUrl})` } : {}}
                  >
                    {!service.imageUrl && <IconComponent className="h-6 w-6 text-white" />}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground truncate">{service.title}</h3>
                      {service.featured && (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                      {!service.active && (
                        <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                      {service.description || 'Sin descripción'}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleFeatured(service)}
                      title={service.featured ? 'Quitar destacado' : 'Destacar'}
                      className={service.featured ? 'text-amber-500' : ''}
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleActive(service)}
                      title={service.active ? 'Desactivar' : 'Activar'}
                      className={service.active ? 'text-green-500' : 'text-gray-400'}
                    >
                      {service.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service)} title="Eliminar" className="hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {services.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No hay servicios creados</p>
              <Button onClick={() => { resetForm(); setDialogOpen(true); }} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Crear primer servicio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-[800px] !w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Gestión de Residuos"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción corta</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descripción del servicio"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Contenido detallado</Label>
                <span className="text-xs text-muted-foreground">Editor de bloques</span>
              </div>

              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                <Info className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <div className="text-green-700 dark:text-green-300">
                  <p className="font-medium">Tips del editor:</p>
                  <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                    Usa el boton + para anadir bloques. Imagenes y multimedia funcionan igual que en noticias.
                  </p>
                </div>
              </div>

              <EditorJSComponent
                data={editorDataRef.current}
                onChange={handleEditorChange}
                placeholder="Escribe aqui el contenido del servicio..."
              />
            </div>

            {/* Icon Selector */}
            <div className="space-y-3">
              <Label>Selecciona un icono</Label>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-[#6BBE45] hover:bg-[#5CAE38]' : ''}
                >
                  Todos
                </Button>
                {iconCategories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={selectedCategory === cat.id ? 'bg-[#6BBE45] hover:bg-[#5CAE38]' : ''}
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
              
              {/* Icon Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-4 bg-muted/50 rounded-xl max-h-48 overflow-y-auto">
                {filteredIcons.map((opt) => {
                  const IconComp = opt.icon
                  const isSelected = formData.icon === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: opt.value })}
                      className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                        isSelected 
                          ? 'bg-[#6BBE45] text-white shadow-lg scale-105' 
                          : 'bg-background hover:bg-accent text-foreground'
                      }`}
                      title={opt.label}
                    >
                      <IconComp className="h-5 w-5" />
                      <span className="text-[10px] truncate w-full text-center">{opt.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Imagen del servicio (opcional)</Label>
                <span className="text-xs text-muted-foreground">Recomendado: 800x600px</span>
              </div>
              
              <MediaPickerCompact
                value={formData.imageUrl}
                onChange={handleImageChange}
                accept="image"
                category="services"
                keyPrefix="service"
                recommendedSize="800 x 600 píxeles (proporción 4:3)"
                formatHint="JPG, PNG o WebP - Peso máximo: 5 MB - Si no subes imagen, se mostrará el icono seleccionado"
                maxSizeMB={5}
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active" className="cursor-pointer">
                  {formData.active ? '✅ Activo' : '⏸️ Inactivo'}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  {formData.featured ? '⭐ Destacado' : '☆ No destacado'}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingService ? 'Guardar cambios' : 'Crear servicio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, service: null })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el servicio <strong>"{deleteDialog.service?.title}"</strong>?
              <br />
              <span className="text-destructive font-medium">Esta acción no se puede deshacer.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialog({ open: false, service: null })}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar servicio
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


