'use client'

import { MapPin, ExternalLink } from 'lucide-react'

interface MapSectionProps {
  address: string | null
  googleMapsEmbed: string | null
  showSection?: boolean
}

export function MapSection({ address, googleMapsEmbed, showSection = true }: MapSectionProps) {
  // Si está desactivado, no mostrar la sección
  if (!showSection) return null
  
  // Si no hay dirección ni embed, no mostrar la sección
  if (!address && !googleMapsEmbed) return null

  // Extraer la URL del iframe si existe
  const getEmbedSrc = () => {
    if (googleMapsEmbed) {
      // Si es un iframe completo, extraer el src
      const srcMatch = googleMapsEmbed.match(/src=["']([^"']+)["']/)
      if (srcMatch) return srcMatch[1]
      // Si es solo la URL, usarla directamente
      if (googleMapsEmbed.startsWith('http')) return googleMapsEmbed
    }
    
    // Si solo hay dirección, crear embed URL
    if (address) {
      const encodedAddress = encodeURIComponent(address)
      return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    }
    
    return null
  }

  // Crear URL para abrir en Google Maps
  const getGoogleMapsUrl = () => {
    if (address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    }
    return null
  }

  const embedSrc = getEmbedSrc()
  const externalMapUrl = getGoogleMapsUrl()

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Ubicación</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Encuéntranos
          </h2>
          {address && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {address}
            </p>
          )}
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border">
          {embedSrc ? (
            <>
              <iframe
                src={embedSrc}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Ubicación"
              />
              {externalMapUrl && (
                <a
                  href={externalMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-foreground hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir en Maps
                </a>
              )}
            </>
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Mapa no disponible</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
