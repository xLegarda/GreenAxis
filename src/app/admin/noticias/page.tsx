'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Pencil, Trash2, Save, Calendar, Info, AlertTriangle, Video, ChevronLeft, ChevronRight } from 'lucide-react'
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
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { EditorJSComponent, editorDataToText } from '@/components/editor-js'
import type EditorJS from '@editorjs/editorjs'
import MediaPickerCompact from '@/components/media-picker-compact'

interface News {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  imageUrl: string | null
  author: string | null
  published: boolean
  featured: boolean
  publishedAt: Date | null
  createdAt: Date
  blocks?: string
}

export default function NoticiasAdminPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<News | null>(null)
  const editorRef = useRef<EditorJS | null>(null)
  const editorDataRef = useRef<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const itemsPerPage = 10

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    author: '',
    published: false,
    featured: false,
    publishedAt: '',
  })

  useEffect(() => {
    fetchNews()
  }, [currentPage])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/noticias?page=${currentPage}&limit=${itemsPerPage}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data.news)
        setTotal(data.total)
        setTotalPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditorChange = useCallback((data: any) => {
    editorDataRef.current = data
  }, [])

  const handleSave = async () => {
    if (!formData.title) {
      toast({ title: 'Error', description: 'El título es requerido', variant: 'destructive' })
      return
    }

    try {
      // Get editor data
      let blocks: string | null = null
      let content = formData.content
      
      if (editorDataRef.current) {
        blocks = JSON.stringify(editorDataRef.current)
        content = editorDataToText(editorDataRef.current)
      }

      const url = '/api/noticias'
      const method = editingNews ? 'PUT' : 'POST'
      const body = editingNews 
        ? { 
            id: editingNews.id, 
            ...formData,
            blocks,
            content,
            publishedAt: formData.publishedAt || undefined
          }
        : { 
            ...formData, 
            blocks,
            content,
            publishedAt: formData.publishedAt || undefined
          }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({ title: editingNews ? 'Noticia actualizada' : 'Noticia creada' })
        setDialogOpen(false)
        setEditingNews(null)
        resetForm()
        fetchNews()
      } else {
        const error = await response.json()
        toast({ title: 'Error', description: error.error || 'No se pudo guardar', variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Error', description: 'No se pudo guardar', variant: 'destructive' })
    }
  }

  const handleDelete = async (item: News) => {
    try {
      await fetch(`/api/noticias?id=${item.id}`, { method: 'DELETE' })
      toast({ title: 'Noticia eliminada' })
      setDeleteConfirm(null)
      fetchNews()
    } catch (error) {
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      author: '',
      published: false,
      featured: false,
      publishedAt: '',
    })
    editorDataRef.current = null
  }

  const openEditDialog = (item: News) => {
    setEditingNews(item)
    
    // Parse publishedAt date for the input
    let publishedAtStr = ''
    if (item.publishedAt) {
      const date = new Date(item.publishedAt)
      // Format as YYYY-MM-DD for the date input
      publishedAtStr = date.toISOString().split('T')[0]
    }
    
    // Parse blocks if available
    let blocksData = null
    if (item.blocks) {
      try {
        blocksData = JSON.parse(item.blocks)
      } catch {
        blocksData = null
      }
    }
    
    setFormData({
      title: item.title,
      excerpt: item.excerpt || '',
      content: item.content,
      imageUrl: item.imageUrl || '',
      author: item.author || '',
      published: item.published,
      featured: item.featured,
      publishedAt: publishedAtStr,
    })
    
    // Set editor data for next render
    editorDataRef.current = blocksData
    setDialogOpen(true)
  }

  // Format date without hydration issues - use consistent format
  const formatDate = useCallback((date: Date | string | null) => {
    if (!date) return ''
    const d = new Date(date)
    // Use a consistent format that won't cause hydration mismatches
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Noticias / Blog</h1>
          <p className="text-sm text-muted-foreground">
            Crear y editar artículos con editor avanzado {total > 0 && `(${total} total)`}
          </p>
        </div>
        <Button onClick={() => { resetForm(); setEditingNews(null); editorDataRef.current = null; setDialogOpen(true); }} className="gradient-nature text-white">
          <Plus className="h-4 w-4 mr-2" />Nueva Noticia
        </Button>
      </div>

      <div className="grid gap-4">
        {news.map((item) => (
          <Card key={item.id} className={!item.published ? 'opacity-60' : ''}>
            <CardContent className="p-4 flex items-center gap-4">
              {item.imageUrl ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent shrink-0">
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-accent shrink-0 flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold truncate">{item.title}</h3>
                  {item.published ? (
                    <Badge className="bg-primary text-primary-foreground">Publicado</Badge>
                  ) : (
                    <Badge variant="secondary">Borrador</Badge>
                  )}
                  {item.featured && <Badge variant="outline">Destacado</Badge>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{item.excerpt}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  {item.author && <span>{item.author}</span>}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(item.publishedAt || item.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteConfirm(item)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {news.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No hay noticias. Haz clic en "Nueva Noticia" para crear una.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} de {total} noticias
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            
            <span className="text-sm text-muted-foreground px-3">
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-[800px] !w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingNews ? 'Editar Noticia' : 'Nueva Noticia'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title, Author and Date - Full width row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título de la noticia"
                />
              </div>
              <div className="space-y-2">
                <Label>Autor</Label>
                <Input
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Nombre del autor"
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de publicación</Label>
                <Input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label>Resumen (opcional)</Label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Breve resumen de la noticia"
              />
              <p className="text-xs text-muted-foreground">
                Si no se especifica, se generará automáticamente del contenido
              </p>
            </div>

            {/* Featured Image */}
            <div className="space-y-3">
              <Label>Imagen destacada</Label>
              
              <MediaPickerCompact
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                accept="image"
                category="news"
                keyPrefix={editingNews ? `news-${editingNews.id}` : 'news-new'}
                recommendedSize="1200x630px"
                formatHint="Proporción 1.9:1 - ideal para redes sociales. Esta imagen aparecerá como vista previa al compartir."
                maxSizeMB={5}
              />
              
              <p className="text-xs text-muted-foreground">
                Recomendado: 1200x630px (proporción 1.9:1) - ideal para redes sociales
              </p>
            </div>

            {/* Editor.js Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Contenido</Label>
                <span className="text-xs text-muted-foreground">Editor de bloques</span>
              </div>
              
              {/* Editor Info */}
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                <Info className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <div className="text-green-700 dark:text-green-300">
                  <p className="font-medium">Tips del editor:</p>
                  <ul className="text-xs mt-1 space-y-0.5 text-green-600 dark:text-green-400">
                    <li>• <strong>Al editar:</strong> Espera a que cargue todo el contenido antes de modificar</li>
                    <li>• Haz clic en <strong>+</strong> para añadir bloques (títulos, listas, imágenes, videos, audios)</li>
                    <li>• Puedes arrastrar y soltar para reorganizar los bloques</li>
                    <li>• Para videos de YouTube/Spotify, usa la herramienta <strong>"Incrustar"</strong></li>
                    <li>• Para videos o audios locales, usa <strong>"Video Local"</strong> o <strong>"Audio"</strong></li>
                    <li>• Selecciona texto para ver opciones: <strong>negrita</strong>, <em>cursiva</em>, código, resaltado</li>
                  </ul>
                </div>
              </div>
              
              <EditorJSComponent 
                data={editorDataRef.current} 
                onChange={handleEditorChange}
                placeholder="Escribe aquí el contenido de tu noticia..."
              />
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label>Publicar</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label>Destacado</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="gradient-nature text-white">
              <Save className="h-4 w-4 mr-2" />Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Eliminar noticia
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {deleteConfirm && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  ¿Estás seguro de que deseas eliminar la noticia <strong>"{deleteConfirm.title}"</strong>?
                </p>
                <p className="text-xs text-muted-foreground">
                  Esta acción no se puede deshacer.
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
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
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
