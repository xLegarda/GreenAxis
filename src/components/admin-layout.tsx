'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Settings, 
  Wrench, 
  Newspaper, 
  Sliders, 
  FileText, 
  Mail,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
  Home,
  Users,
  Trash2,
  AlertTriangle,
  Library,
  LockKeyhole
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/theme-toggle'

interface Admin {
  id: string
  email: string
  name: string | null
}

interface AdminLayoutProps {
  children: React.ReactNode
  admin: Admin
}

const navItems = [
  { name: 'Inicio', href: '/admin', icon: Home },
  { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  { name: 'Sección Nosotros', href: '/admin/seccion-about', icon: Users },
  { name: 'Página Quiénes Somos', href: '/admin/quienes-somos', icon: FileText },
  { name: 'Servicios', href: '/admin/servicios', icon: Wrench },
  { name: 'Noticias', href: '/admin/noticias', icon: Newspaper },
  { name: 'Biblioteca', href: '/admin/imagenes', icon: Library },
  { name: 'Carrusel', href: '/admin/carrusel', icon: Sliders },
  { name: 'Páginas Legales', href: '/admin/legal', icon: FileText },
  { name: 'Mensajes', href: '/admin/mensajes', icon: Mail },
]

export function AdminLayout({ children, admin }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [adminCount, setAdminCount] = useState(0)
  const [sessionExpired, setSessionExpired] = useState(false)
  
  useEffect(() => {
    // Global 401 interceptor — detect session expiry
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      if (response.status === 401) {
        const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof URL ? args[0].href : ''
        if (url.startsWith('/api/')) {
          setSessionExpired(true)
        }
      }
      return response
    }
    return () => {
      window.fetch = originalFetch
    }
  }, [])

  useEffect(() => {
    // Fetch config to get logo
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => {
        if (data?.logoUrl) {
          setLogoUrl(data.logoUrl)
        } else {
          // Use default logo if no custom logo
          setLogoUrl('/logo.png')
        }
      })
      .catch(() => {
        // Default to logo.png on error
        setLogoUrl('/logo.png')
      })
    
    // Fetch admin count
    fetch('/api/auth/setup')
      .then(res => res.json())
      .then(data => {
        setAdminCount(data.count || 1)
      })
      .catch(() => {
        setAdminCount(1)
      })
  }, [])
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/portal-interno')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
  
  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        router.push('/portal-interno')
      } else {
        alert(data.error || 'Error al eliminar la cuenta')
        setShowDeleteDialog(false)
      }
    } catch {
      alert('Error de conexión')
      setShowDeleteDialog(false)
    } finally {
      setDeleting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-accent/30 flex overflow-x-hidden">
      {/* Session expired overlay */}
      {sessionExpired && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
              <LockKeyhole className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Sesión expirada</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Tu sesión ha caducado por inactividad. Por favor, inicia sesión de nuevo para continuar.
              </p>
            </div>
            <Button
              asChild
              className="w-full gradient-nature text-white h-11 font-semibold"
            >
              <Link href="/portal-interno">
                <LogOut className="h-4 w-4 mr-2" />
                Ir al inicio de sesión
              </Link>
            </Button>
          </div>
        </div>
      )}
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r shrink-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative" style={{ width: 120, height: 40 }}>
                <Image
                  src={logoUrl || '/logo.png'}
                  alt="Logo"
                  fill
                  className="object-contain"
                  sizes="120px"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <span className="font-bold text-foreground">Admin</span>
                <p className="text-xs text-muted-foreground">Panel de control</p>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#6BBE45] text-white'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#6BBE45]/10 flex items-center justify-center">
              <User className="h-4 w-4 text-[#6BBE45]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin.name || 'Administrador'}</p>
              <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href="/" target="_blank">
                <Home className="h-4 w-4 mr-1" />
                Ver sitio
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          
          {adminCount > 1 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar mi cuenta
            </Button>
          )}
        </div>
      </aside>
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative" style={{ width: 80, height: 32 }}>
              <Image
                src={logoUrl || '/logo.png'}
                alt="Logo"
                fill
                className="object-contain"
                sizes="80px"
                unoptimized
              />
            </div>
            <span className="font-bold">Admin</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/" target="_blank">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar - con overlay y animación */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-40 transition-opacity duration-300',
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setSidebarOpen(false)}
        style={{ background: 'rgba(0,0,0,0.5)' }}
      >
        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 w-72 max-w-[85vw] bg-card flex flex-col transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nav items con scroll */}
          <nav className="flex-1 overflow-y-auto p-4 pt-20 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[#6BBE45] text-white'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
          </nav>

          <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#6BBE45]/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-[#6BBE45]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{admin.name || 'Administrador'}</p>
                  <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mb-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>

              {adminCount > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSidebarOpen(false)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar mi cuenta
                </Button>
              )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-16 min-w-0 overflow-x-hidden">
        {children}
      </main>
      
      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Eliminar cuenta
            </DialogTitle>
            <DialogDescription className="pt-2">
              ¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
            <p className="text-sm text-red-800">
              <strong>Atención:</strong> Se eliminará permanentemente la cuenta asociada a <strong>{admin.email}</strong> y perderás acceso al panel de administración.
            </p>
          </div>
          
          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex-1"
            >
              {deleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
