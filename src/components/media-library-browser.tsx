'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, ImageIcon, Loader2, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MediaCard, type MediaItem } from './media-card'
import { MediaPreviewModal } from './media-preview-modal'
import { ExternalMediaForm } from './external-media-form'

/**
 * MediaLibraryBrowser Component
 * 
 * Display and manage media library with search, filter, and pagination.
 * 
 * Features:
 * - Infinite scroll pagination (50 items per page)
 * - Search by filename (debounced)
 * - Filter by category (news, services, videos, audio, config, carousel, general)
 * - Grid layout (4 columns desktop, 2 columns mobile)
 * - Lazy loading for images
 * - Visual indicators for media type (video/audio icons)
 * - Usage count badge on each item
 * - Preview modal for detailed view and editing
 * 
 * Requirements: 1.1, 1.4, 8.6, 12.1-12.6
 */

interface MediaLibraryBrowserProps {
  /** Current selected media URL */
  value?: string
  /** Callback when media is selected */
  onSelect: (item: MediaItem) => void
  /** File type filter */
  accept?: 'image' | 'video' | 'audio' | 'all'
  /** Callback when media is deleted */
  onDelete?: (item: MediaItem) => void
  /** Callback when media is updated */
  onUpdate?: (item: MediaItem) => void
}

/**
 * Debounce hook for search input
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function MediaLibraryBrowser({
  value,
  onSelect,
  accept = 'all',
  onDelete,
  onUpdate
}: MediaLibraryBrowserProps) {
  // State management
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [externalFormOpen, setExternalFormOpen] = useState(false)

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Ref for infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null)

  /**
   * Fetch media items from API
   * Requirements: 1.1, 1.4, 8.6
   */
  const fetchMediaItems = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true)
    setError(null)
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '50'
      })
      
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      if (debouncedSearchQuery) {
        params.append('search', debouncedSearchQuery)
      }
      
      if (accept !== 'all') {
        params.append('type', accept)
      }
      
      const response = await fetch(`/api/admin/media?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar archivos multimedia')
      }

      const data = await response.json()
      
      setMediaItems(prev => reset ? data.items : [...prev, ...data.items])
      setHasMore(data.pagination.hasMore)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching media items:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar archivos multimedia')
      setLoading(false)
    }
  }, [selectedCategory, debouncedSearchQuery, accept])

  /**
   * Reset and fetch when filters change
   * Requirements: 1.4, 8.6
   */
  useEffect(() => {
    setPage(1)
    fetchMediaItems(1, true)
  }, [debouncedSearchQuery, selectedCategory, fetchMediaItems])

  /**
   * Infinite scroll observer
   * Requirements: 1.5
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1
          setPage(nextPage)
          fetchMediaItems(nextPage, false)
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasMore, loading, page, fetchMediaItems])

  /**
   * Handle media selection
   * Requirements: 2.1
   */
  const handleSelectMedia = (item: MediaItem) => {
    onSelect(item)
  }

  /**
   * Handle media deletion
   * Requirements: 12.6
   */
  const handleDeleteMedia = (item: MediaItem) => {
    // Remove from local state
    setMediaItems(prev => prev.filter(i => i.id !== item.id))
    // Notify parent
    onDelete?.(item)
  }

  /**
   * Handle media update
   * Requirements: 12.6
   */
  const handleUpdateMedia = (item: MediaItem) => {
    // Update in local state
    setMediaItems(prev => prev.map(i => i.id === item.id ? item : i))
    // Notify parent
    onUpdate?.(item)
  }

  /**
   * Handle info button click
   * Requirements: 12.1, 12.2
   */
  const handleInfoClick = (item: MediaItem) => {
    setPreviewItem(item)
  }

  /**
   * Handle search input change
   * Requirements: 1.4
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  /**
   * Handle category filter change
   * Requirements: 8.6
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Bar - Requirements: 1.4 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar archivos..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Category Filter - Requirements: 8.6 */}
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="news">Noticias</SelectItem>
            <SelectItem value="services">Servicios</SelectItem>
            <SelectItem value="videos">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="config">Configuración</SelectItem>
            <SelectItem value="carousel">Carrusel</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>

        {/* External Media Button */}
        <Button
          variant="outline"
          onClick={() => setExternalFormOpen(true)}
          className="gap-2 whitespace-nowrap"
        >
          <ExternalLink className="h-4 w-4" />
          Archivo externo
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {/* Media Grid - Requirements: 1.1, 1.2 */}
      {loading && mediaItems.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : mediaItems.length === 0 ? (
        <Card className="p-8">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No se encontraron archivos</p>
            {(searchQuery || selectedCategory !== 'all') && (
              <p className="text-xs mt-1">Intenta ajustar los filtros de búsqueda</p>
            )}
          </div>
        </Card>
      ) : (
        <>
          {/* Grid Layout: 4 columns desktop, 2 columns mobile - Requirements: 1.1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {mediaItems.map((item) => (
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

          {/* Infinite Scroll Observer Target - Requirements: 1.5 */}
          {hasMore && (
            <div ref={observerTarget} className="flex justify-center py-4">
              {loading && (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              )}
            </div>
          )}

          {/* Manual Load More Button (fallback) */}
          {!loading && hasMore && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => {
                  const nextPage = page + 1
                  setPage(nextPage)
                  fetchMediaItems(nextPage, false)
                }}
              >
                Cargar más
              </Button>
            </div>
          )}
        </>
      )}

      {/* Media Preview Modal - Requirements: 12.1-12.6 */}
      <MediaPreviewModal
        item={previewItem}
        open={!!previewItem}
        onOpenChange={(open) => !open && setPreviewItem(null)}
        onDelete={handleDeleteMedia}
        onUpdate={handleUpdateMedia}
      />

      {/* External Media Form */}
      <ExternalMediaForm
        open={externalFormOpen}
        onOpenChange={setExternalFormOpen}
        onSuccess={() => {
          // Refresh media list after successful registration
          setPage(1)
          setMediaItems([])
          fetchMediaItems(1, true)
        }}
      />
    </div>
  )
}
