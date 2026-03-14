'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

interface PlatformConfig {
  siteName: string
  logoUrl: string | null
}

interface HeaderProps {
  config: PlatformConfig
}

export function Header({ config }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  // Cerrar al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Quiénes Somos', href: '/quienes-somos' },
    { name: 'Noticias', href: '/noticias' },
    { name: 'Contacto', href: '/contacto' },
  ]

  const logoUrl = config.logoUrl || '/logo.png'
  const siteName = config.siteName || 'Green Axis S.A.S.'

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full backdrop-blur-md transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-[#0a1a1f]/95 shadow-lg shadow-green-100/20 dark:shadow-[#005A7A]/10 border-b border-green-100 dark:border-[#1a3a40]'
          : 'bg-white/80 dark:bg-[#0a1a1f]/80 border-b border-transparent'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 md:h-12 w-auto transition-transform group-hover:scale-105">
              <Image
                src={logoUrl}
                alt={siteName}
                width={140}
                height={48}
                className="h-10 md:h-12 w-auto object-contain dark:brightness-0 dark:invert"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-5 py-2.5 text-sm font-medium transition-colors rounded-lg',
                  isActive(item.href)
                    ? 'text-[#6BBE45] dark:text-[#8BC34A] bg-green-50 dark:bg-[#1a3a40]'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] hover:bg-green-50 dark:hover:bg-[#1a3a40]'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Button
              asChild
              size="default"
              className="bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white font-semibold px-6 shadow-lg shadow-green-500/25 dark:shadow-green-400/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-500/30"
            >
              <Link href="/contacto">Solicitar Cotización</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] hover:bg-green-50 dark:hover:bg-[#1a3a40] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={cn(
          'lg:hidden relative z-50 border-t border-green-100 dark:border-[#1a3a40] bg-white dark:bg-[#0a1a1f] transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-[calc(100dvh-4rem)]' : 'max-h-0'
        )}
      >
        <nav className="container mx-auto px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-all',
                isActive(item.href)
                  ? 'bg-[#6BBE45]/10 dark:bg-[#8BC34A]/10 text-[#6BBE45] dark:text-[#8BC34A]'
                  : 'text-gray-700 dark:text-gray-200 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] hover:bg-green-50 dark:hover:bg-[#1a3a40]'
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
              {isActive(item.href) && (
                <span className="w-2 h-2 rounded-full bg-[#6BBE45] dark:bg-[#8BC34A]" />
              )}
            </Link>
          ))}
          <div className="pt-4 border-t border-green-100 dark:border-[#1a3a40] mt-2">
            <Button
              asChild
              className="w-full bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white font-semibold h-12 text-base"
            >
              <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>
                Solicitar Cotización
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
