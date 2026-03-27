'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Eye, EyeOff, Image as ImageIcon, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import MediaPickerCompact from '@/components/media-picker-compact'

interface PlatformConfig {
  id: string
  aboutImageUrl: string | null
  aboutTitle: string | null
  aboutDescription: string | null
  aboutYearsExperience: string | null
  aboutYearsText: string | null
  aboutStats: string | null
  aboutFeatures: string | null
  aboutSectionEnabled: boolean
  aboutBadge: string | null
  aboutBadgeColor: string | null
  showMapSection: boolean
}

interface Stat {
  icon: string
  value: string
  label: string
  bullet?: string
}

const iconOptions = [
  { value: 'Users', label: 'Usuarios' },
  { value: 'Target', label: 'Objetivo' },
  { value: 'Award', label: 'Premio' },
  { value: 'CheckCircle', label: 'Check' },
]

export default function QuienesSomosPage() {
  const [config, setConfig] = useState<PlatformConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState<Stat[]>([])
  const [features, setFeatures] = useState<string[]>([])

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/admin/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
        
        // Parsear stats
        if (data.aboutStats) {
          try {
            setStats(JSON.parse(data.aboutStats))
          } catch {
            setStats([
              { icon: 'Users', value: '500', label: 'Clientes Satisfechos', bullet: '+' },
              { icon: 'Target', value: '15', label: 'Años de Experiencia', bullet: '+' },
              { icon: 'Award', value: '50', label: 'Proyectos Completados', bullet: '+' },
            ])
          }
        } else {
          setStats([
            { icon: 'Users', value: '500', label: 'Clientes Satisfechos', bullet: '+' },
            { icon: 'Target', value: '15', label: 'Años de Experiencia', bullet: '+' },
            { icon: 'Award', value: '50', label: 'Proyectos Completados', bullet: '+' },
          ])
        }
        
        // Parsear features
        if (data.aboutFeatures) {
          try {
            setFeatures(JSON.parse(data.aboutFeatures))
          } catch {
            setFeatures([
              'Equipo profesional altamente calificado',
              'Tecnología de última generación',
              'Cumplimiento normativo garantizado',
              'Atención personalizada 24/7'
            ])
          }
        } else {
          setFeatures([
            'Equipo profesional altamente calificado',
            'Tecnología de última generación',
            'Cumplimiento normativo garantizado',
            'Atención personalizada 24/7'
          ])
        }
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
        body: JSON.stringify({
          ...config,
          aboutStats: JSON.stringify(stats),
          aboutFeatures: JSON.stringify(features),
        })
      })
      
      if (response.ok) {
        toast({ title: 'Guardado', description: 'La sección Quiénes Somos se actualizó correctamente' })
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

  const addStat = () => {
    setStats([...stats, { icon: 'Users', value: '', label: '', bullet: '' }])
  }

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    setFeatures([...features, ''])
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quiénes Somos</h1>
          <p className="text-sm text-muted-foreground">Configura la sección "Sobre Nosotros" del landing page</p>
        </div>
        <div className="flex flex-col sm:flex-row-reverse sm:items-center gap-3 sm:gap-4">
          <Button onClick={handleSave} disabled={saving} className="gradient-nature text-white w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <div className="flex items-center justify-between sm:justify-start gap-2 bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-lg">
            <span className="text-sm text-muted-foreground font-medium sm:font-normal">
              {config?.aboutSectionEnabled ? 'Ocultar sección' : 'Mostrar sección'}
            </span>
            <Switch
              checked={config?.aboutSectionEnabled ?? true}
              onCheckedChange={(checked) => updateConfig('aboutSectionEnabled', checked)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="caracteristicas">Características</TabsTrigger>
          <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Contenido Principal</CardTitle>
              <CardDescription>Configura el título, descripción e imagen de la sección</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Imagen */}
              <div className="space-y-2">
                <Label>Imagen de la sección</Label>
                <MediaPickerCompact
                  value={config?.aboutImageUrl || ''}
                  onChange={(url) => updateConfig('aboutImageUrl', url)}
                  accept="image"
                  category="config"
                  fixedKey="config-about-image"
                  recommendedSize="800x600px"
                  formatHint="Imagen que aparece en la sección 'Quiénes Somos' de la página principal"
                />
              </div>

              {/* Badge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto del Badge</Label>
                  <Input
                    value={config?.aboutBadge || ''}
                    onChange={(e) => updateConfig('aboutBadge', e.target.value)}
                    placeholder="Sobre Nosotros"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color del Badge</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config?.aboutBadgeColor || '#6BBE45'}
                      onChange={(e) => updateConfig('aboutBadgeColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={config?.aboutBadgeColor || '#6BBE45'}
                      onChange={(e) => updateConfig('aboutBadgeColor', e.target.value)}
                      placeholder="#6BBE45"
                    />
                  </div>
                </div>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={config?.aboutTitle || ''}
                  onChange={(e) => updateConfig('aboutTitle', e.target.value)}
                  placeholder="Comprometidos con el futuro del planeta"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Textarea
                  value={config?.aboutDescription || ''}
                  onChange={(e) => updateConfig('aboutDescription', e.target.value)}
                  rows={4}
                  placeholder="Descripción de la empresa..."
                />
              </div>

              {/* Años de experiencia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Años de Experiencia</Label>
                  <Input
                    value={config?.aboutYearsExperience || ''}
                    onChange={(e) => updateConfig('aboutYearsExperience', e.target.value)}
                    placeholder="15+"
                  />
                  <p className="text-xs text-muted-foreground">Puede ser texto: "15+", "Más de 15 años", etc.</p>
                </div>
                <div className="space-y-2">
                  <Label>Texto de años</Label>
                  <Input
                    value={config?.aboutYearsText || ''}
                    onChange={(e) => updateConfig('aboutYearsText', e.target.value)}
                    placeholder="Años protegiendo el medio ambiente"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estadísticas */}
        <TabsContent value="estadisticas">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
              <CardDescription>Números destacados que aparecen en la sección</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <Label>Icono</Label>
                    <select
                      value={stat.icon}
                      onChange={(e) => updateStat(index, 'icon', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Valor</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2 w-20">
                    <Label>Viñeta</Label>
                    <Input
                      value={stat.bullet || ''}
                      onChange={(e) => updateStat(index, 'bullet', e.target.value)}
                      placeholder="+"
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Etiqueta</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      placeholder="Clientes Satisfechos"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeStat(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" onClick={addStat} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Estadística
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Características */}
        <TabsContent value="caracteristicas">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Características</CardTitle>
              <CardDescription>Lista de puntos destacados con check</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Característica destacada"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={addFeature} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Característica
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ubicación */}
        <TabsContent value="ubicacion">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Sección de Ubicación</CardTitle>
              <CardDescription>Controla la visibilidad del mapa en el landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {config?.showMapSection ? (
                    <Eye className="h-5 w-5 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Mostrar sección de ubicación</p>
                    <p className="text-sm text-muted-foreground">
                      Activa o desactiva el mapa en el landing page
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config?.showMapSection ?? true}
                  onCheckedChange={(checked) => updateConfig('showMapSection', checked)}
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                La dirección y el mapa se configuran en{' '}
                <a href="/admin/configuracion" className="text-primary hover:underline">
                  Configuración → Contacto
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
