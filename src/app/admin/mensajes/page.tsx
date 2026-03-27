'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Phone, Building, Trash2, AlertTriangle, X, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
  consent: boolean
  read: boolean
  createdAt: Date
}

export default function MensajesAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contacto')
      if (response.ok) {
        setMessages(await response.json())
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/contacto', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true })
      })
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/contacto?id=${deleteConfirm.id}`, { method: 'DELETE' })
      if (response.ok) {
        setMessages(messages.filter(m => m.id !== deleteConfirm.id))
        toast({ title: 'Mensaje eliminado correctamente' })
      } else {
        toast({ title: 'Error al eliminar', variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast({ title: 'Error al eliminar', variant: 'destructive' })
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Mensajes de Contacto</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {unreadCount > 0 ? (
            <span className="text-primary font-medium">{unreadCount} sin leer</span>
          ) : (
            'Todos leídos'
          )}
          {' '}• Total: {messages.length}
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={!message.read ? 'border-l-4 border-l-primary shadow-sm' : 'shadow-sm'}
          >
            <CardContent className="p-4 sm:p-5">
              {/* Top row: name + badge + date */}
              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-base">{message.name}</h3>
                  {!message.read && (
                    <Badge className="bg-primary text-xs">Nuevo</Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                  <Clock className="h-3 w-3" />
                  {formatDate(message.createdAt)}
                </span>
              </div>

              {/* Contact info */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-3 text-sm text-muted-foreground mb-3">
                <a
                  href={`mailto:${message.email}`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{message.email}</span>
                </a>
                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {message.phone}
                  </a>
                )}
                {message.company && (
                  <span className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 shrink-0" />
                    {message.company}
                  </span>
                )}
              </div>

              {/* Subject */}
              {message.subject && (
                <p className="font-medium text-sm mb-2 text-foreground">
                  Asunto: {message.subject}
                </p>
              )}

              {/* Message body */}
              <div className="bg-accent/50 rounded-lg p-3 mb-3">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.message}</p>
              </div>

              {/* Footer: consent + actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {message.consent && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                    Aceptó la política de tratamiento de datos
                  </p>
                )}
                <div className="flex gap-2 sm:ml-auto">
                  {!message.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none text-xs h-8"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Marcar leído
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleteConfirm(message)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 opacity-40" />
              </div>
              <p className="font-medium">No hay mensajes de contacto</p>
              <p className="text-sm mt-1">Los mensajes del formulario de contacto aparecerán aquí</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {deleteConfirm && (
            <div className="space-y-3 py-2">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium">De: </span>
                  <span>{deleteConfirm.name}</span>
                  <span className="text-muted-foreground"> ({deleteConfirm.email})</span>
                </div>
                {deleteConfirm.subject && (
                  <div>
                    <span className="font-medium">Asunto: </span>
                    <span>{deleteConfirm.subject}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">Fecha: </span>
                  <span className="text-muted-foreground">{formatDate(deleteConfirm.createdAt)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                ¿Estás seguro de que deseas eliminar este mensaje?
              </p>
            </div>
          )}

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleting ? 'Eliminando...' : 'Eliminar mensaje'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
