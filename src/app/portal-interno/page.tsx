'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Leaf, Lock, Mail, User, Eye, EyeOff, Shield, AlertTriangle, PlusCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { validatePassword } from '@/lib/password-validator'

type Mode = 'checking' | 'login' | 'setup' | 'register'

function PortalInternoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/admin'
  
  const [mode, setMode] = useState<Mode>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [maxAccounts, setMaxAccounts] = useState(2)
  const [currentCount, setCurrentCount] = useState(0)
  
  useEffect(() => {
    // Verificar si ya está autenticado
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    try {
      // Primero verificar si ya está autenticado
      const authRes = await fetch('/api/auth/check')
      const authData = await authRes.json()
      
      if (authData.authenticated) {
        router.push(redirect)
        return
      }
      
      // Verificar si existe un administrador y cuántos hay
      const setupRes = await fetch('/api/auth/setup')
      const setupData = await setupRes.json()
      
      setMaxAccounts(setupData.maxAccounts || 2)
      setCurrentCount(setupData.count || 0)
      
      if (!setupData.exists) {
        // No hay cuentas, mostrar setup inicial
        setMode('setup')
      } else if (setupData.canCreate) {
        // Hay cuentas pero se pueden crear más
        setMode('login')
      } else {
        // Límite alcanzado, solo login
        setMode('login')
      }
    } catch {
      setMode('login')
    }
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        router.push(redirect)
      } else {
        setError(data.error || 'Error al iniciar sesión')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    
    const validation = validatePassword(password)
    if (!validation.valid) {
      setError(validation.errors.join(', '))
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || 'Administrador' })
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Ahora iniciar sesión
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
        
        if (loginRes.ok) {
          router.push(redirect)
        } else {
          setError('Cuenta creada. Por favor inicia sesión.')
          setMode('login')
        }
      } else {
        setError(data.error || 'Error al crear la cuenta')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }
  
  if (mode === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Leaf className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Verificando...</p>
        </div>
      </div>
    )
  }
  
  const showRegisterTab = (mode === 'login' || mode === 'register') && currentCount < maxAccounts
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {mode === 'setup' ? 'Configuración Inicial' : 'Portal Interno'}
          </CardTitle>
          <CardDescription>
            {mode === 'setup' 
              ? 'Crea la cuenta de administrador'
              : 'Acceso restringido a personal autorizado'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4">
          {mode === 'setup' && (
            <Alert className="mb-4 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Esta es la primera vez que se accede. Cree una cuenta de administrador segura.
              </AlertDescription>
            </Alert>
          )}
          
          {showRegisterTab && (
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                className={`flex-1 ${mode === 'login' ? 'bg-primary text-white' : ''}`}
                onClick={() => setMode('login')}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="outline" 
                className={`flex-1 ${mode === 'register' ? 'bg-primary text-white' : ''}`}
                onClick={() => {
                  setMode('register')
                  setPassword('')
                  setConfirmPassword('')
                  setError('')
                }}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Registrar
              </Button>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {(mode === 'setup' || mode === 'register') && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 text-sm">
                Cuentas registradas: {currentCount} / {maxAccounts}
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={mode === 'setup' || mode === 'register' ? handleSetup : handleLogin} className="space-y-4">
            {(mode === 'setup' || mode === 'register') && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre (opcional)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="pl-10"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ejemplo.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
            
            {(mode === 'setup' || mode === 'register') && (
              <div className="space-y-1.5 rounded-lg border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Requisitos de contraseña</p>
                {validatePassword(password).rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {rule.passed ? (
                      <Check className="h-3.5 w-3.5 text-green-600 shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                    )}
                    <span className={rule.passed ? 'text-green-700' : 'text-muted-foreground'}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {(mode === 'setup' || mode === 'register') && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full gradient-nature text-white"
              disabled={loading || ((mode === 'setup' || mode === 'register') && !validatePassword(password).valid)}
            >
              {loading ? 'Procesando...' : mode === 'setup' ? 'Crear cuenta' : mode === 'register' ? 'Registrarse' : 'Iniciar sesión'}
            </Button>
            
            {mode === 'login' && (
              <div className="text-center mt-4">
                <a 
                  href="/portal-interno/recuperar-clave" 
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PortalInternoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Leaf className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    }>
      <PortalInternoContent />
    </Suspense>
  )
}
