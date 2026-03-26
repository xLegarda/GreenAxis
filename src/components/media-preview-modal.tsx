'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Trash2, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import type { MediaItem } from './media-card'

/**
 * MediaPreviewModal Component
 * 
 * Modal for previewing and editing media details.
 * Opened when users click the Info button on MediaCard.
 * 
 * Features:
 * - Full-size preview for images
 * - Video player for videos with controls
 * - Audio player for audio with controls
 * - Display metadata: name, size, upload date, dimensions, usage count
 * - Show usage locations with clickable links
 * - Editable fields for name, description, category
 * - Delete button with confirmation
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.6
 */

interface MediaReference {
  table: string
  id: string
  field: string
  displayName: string
  editUrl: string
}

interface MediaPreviewModalProps {
  /** Media item to preview */
  item: MediaItem | null
  /** Whether the modal is open */
  open: boolean
  /** Callback when modal is closed */
  onOpenChange: (open: boolean) => void
  /** Callback when media is deleted */
  onDelete?: (item: MediaItem) => void
  /** Callback when media is updated */
  onUpdate?: (item: MediaItem) => void
}

/**
 * Helper function to format file size
 */
function formatFileSize(bytes?: number): string {
  if (!bytes) return 'Tamaño desconocido'
  
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }
  
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}

/**
 * Helper function to format date
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function MediaPreviewModal({
  item,
  open,
  onOpenChange,
  onDelete,
  onUpdate
}: MediaPreviewModalProps) {
  // Editable fields state
  const [label, setLabel] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  
  // Loading and error states
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingReferences, setIsLoadingReferences] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // References state
  const [references, setReferences] = useState<MediaReference[]>([])
  const [usageCount, setUsageCount] = useState(0)
  
  // Delete confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form fields when item changes
  useEffect(() => {
    if (item) {
      setLabel(item.label)
      setDescription(item.description || '')
      setCategory(item.category || '')
      setError(null)
      
      // Load usage references
      loadReferences(item.url)
    }
  }, [item])

  /**
   * Load usage references for the media item
   * Requirements: 12.6
   */
  const loadReferences = async (url: string) => {
    setIsLoadingReferences(true)
    try {
      const response = await fetch('/api/admin/media/check-references', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Error al cargar referencias')
      }

      const data = await response.json()
      setReferences(data.references || [])
      setUsageCount(data.usageCount || 0)
    } catch (err) {
      console.error('Error loading references:', err)
      setReferences([])
      setUsageCount(0)
    } finally {
      setIsLoadingReferences(false)
    }
  }

  /**
   * Save metadata changes
   * Requirements: 12.6
   */
  const handleSave = async () => {
    if (!item) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
          description: description || null,
          category: category || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Error al guardar cambios')
      }

      const data = await response.json()
      
      // Update parent component
      if (onUpdate && data.media) {
        onUpdate({
          ...item,
          label: data.media.label,
          description: data.media.description,
          category: data.media.category,
          updatedAt: data.media.updatedAt,
        })
      }

      // Close modal on success
      onOpenChange(false)
    } catch (err) {
      console.error('Error saving media:', err)
      setError(err instanceof Error ? err.message : 'Error al guardar cambios')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handle delete action
   * Requirements: 12.6
   */
  const handleDelete = async (force: boolean = false) => {
    if (!item) return

    setIsDeleting(true)
    setError(null)

    try {
      const url = `/api/admin/media/${item.id}${force ? '?force=true' : ''}`
      const response = await fetch(url, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.references && data.references.length > 0) {
          // File is in use - show references
          setReferences(data.references)
          setUsageCount(data.references.length)
          setError(data.message)
          setShowDeleteConfirm(false)
          return
        }
        throw new Error(data.message || 'Error al eliminar archivo')
      }

      // Successfully deleted
      if (onDelete) {
        onDelete(item)
      }
      
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } catch (err) {
      console.error('Error deleting media:', err)
      setError(err instanceof Error ? err.message : 'Error al eliminar archivo')
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (!item) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles del archivo</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Left column: Preview */}
            <div className="space-y-4">
              {/* Media Preview - Requirements: 12.1, 12.2, 12.3, 12.4 */}
              <div className="rounded-lg border bg-muted overflow-hidden">
                {item.type === 'image' && (
                   
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-auto"
                  />
                )}
                
                {item.type === 'video' && (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-auto"
                  >
                    Tu navegador no soporta el elemento de video.
                  </video>
                )}
                
                {item.type === 'audio' && (
                  <div className="p-8 flex items-center justify-center">
                    <audio
                      src={item.url}
                      controls
                      className="w-full"
                    >
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                )}
              </div>

              {/* Metadata - Requirements: 12.1 */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="secondary">
                    {item.type === 'image' ? 'Imagen' : item.type === 'video' ? 'Video' : 'Audio'}
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tamaño:</span>
                  <span>{formatFileSize(item.size)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subido:</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actualizado:</span>
                  <span>{formatDate(item.updatedAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Usos:</span>
                  <Badge variant={usageCount > 0 ? 'default' : 'secondary'}>
                    {isLoadingReferences ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      `${usageCount} uso${usageCount !== 1 ? 's' : ''}`
                    )}
                  </Badge>
                </div>
              </div>

              {/* Usage Locations - Requirements: 12.6 */}
              {references.length > 0 && (
                <div className="space-y-2">
                  <Label>Usado en:</Label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref.editUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-muted"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="flex-1 truncate">
                          {ref.displayName} ({ref.field})
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Editable fields */}
            <div className="space-y-4">
              {/* Name field - Requirements: 12.6 */}
              <div className="space-y-2">
                <Label htmlFor="label">Nombre</Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Nombre del archivo"
                />
              </div>

              {/* Description field - Requirements: 12.6 */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción opcional"
                  rows={3}
                />
              </div>

              {/* Category field - Requirements: 12.6 */}
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Categoría (news, services, videos, audio, config, carousel, general)"
                />
              </div>

              {/* URL (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={item.url}
                  readOnly
                  className="text-xs text-muted-foreground"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {/* Delete button - Requirements: 12.6 */}
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isSaving}
              className="sm:mr-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting || isSaving}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSave}
              disabled={isDeleting || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Requirements: 12.6 */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar archivo?</AlertDialogTitle>
            <AlertDialogDescription>
              {usageCount > 0 ? (
                <>
                  Este archivo está siendo usado en {usageCount} lugar{usageCount !== 1 ? 'es' : ''}.
                  Si lo eliminas, las referencias se actualizarán a vacío.
                  Esta acción no se puede deshacer.
                </>
              ) : (
                <>
                  Esta acción no se puede deshacer. El archivo se eliminará permanentemente
                  del servidor y de la base de datos.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(usageCount > 0)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
