'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [logoUrl, setLogoUrl] = useState('/logo.png')
  const [siteName, setSiteName] = useState('Green Axis')
  const [companyEmail, setCompanyEmail] = useState('')

  useEffect(() => {
    // Obtener configuración para el logo
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.logoUrl) setLogoUrl(data.logoUrl)
        if (data.siteName) setSiteName(data.siteName)
        if (data.companyEmail) setCompanyEmail(data.companyEmail)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div style={{ position: 'relative', width: 200, height: 64, margin: '0 auto 2rem auto' }} className="flex-shrink-0">
          <Image 
            src={logoUrl} 
            alt={siteName} 
            fill
            className="object-contain"
            sizes="200px"
            priority
            unoptimized
          />
        </div>

        {/* 404 Illustration */}
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-primary/10 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-24 w-24 text-primary/40" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          ¡Página no encontrada!
        </h1>
        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida. 
          Puede que el enlace esté roto o la página haya sido eliminada.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver atrás
          </button>
        </div>

        {/* Help text */}
        {companyEmail && (
          <p className="mt-8 text-sm text-muted-foreground">
            ¿Problemas? Contáctanos en{' '}
            <a 
              href={`mailto:${companyEmail}`}
              className="text-primary hover:underline"
            >
              {companyEmail}
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
