'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'

interface PlatformConfig {
  id: string
  siteName: string
  siteUrl: string | null
  siteSlogan: string | null
  siteDescription: string | null
  logoUrl: string | null
  faviconUrl: string | null
  companyName: string | null
  companyAddress: string | null
  companyPhone: string | null
  companyEmail: string | null
  notificationEmail: string | null
  facebookUrl: string | null
  instagramUrl: string | null
  twitterUrl: string | null
  linkedinUrl: string | null
  tiktokUrl: string | null
  youtubeUrl: string | null
  whatsappNumber: string | null
  whatsappMessage: string | null
  whatsappShowBubble: boolean
  metaKeywords: string | null
  googleAnalytics: string | null
  googleMapsEmbed: string | null
  primaryColor: string | null
  footerText: string | null
  socialText: string | null
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        setConfig(await response.json())
      }
    } catch (error) {
      console.error('Error fetching config:', error)
      toast({ title: 'Error', description: 'No se pudo cargar la configuración', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (response.ok) {
        toast({ title: 'Guardado', description: 'La configuración se guardó correctamente' })
        fetchConfig()
      } else {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      console.error('Error saving config:', error)
      toast({ title: 'Error', description: 'No se pudo guardar la configuración', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', field === 'logoUrl' ? 'logo' : 'favicon')
    formData.append('label', field === 'logoUrl' ? 'Logo del sitio' : 'Favicon')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(prev => prev ? { ...prev, [field]: data.url } : null)
        toast({ title: 'Imagen actualizada', description: 'Se subió correctamente' })
      }
    } catch (error) {
      console.error('Error uploading:', error)
      toast({ title: 'Error', description: 'No se pudo subir la imagen', variant: 'destructive' })
    }
  }

  const updateConfig = (field: keyof PlatformConfig, value: string | boolean) => {
    setConfig(prev => prev ? { ...prev, [field]: value } : null)
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando configuración...</div>
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración General</h1>
          <p className="text-sm text-muted-foreground">Personaliza la información de tu sitio web</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-nature text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
          <TabsTrigger value="redes">Redes Sociales</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Información del Sitio</CardTitle>
              <CardDescription>Datos básicos que aparecen en todo el sitio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo */}
              <div className="space-y-2">
                <Label>Logo del Sitio</Label>
                <div className="flex items-start gap-4">
                  {config?.logoUrl ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-accent">
                      <img src={config.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      <button
                        onClick={() => updateConfig('logoUrl', '')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Subir logo</span>
                    </button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                  />
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <Label>Favicon (icono de pestaña)</Label>
                <div className="flex items-start gap-4">
                  {config?.faviconUrl ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-accent">
                      <img src={config.faviconUrl} alt="Favicon" className="w-full h-full object-contain" />
                      <button
                        onClick={() => updateConfig('faviconUrl', '')}
                        className="absolute top-0 right-0 p-0.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => faviconInputRef.current?.click()}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors"
                    >
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Favicon</span>
                    </button>
                  )}
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'faviconUrl')}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Recomendado: 32x32 o 64x64 píxeles en formato PNG o ICO</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sitio</Label>
                  <Input
                    id="siteName"
                    value={config?.siteName || ''}
                    onChange={(e) => updateConfig('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">URL del Sitio (para compartir)</Label>
                  <Input
                    id="siteUrl"
                    value={config?.siteUrl || ''}
                    onChange={(e) => updateConfig('siteUrl', e.target.value)}
                    placeholder="https://greenaxis.com.co"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL pública del sitio para compartir en redes sociales. Ej: https://greenaxis.com.co
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteSlogan">Eslogan</Label>
                <Input
                  id="siteSlogan"
                  value={config?.siteSlogan || ''}
                  onChange={(e) => updateConfig('siteSlogan', e.target.value)}
                  placeholder="Comprometidos con el medio ambiente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descripción del Sitio</Label>
                <Textarea
                  id="siteDescription"
                  value={config?.siteDescription || ''}
                  onChange={(e) => updateConfig('siteDescription', e.target.value)}
                  rows={3}
                  placeholder="Descripción breve de la empresa..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contacto */}
        <TabsContent value="contacto">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>Datos de contacto que aparecen en el pie de página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nombre de la Empresa</Label>
                <Input
                  id="companyName"
                  value={config?.companyName || ''}
                  onChange={(e) => updateConfig('companyName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Dirección</Label>
                <Input
                  id="companyAddress"
                  value={config?.companyAddress || ''}
                  onChange={(e) => updateConfig('companyAddress', e.target.value)}
                  placeholder="Calle 123 #45-67, Bogotá, Colombia"
                />
                <p className="text-xs text-muted-foreground">
                  Esta dirección se usará para mostrar un mapa automáticamente en la página principal.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Teléfono</Label>
                  <Input
                    id="companyPhone"
                    value={config?.companyPhone || ''}
                    onChange={(e) => updateConfig('companyPhone', e.target.value)}
                    placeholder="+57 300 123 4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={config?.companyEmail || ''}
                    onChange={(e) => updateConfig('companyEmail', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="notificationEmail">Email para Notificaciones</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={config?.notificationEmail || ''}
                  onChange={(e) => updateConfig('notificationEmail', e.target.value)}
                  placeholder="notificaciones@tuempresa.com"
                />
                <p className="text-xs text-muted-foreground">
                  Aquí llegarán los mensajes del formulario de contacto. Si está vacío, se usará el email principal.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redes Sociales */}
        <TabsContent value="redes">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Redes Sociales</CardTitle>
              <CardDescription>Los iconos solo aparecerán si tienen URL configurada. Deja vacío para ocultar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'facebookUrl', label: 'Facebook', placeholder: 'https://facebook.com/tuempresa' },
                { id: 'instagramUrl', label: 'Instagram', placeholder: 'https://instagram.com/tuempresa' },
                { id: 'twitterUrl', label: 'Twitter/X', placeholder: 'https://twitter.com/tuempresa' },
                { id: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/tuempresa' },
                { id: 'tiktokUrl', label: 'TikTok', placeholder: 'https://tiktok.com/@tuempresa' },
                { id: 'youtubeUrl', label: 'YouTube', placeholder: 'https://youtube.com/@tuempresa' },
              ].map((social) => (
                <div key={social.id} className="space-y-2">
                  <Label htmlFor={social.id}>{social.label}</Label>
                  <Input
                    id={social.id}
                    value={(config as any)?.[social.id] || ''}
                    onChange={(e) => updateConfig(social.id as keyof PlatformConfig, e.target.value)}
                    placeholder={social.placeholder}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp */}
        <TabsContent value="whatsapp">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>WhatsApp Flotante</CardTitle>
              <CardDescription>Configura el botón de WhatsApp que siempre está visible en el sitio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <p className="font-medium">Mostrar botón de WhatsApp</p>
                  <p className="text-sm text-muted-foreground">El botón flotante aparecerá en todas las páginas</p>
                </div>
                <Switch
                  checked={config?.whatsappShowBubble ?? true}
                  onCheckedChange={(checked) => updateConfig('whatsappShowBubble', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">Número de WhatsApp</Label>
                <Input
                  id="whatsappNumber"
                  value={config?.whatsappNumber || ''}
                  onChange={(e) => updateConfig('whatsappNumber', e.target.value)}
                  placeholder="573001234567 (sin + ni espacios)"
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa el número con código de país, sin el símbolo + ni espacios. Ejemplo: 573001234567
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappMessage">Mensaje Predeterminado</Label>
                <Textarea
                  id="whatsappMessage"
                  value={config?.whatsappMessage || ''}
                  onChange={(e) => updateConfig('whatsappMessage', e.target.value)}
                  rows={3}
                  placeholder="¡Hola! Me gustaría obtener información sobre sus servicios ambientales."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Footer */}
        <TabsContent value="footer">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Configuración del Footer</CardTitle>
              <CardDescription>Personaliza los textos que aparecen en el pie de página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="socialText">Texto de Redes Sociales</Label>
                <Input
                  id="socialText"
                  value={config?.socialText || ''}
                  onChange={(e) => updateConfig('socialText', e.target.value)}
                  placeholder="Síguenos en nuestras redes"
                />
                <p className="text-xs text-muted-foreground">
                  Este texto aparece encima de los iconos de redes sociales en el footer.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="footerText">Texto Adicional del Footer</Label>
                <Textarea
                  id="footerText"
                  value={config?.footerText || ''}
                  onChange={(e) => updateConfig('footerText', e.target.value)}
                  rows={2}
                  placeholder="Texto adicional para el pie de página (opcional)"
                />
                <p className="text-xs text-muted-foreground">
                  Aparece debajo del copyright. Útil para agregar información de licencias, certificaciones, etc.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Nota:</strong> El copyright "© {new Date().getFullYear()} [Nombre del Sitio]. Todos los derechos reservados." se genera automáticamente con el año actual y el nombre del sitio configurado arriba.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>SEO y Analytics</CardTitle>
              <CardDescription>Configuración para motores de búsqueda y análisis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Palabras Clave (Keywords)</Label>
                <Input
                  id="metaKeywords"
                  value={config?.metaKeywords || ''}
                  onChange={(e) => updateConfig('metaKeywords', e.target.value)}
                  placeholder="servicios ambientales, medio ambiente, Colombia, gestión de residuos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={config?.googleAnalytics || ''}
                  onChange={(e) => updateConfig('googleAnalytics', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground">
                  Formato: G-XXXXXXXXXX (10 caracteres después de G-)
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="googleMapsEmbed">Google Maps (iframe embed)</Label>
                <Textarea
                  id="googleMapsEmbed"
                  value={config?.googleMapsEmbed || ''}
                  onChange={(e) => updateConfig('googleMapsEmbed', e.target.value)}
                  rows={3}
                  placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
                />
                <p className="text-xs text-muted-foreground">
                  Opcional. Si lo dejas vacío, se generará un mapa automáticamente con la dirección configurada arriba.
                  Para obtener el embed: ve a Google Maps → Compartir → Incorporar un mapa → Copiar iframe.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
