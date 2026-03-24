'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import MediaPickerCompact from './media-picker-compact'

interface MediaPickerInlineDialogProps {
  open: boolean
  onSelect: (url: string) => void
  onCancel: () => void
  accept: 'image' | 'video' | 'audio'
}

const TITLE_MAP = {
  image: 'Seleccionar Imagen',
  video: 'Seleccionar Video',
  audio: 'Seleccionar Audio',
}

export function MediaPickerInlineDialog({
  open,
  onSelect,
  onCancel,
  accept,
}: MediaPickerInlineDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{TITLE_MAP[accept]}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <MediaPickerCompact
            value=""
            onChange={(url) => {
              if (url) onSelect(url)
            }}
            accept={accept}
            category={accept === 'image' ? 'news' : accept === 'video' ? 'videos' : 'audio'}
            keyPrefix={accept}
            showUpload={true}
            showLibrary={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
