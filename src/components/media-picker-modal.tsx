'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MediaPicker } from './media-picker'

interface MediaPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: string
  onChange: (url: string) => void
  accept?: 'image' | 'video' | 'audio' | 'all'
  category?: string
  keyPrefix?: string
  fixedKey?: string
  recommendedSize?: string
  formatHint?: string
  maxSizeMB?: number
  title?: string
}

export function MediaPickerModal({
  open,
  onOpenChange,
  value,
  onChange,
  accept = 'all',
  category = 'general',
  keyPrefix = 'media',
  fixedKey,
  recommendedSize,
  formatHint,
  maxSizeMB = 50,
  title = 'Seleccionar archivo'
}: MediaPickerModalProps) {
  const handleChange = (url: string) => {
    onChange(url)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <MediaPicker
            value={value}
            onChange={handleChange}
            accept={accept}
            category={category}
            keyPrefix={keyPrefix}
            fixedKey={fixedKey}
            recommendedSize={recommendedSize}
            formatHint={formatHint}
            maxSizeMB={maxSizeMB}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
