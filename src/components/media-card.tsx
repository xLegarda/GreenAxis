'use client'

import { useState } from 'react'
import { ImageIcon, Video, Music, Check, Trash2, Info } from 'lucide-react'
import { getAdminThumbnailUrl, isCloudinaryUrl } from '@/lib/cloudinary'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/**
 * MediaCard Component
 * 
 * Reusable card component for displaying media items with hover actions.
 * Used in both MediaLibraryBrowser and MediaPicker components.
 * 
 * Features:
 * - Display thumbnail for images, icon for video/audio
 * - Hover overlay with Select, Delete, Info actions
 * - Show usage count badge
 * - File type icon for videos and audio
 * - Lazy loading for images using loading="lazy"
 * 
 * Requirements: 1.2, 1.3, 12.5, 14.4
 */

export interface MediaItem {
  id: string
  key: string
  label: string
  description: string | null
  url: string
  category: string | null
  type: 'image' | 'video' | 'audio'
  size?: number
  usageCount?: number
  createdAt: string
  updatedAt: string
}

interface MediaCardProps {
  /** Media item to display */
  item: MediaItem
  /** Whether this item is currently selected */
  isSelected?: boolean
  /** Callback when Select action is clicked */
  onSelect?: (item: MediaItem) => void
  /** Callback when Delete action is clicked */
  onDelete?: (item: MediaItem) => void
  /** Callback when Info action is clicked */
  onInfo?: (item: MediaItem) => void
  /** Whether to show action buttons on hover */
  showActions?: boolean
}

/**
 * Helper function to get icon for media type
 * Requirements: 1.3
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
    month: 'short',
    day: 'numeric'
  })
}

export function MediaCard({
  item,
  isSelected = false,
  onSelect,
  onDelete,
  onInfo,
  showActions = true
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = getMediaIcon(item.type)

  /**
   * Handle select action
   * Requirements: 2.1
   */
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.(item)
  }

  /**
   * Handle delete action
   * Requirements: 5.1
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(item)
  }

  /**
   * Handle info action
   * Requirements: 12.1, 12.2
   */
  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation()
    onInfo?.(item)
  }

  return (
    <TooltipProvider>
      <Card
        className={`group relative overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-primary ${
          isSelected ? 'ring-2 ring-primary border-primary' : ''
        }`}
        onClick={handleSelect}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Media Preview - Requirements: 1.2, 1.3 */}
        <div className="aspect-square bg-muted flex items-center justify-center relative">
          {item.type === 'image' ? (
            // Lazy loading for images - Requirements: 14.4
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={isCloudinaryUrl(item.url) ? getAdminThumbnailUrl(item.url) : item.url}
              alt={item.label}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            // Video/Audio icon - Requirements: 1.3
            <Icon className="h-12 w-12 text-muted-foreground" />
          )}

          {/* File Type Icon Badge for videos and audio - Requirements: 1.3 */}
          {item.type !== 'image' && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 text-xs flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {item.type === 'video' ? 'Video' : 'Audio'}
            </Badge>
          )}

          {/* Usage Count Badge - Requirements: 12.5 */}
          {item.usageCount !== undefined && item.usageCount > 0 && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 text-xs"
            >
              {item.usageCount} uso{item.usageCount !== 1 ? 's' : ''}
            </Badge>
          )}

          {/* Selected Indicator - Requirements: 2.2 */}
          {isSelected && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                <Check className="h-3 w-3" />
                Seleccionado
              </Badge>
            </div>
          )}

          {/* Hover Overlay with Actions - Requirements: 1.2 */}
          {showActions && isHovered && !isSelected && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity">
              {onSelect && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={handleSelect}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Seleccionar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Seleccionar</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      onClick={handleDelete}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Eliminar</p>
                  </TooltipContent>
                </Tooltip>
              )}

              {onInfo && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                      onClick={handleInfo}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Información</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ver información</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {/* Media Info - Requirements: 12.1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-2">
              <p className="text-xs font-medium truncate" title={item.label}>
                {item.label}
              </p>
              {item.category && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.category}
                </p>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
              <div className="text-xs space-y-0.5 pt-1 border-t">
                <p>Tamaño: {formatFileSize(item.size)}</p>
                <p>Subido: {formatDate(item.createdAt)}</p>
                {item.usageCount !== undefined && (
                  <p>Usos: {item.usageCount}</p>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </Card>
    </TooltipProvider>
  )
}
