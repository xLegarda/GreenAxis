import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MediaPreviewModal } from '../media-preview-modal'
import type { MediaItem } from '../media-card'

// Mock fetch
global.fetch = jest.fn()

const mockMediaItem: MediaItem = {
  id: 'test-id',
  key: 'test-key',
  label: 'Test Image',
  description: 'Test description',
  url: 'https://example.com/test.jpg',
  category: 'news',
  type: 'image',
  size: 1024000,
  usageCount: 2,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
}

describe('MediaPreviewModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when open', () => {
    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    expect(screen.getByText('Detalles del archivo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Image')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={false}
        onOpenChange={jest.fn()}
      />
    )

    expect(screen.queryByText('Detalles del archivo')).not.toBeInTheDocument()
  })

  it('displays image preview for image type', () => {
    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    const img = screen.getByAltText('Test Image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/test.jpg')
  })

  it('displays video player for video type', () => {
    const videoItem: MediaItem = {
      ...mockMediaItem,
      type: 'video',
      url: 'https://example.com/test.mp4',
    }

    render(
      <MediaPreviewModal
        item={videoItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    const video = screen.getByRole('application') // video element
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', 'https://example.com/test.mp4')
    expect(video).toHaveAttribute('controls')
  })

  it('displays audio player for audio type', () => {
    const audioItem: MediaItem = {
      ...mockMediaItem,
      type: 'audio',
      url: 'https://example.com/test.mp3',
    }

    render(
      <MediaPreviewModal
        item={audioItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    const audio = screen.getByRole('application') // audio element
    expect(audio).toBeInTheDocument()
    expect(audio).toHaveAttribute('src', 'https://example.com/test.mp3')
    expect(audio).toHaveAttribute('controls')
  })

  it('displays metadata correctly', () => {
    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    expect(screen.getByText('Imagen')).toBeInTheDocument()
    expect(screen.getByText('1000.0 KB')).toBeInTheDocument()
    expect(screen.getByText(/2 usos/)).toBeInTheDocument()
  })

  it('loads usage references on mount', async () => {
    const mockReferences = [
      {
        table: 'News',
        id: '1',
        field: 'imageUrl',
        displayName: 'Test News Article',
        editUrl: '/admin/noticias/1',
      },
    ]

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        inUse: true,
        references: mockReferences,
        usageCount: 1,
      }),
    })

    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/admin/media/check-references',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ url: mockMediaItem.url }),
        })
      )
    })

    await waitFor(() => {
      expect(screen.getByText('Usado en:')).toBeInTheDocument()
      expect(screen.getByText(/Test News Article/)).toBeInTheDocument()
    })
  })

  it('allows editing metadata fields', async () => {
    const user = userEvent.setup()

    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    const labelInput = screen.getByDisplayValue('Test Image')
    await user.clear(labelInput)
    await user.type(labelInput, 'Updated Image')

    expect(labelInput).toHaveValue('Updated Image')
  })

  it('saves metadata changes when Save button is clicked', async () => {
    const user = userEvent.setup()
    const onUpdate = jest.fn()
    const onOpenChange = jest.fn()

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ inUse: false, references: [], usageCount: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          media: {
            ...mockMediaItem,
            label: 'Updated Image',
          },
        }),
      })

    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={onOpenChange}
        onUpdate={onUpdate}
      />
    )

    const labelInput = screen.getByDisplayValue('Test Image')
    await user.clear(labelInput)
    await user.type(labelInput, 'Updated Image')

    const saveButton = screen.getByText('Guardar cambios')
    await user.click(saveButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/admin/media/${mockMediaItem.id}`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            label: 'Updated Image',
            description: 'Test description',
            category: 'news',
          }),
        })
      )
    })

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('shows delete confirmation dialog when Delete button is clicked', async () => {
    const user = userEvent.setup()

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ inUse: false, references: [], usageCount: 0 }),
    })

    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /Eliminar/ })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('¿Eliminar archivo?')).toBeInTheDocument()
    })
  })

  it('deletes media when confirmed', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn()
    const onOpenChange = jest.fn()

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ inUse: false, references: [], usageCount: 0 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          deleted: true,
          message: 'Archivo eliminado correctamente',
        }),
      })

    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={onOpenChange}
        onDelete={onDelete}
      />
    )

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /Eliminar/ })
    await user.click(deleteButton)

    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByText('¿Eliminar archivo?')).toBeInTheDocument()
    })

    const confirmButton = screen.getByRole('button', { name: /Eliminar/ })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/admin/media/${mockMediaItem.id}`,
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(mockMediaItem)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('shows warning when deleting file in use', async () => {
    const user = userEvent.setup()

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ inUse: true, references: [], usageCount: 2 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ inUse: true, references: [], usageCount: 2 }),
      })

    render(
      <MediaPreviewModal
        item={mockMediaItem}
        open={true}
        onOpenChange={jest.fn()}
      />
    )

    // Wait for references to load
    await waitFor(() => {
      expect(screen.getByText(/2 usos/)).toBeInTheDocument()
    })

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /Eliminar/ })
    await user.click(deleteButton)

    // Check warning message
    await waitFor(() => {
      expect(
        screen.getByText(/Este archivo está siendo usado en 2 lugares/)
      ).toBeInTheDocument()
    })
  })
})
