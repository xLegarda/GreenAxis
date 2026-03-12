'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Lock, Eye, EyeOff, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

function RestablecerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [validToken, setValidToken] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setValidToken(false)
      setVerifying(false)
      return
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`)
        const data = await response.json()

        if (data.valid) {
          setValidToken(true)
          setEmail(data.email)
        } else {
          setValidToken(false)
        }
      } catch {
        setValidToken(false)
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Error al restablecer contraseña')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Shield className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Verificando enlace...</p>
        </div>
      </div>
    )
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
            <CardTitle className="text-2xl font-bold">Contraseña Actualizada</CardTitle>
            <CardDescription>
              Tu contraseña ha sido restablecida exitosamente
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <Button 
              className="w-full gradient-nature text-white"
              onClick={() => router.push('/portal-interno')}
            >
              Ir al login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1 text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Enlace Inválido</CardTitle>
            <CardDescription>
              Este enlace ha expirado o no es válido
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4 space-y-3">
            <Button 
              className="w-full gradient-nature text-white"
              onClick={() => router.push('/portal-interno/recuperar-clave')}
            >
              Solicitar nuevo enlace
            </Button>
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => router.push('/portal-interno')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al login
            </Button>
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
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Nueva Contraseña</CardTitle>
          <CardDescription>
            Crea una nueva contraseña para {email}
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
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
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
              {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RestablecerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Shield className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    }>
      <RestablecerContent />
    </Suspense>
  )
}
