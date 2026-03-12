'use client'

import { useState, useEffect } from 'react'
import { Mail, CheckCircle, Phone, Building, Trash2, AlertTriangle, X } from 'lucide-react'
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
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Mensajes de Contacto</h1>
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0 ? `${unreadCount} mensaje(s) sin leer` : 'Todos los mensajes leídos'} • Total: {messages.length}
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={!message.read ? 'border-l-4 border-l-primary' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{message.name}</h3>
                    {!message.read && (
                      <Badge className="bg-primary">Nuevo</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${message.email}`} className="hover:text-primary">
                        {message.email}
                      </a>
                    </span>
                    {message.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${message.phone}`} className="hover:text-primary">
                          {message.phone}
                        </a>
                      </span>
                    )}
                    {message.company && (
                      <span className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {message.company}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-sm text-muted-foreground">{formatDate(message.createdAt)}</p>
                  <div className="flex gap-1">
                    {!message.read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marcar leído
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteConfirm(message)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
              
              {message.subject && (
                <p className="font-medium text-sm mb-2">Asunto: {message.subject}</p>
              )}
              
              <div className="bg-accent/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              </div>
              
              {message.consent && (
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  Aceptó la política de tratamiento de datos
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay mensajes de contacto</p>
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
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">De:</span>
                  <span className="text-sm">{deleteConfirm.name}</span>
                  <span className="text-xs text-muted-foreground">({deleteConfirm.email})</span>
                </div>
                {deleteConfirm.subject && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Asunto:</span>
                    <span className="text-sm">{deleteConfirm.subject}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Fecha:</span>
                  <span className="text-sm text-muted-foreground">{formatDate(deleteConfirm.createdAt)}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground text-center">
                ¿Estás seguro de que deseas eliminar este mensaje?
              </p>
            </div>
          )}
          
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
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
