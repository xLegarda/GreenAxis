'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, ExternalLink, ChevronDown, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import { COUNTRIES, validatePhone, getCountryHint } from '@/lib/phone-validation'

function normalizeUrl(url: string | null | undefined): string {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

interface PlatformConfig {
  siteName: string
  companyAddress: string | null
  companyPhone: string | null
  companyEmail: string | null
  googleMapsEmbed: string | null
  portfolioEnabled: boolean
  portfolioTitle: string | null
  portfolioUrl: string | null
}

interface ContactPageContentProps {
  config: PlatformConfig
}

export function ContactPageContent({ config }: ContactPageContentProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+57',
    company: '',
    subject: '',
    message: ''
  })
  const [phoneHint, setPhoneHint] = useState(getCountryHint('+57'))
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false)
  
  // Extraer la URL del iframe si existe
  const getEmbedSrc = () => {
    if (config.googleMapsEmbed) {
      // Si es un iframe completo, extraer el src
      const srcMatch = config.googleMapsEmbed.match(/src=["']([^"']+)["']/)
      if (srcMatch) return srcMatch[1]
      // Si es solo la URL, usarla directamente
      if (config.googleMapsEmbed.startsWith('http')) return config.googleMapsEmbed
    }
    
    // Si solo hay dirección, crear embed URL
    if (config.companyAddress) {
      const encodedAddress = encodeURIComponent(config.companyAddress)
      return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    }
    
    return null
  }

  // Crear URL para abrir en Google Maps
  const getGoogleMapsUrl = () => {
    if (config.companyAddress) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.companyAddress)}`
    }
    return null
  }
  
  const embedSrc = getEmbedSrc()
  const externalMapUrl = getGoogleMapsUrl()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!consent) {
      toast({
        title: 'Error',
        description: 'Debes aceptar la política de tratamiento de datos personales.',
        variant: 'destructive'
      })
      return
    }

    if (formData.phone.trim()) {
      const phoneValidation = validatePhone(formData.phone, formData.countryCode)
      if (!phoneValidation.valid) {
        setPhoneError(phoneValidation.error || 'Número de teléfono inválido')
        toast({
          title: 'Error',
          description: phoneValidation.error || 'Número de teléfono inválido',
          variant: 'destructive'
        })
        return
      }
      setPhoneError('')
    }
    
    setLoading(true)
    
    try {
      const fullPhone = formData.phone.trim() ? `${formData.countryCode} ${formData.phone.trim()}` : ''
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          company: formData.company,
          subject: formData.subject,
          message: formData.message,
          consent: true
        })
      })
      
      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+57',
          company: '',
          subject: '',
          message: ''
        })
        setConsent(false)
        setPhoneError('')
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast({
          title: 'Error',
          description: errorData.error || 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al enviar el mensaje. Por favor intenta de nuevo.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#6BBE45] py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Estamos aquí para ayudarte con tus necesidades ambientales.
          </p>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Información de Contacto
              </h2>
              
              <div className="space-y-6">
                {config.companyAddress && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Dirección</h3>
                      <p className="text-muted-foreground">{config.companyAddress}</p>
                    </div>
                  </div>
                )}
                
                {config.companyPhone && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Teléfono</h3>
                      <a href={`tel:${config.companyPhone}`} className="text-muted-foreground hover:text-primary">
                        {config.companyPhone}
                      </a>
                    </div>
                  </div>
                )}
                
                {config.companyEmail && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Correo Electrónico</h3>
                      <a href={`mailto:${config.companyEmail}`} className="text-muted-foreground hover:text-primary">
                        {config.companyEmail}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Map */}
              {embedSrc && (
                <div className="mt-8 rounded-xl overflow-hidden h-64 relative border border-border shadow-lg">
                  <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación"
                  />
                  {externalMapUrl && (
                    <a
                      href={externalMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-xs font-medium text-foreground hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Abrir
                    </a>
                  )}
                </div>
              )}
            </div>
            
            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-lg">
              {success ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Gracias por contactarnos. Te responderemos lo antes posible.
                  </p>
                  <Button onClick={() => setSuccess(false)} className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white">
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Solicitar Cotización
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Tu nombre"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@correo.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                            className="flex items-center justify-between w-[120px] h-10 px-3 border border-input bg-background rounded-md text-sm hover:bg-accent"
                          >
                            <span>{formData.countryCode}</span>
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </button>
                          {countryDropdownOpen && (
                            <div className="absolute z-50 w-[180px] max-h-[200px] overflow-auto mt-1 bg-popover border rounded-md shadow-lg">
                                {COUNTRIES.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, countryCode: country.code })
                                    setCountryDropdownOpen(false)
                                    setPhoneError('')
                                    setPhoneHint(getCountryHint(country.code))
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-accent ${
                                    formData.countryCode === country.code ? 'bg-accent' : ''
                                  }`}
                                >
                                  {country.code} {country.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d\s\-()]/g, '')
                            setFormData({ ...formData, phone: value })
                            if (phoneError) setPhoneError('')
                          }}
                          placeholder={phoneHint}
                          className="flex-1"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-sm text-red-500">{phoneError}</p>
                      )}
                    </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Nombre de tu empresa"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="¿En qué podemos ayudarte?"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje *</Label>
                      <Textarea
                        id="message"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe tu consulta o los servicios que necesitas..."
                        className="min-h-[150px]"
                      />
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked as boolean)}
                      />
                      <Label htmlFor="consent" className="text-sm text-muted-foreground leading-tight">
                        Acepto la{' '}
                        <Link href="/privacidad" className="text-primary hover:underline">
                          Política de Tratamiento de Datos Personales
                        </Link>
                        {' '}y autorizo el uso de mis datos para ser contactado.
                      </Label>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-[#6BBE45] hover:bg-[#5CAE38] text-white font-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        'Enviando...'
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Portfolio Download Section */}
      {config.portfolioEnabled && config.portfolioUrl && (
        <section className="py-16 bg-gradient-to-br from-[#005A7A]/5 to-[#6BBE45]/5 dark:from-[#003D52]/20 dark:to-[#8BC34A]/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-[#0f252d] rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="shrink-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-[#6BBE45] to-[#5CAE38] dark:from-[#8BC34A] dark:to-[#7AB83A] flex items-center justify-center shadow-lg animate-bounce-slow">
                      <FileText className="h-10 w-10 md:h-12 md:w-12 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-[#005A7A] dark:text-white mb-2">
                      {config.portfolioTitle || 'Descarga Nuestro Portafolio Corporativo'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Conoce todos nuestros servicios y soluciones ambientales en un solo documento
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white font-medium px-8 shadow-lg"
                    >
                      <a href={normalizeUrl(config.portfolioUrl)} target="_blank" rel="noopener noreferrer">
                        <Download className="h-5 w-5 mr-2" />
                        Descargar Portafolio
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
