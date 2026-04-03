'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import MediaPickerCompact from '@/components/media-picker-compact'

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
  portfolioEnabled: boolean
  portfolioTitle: string | null
  portfolioUrl: string | null
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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

  const updateConfig = (field: keyof PlatformConfig, value: string | boolean) => {
    setConfig(prev => prev ? { ...prev, [field]: value } : null)
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando configuración...</div>
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Configuración General</h1>
          <p className="text-sm text-muted-foreground">Personaliza la información de tu sitio web</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-nature text-white w-full sm:w-auto shrink-0">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
        {/* Tabs con scroll horizontal en móvil */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <TabsList className="bg-card flex w-max sm:w-auto min-w-full sm:min-w-0">
            <TabsTrigger value="general" className="shrink-0">General</TabsTrigger>
            <TabsTrigger value="contacto" className="shrink-0">Contacto</TabsTrigger>
            <TabsTrigger value="redes" className="shrink-0">Redes</TabsTrigger>
            <TabsTrigger value="whatsapp" className="shrink-0">WhatsApp</TabsTrigger>
            <TabsTrigger value="portafolio" className="shrink-0">Portafolio</TabsTrigger>
            <TabsTrigger value="footer" className="shrink-0">Footer</TabsTrigger>
            <TabsTrigger value="seo" className="shrink-0">SEO</TabsTrigger>
          </TabsList>
        </div>

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
                <MediaPickerCompact
                  value={config?.logoUrl || ''}
                  onChange={(url) => updateConfig('logoUrl', url)}
                  accept="image"
                  category="config"
                  fixedKey="config-logo"
                  recommendedSize="200x60px"
                  formatHint="Formato PNG o SVG con fondo transparente para mejor resultado"
                />
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <Label>Favicon (icono de pestaña)</Label>
                <MediaPickerCompact
                  value={config?.faviconUrl || ''}
                  onChange={(url) => updateConfig('faviconUrl', url)}
                  accept="image"
                  category="config"
                  fixedKey="config-favicon"
                  recommendedSize="32x32 o 64x64 píxeles"
                  formatHint="Formato PNG o ICO. El favicon aparece en la pestaña del navegador"
                />
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

        {/* Portafolio */}
        <TabsContent value="portafolio">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Portafolio Corporativo</CardTitle>
              <CardDescription>Configura la descarga del portafolio en la página principal, contacto y servicios.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                <div>
                  <p className="font-medium">Mostrar sección de portafolio</p>
                  <p className="text-sm text-muted-foreground">Aparecerá en la página principal, contacto y servicios</p>
                </div>
                <Switch
                  checked={config?.portfolioEnabled ?? false}
                  onCheckedChange={(checked) => updateConfig('portfolioEnabled', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioTitle">Título de la Sección</Label>
                <Input
                  id="portfolioTitle"
                  value={config?.portfolioTitle || ''}
                  onChange={(e) => updateConfig('portfolioTitle', e.target.value)}
                  placeholder="Descarga Nuestro Portafolio Corporativo"
                />
                <p className="text-xs text-muted-foreground">
                  Este texto aparecerá encima del botón de descarga
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolioUrl">URL del Portafolio (PDF o enlace externo)</Label>
                <Input
                  id="portfolioUrl"
                  value={config?.portfolioUrl || ''}
                  onChange={(e) => updateConfig('portfolioUrl', e.target.value)}
                  placeholder="https://ejemplo.com/portafolio.pdf"
                />
                <p className="text-xs text-muted-foreground">
                  Puede ser un enlace a un PDF en Google Drive, Dropbox, o cualquier URL externa
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium">Dónde aparecerá:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Página principal: Debajo de la sección de servicios</li>
                  <li>Página de contacto: Debajo del formulario de cotización</li>
                  <li>Página de servicios: Debajo del catálogo completo</li>
                  <li>Servicios individuales: Opcionalmente en cada servicio (configurable por servicio)</li>
                </ul>
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
