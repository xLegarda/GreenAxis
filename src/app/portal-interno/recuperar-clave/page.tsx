'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Mail, ArrowLeft, Send, Shield, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function RecuperarClavePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Error al enviar el correo')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1 text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Revisa tu correo</CardTitle>
            <CardDescription>
              Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                El enlace expira en 1 hora. Revisa también tu carpeta de spam.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/portal-interno')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico registrado para recibir un enlace de recuperación
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-nature text-white"
              disabled={loading}
            >
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar enlace de recuperación
                </>
              )}
            </Button>
            
            <Button 
              type="button"
              variant="ghost" 
              className="w-full"
              onClick={() => router.push('/portal-interno')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
