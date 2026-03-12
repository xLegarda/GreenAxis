'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Quiénes Somos', href: '/quienes-somos' },
    { name: 'Noticias', href: '/noticias' },
    { name: 'Contacto', href: '/contacto' },
  ]

  const logoUrl = config.logoUrl || '/logo.png'
  const siteName = config.siteName || 'Green Axis S.A.S.'

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
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-auto transition-transform group-hover:scale-105">
              <Image
                src={logoUrl}
                alt={siteName}
                width={140}
                height={48}
                className="h-12 w-auto object-contain dark:brightness-0 dark:invert"
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
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-[#1a3a40]"
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
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] hover:bg-green-50 dark:hover:bg-[#1a3a40]"
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

      {/* Mobile Navigation */}
      <div
        className={cn(
          'lg:hidden border-t border-green-100 dark:border-[#1a3a40] bg-white dark:bg-[#0a1a1f] transition-all duration-300 overflow-hidden',
          mobileMenuOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <nav className="container mx-auto px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] hover:bg-green-50 dark:hover:bg-[#1a3a40] rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-green-100 dark:border-[#1a3a40] mt-4">
            <Button 
              asChild 
              className="w-full bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white font-semibold"
            >
              <Link href="/contacto">Solicitar Cotización</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
