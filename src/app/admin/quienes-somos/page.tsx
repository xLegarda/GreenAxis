'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, MapPin, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import MediaPickerCompact from '@/components/media-picker-compact'

interface AboutPage {
  id: string
  heroTitle: string | null
  heroSubtitle: string | null
  heroImageUrl: string | null
  historyTitle: string | null
  historyContent: string | null
  historyImageUrl: string | null
  missionTitle: string | null
  missionContent: string | null
  visionTitle: string | null
  visionContent: string | null
  valuesTitle: string | null
  valuesContent: string | null
  teamTitle: string | null
  teamEnabled: boolean
  teamMembers: string | null
  whyChooseTitle: string | null
  whyChooseContent: string | null
  ctaTitle: string | null
  ctaSubtitle: string | null
  ctaButtonText: string | null
  ctaButtonUrl: string | null
  statsEnabled: boolean
  statsContent: string | null
  certificationsEnabled: boolean
  certificationsContent: string | null
  showLocationSection: boolean
}

interface ValueItem {
  title: string
  description: string
  icon: string
}

interface WhyChooseItem {
  title: string
  description: string
  icon: string
}

interface StatItem {
  value: string
  label: string
  icon: string
}

interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
}

const iconOptions = [
  { value: 'Users', label: 'Usuarios' },
  { value: 'Target', label: 'Objetivo' },
  { value: 'Award', label: 'Premio' },
  { value: 'Shield', label: 'Escudo' },
  { value: 'CheckCircle', label: 'Check' },
  { value: 'Clock', label: 'Reloj' },
  { value: 'Settings', label: 'Config' },
  { value: 'Heart', label: 'Corazón' },
  { value: 'Calendar', label: 'Calendario' },
  { value: 'FolderCheck', label: 'Carpeta' },
]

export default function QuienesSomosAdminPage() {
  const [page, setPage] = useState<AboutPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [values, setValues] = useState<ValueItem[]>([])
  const [whyChoose, setWhyChoose] = useState<WhyChooseItem[]>([])
  const [stats, setStats] = useState<StatItem[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])

  useEffect(() => {
    fetchPage()
  }, [])

  const fetchPage = async () => {
    try {
      const response = await fetch('/api/about')
      if (response.ok) {
        const data = await response.json()
        setPage(data)
        
        if (data.valuesContent) {
          try { setValues(JSON.parse(data.valuesContent)) } catch { /* ignore */ }
        }
        if (data.whyChooseContent) {
          try { setWhyChoose(JSON.parse(data.whyChooseContent)) } catch { /* ignore */ }
        }
        if (data.statsContent) {
          try { setStats(JSON.parse(data.statsContent)) } catch { /* ignore */ }
        }
        if (data.teamMembers) {
          try { setTeam(JSON.parse(data.teamMembers)) } catch { /* ignore */ }
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!page) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...page,
          valuesContent: JSON.stringify(values),
          whyChooseContent: JSON.stringify(whyChoose),
          statsContent: JSON.stringify(stats),
          teamMembers: JSON.stringify(team),
        }),
      })
      
      if (response.ok) {
        toast({ title: 'Guardado', description: 'La página se actualizó correctamente' })
        fetchPage()
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al guardar')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'No se pudo guardar', 
        variant: 'destructive' 
      })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof AboutPage, value: string | boolean) => {
    setPage(prev => prev ? { ...prev, [field]: value } : null)
  }

  // Values functions
  const addValue = () => setValues([...values, { title: '', description: '', icon: 'Shield' }])
  const updateValue = (index: number, field: keyof ValueItem, value: string) => {
    const newValues = [...values]
    newValues[index] = { ...newValues[index], [field]: value }
    setValues(newValues)
  }
  const removeValue = (index: number) => setValues(values.filter((_, i) => i !== index))

  // WhyChoose functions
  const addWhyChoose = () => setWhyChoose([...whyChoose, { title: '', description: '', icon: 'CheckCircle' }])
  const updateWhyChoose = (index: number, field: keyof WhyChooseItem, value: string) => {
    const newList = [...whyChoose]
    newList[index] = { ...newList[index], [field]: value }
    setWhyChoose(newList)
  }
  const removeWhyChoose = (index: number) => setWhyChoose(whyChoose.filter((_, i) => i !== index))

  // Stats functions
  const addStat = () => setStats([...stats, { value: '', label: '', icon: 'Users' }])
  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }
  const removeStat = (index: number) => setStats(stats.filter((_, i) => i !== index))

  // Team functions
  const addTeamMember = () => setTeam([...team, { name: '', role: '', image: '', bio: '' }])
  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newTeam = [...team]
    newTeam[index] = { ...newTeam[index], [field]: value }
    setTeam(newTeam)
  }
  const removeTeamMember = (index: number) => setTeam(team.filter((_, i) => i !== index))

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Página Quiénes Somos</h1>
          <p className="text-sm text-muted-foreground">Edita la página completa /quienes-somos</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-nature text-white">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-card flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="historia">Historia</TabsTrigger>
          <TabsTrigger value="mision">Misión/Visión</TabsTrigger>
          <TabsTrigger value="valores">Valores</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="elegirnos">Por qué elegirnos</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
          <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        {/* Hero */}
        <TabsContent value="hero">
          <Card>
            <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={page?.heroTitle || ''} onChange={(e) => updateField('heroTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input value={page?.heroSubtitle || ''} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Imagen</Label>
                <MediaPickerCompact
                  value={page?.heroImageUrl || ''}
                  onChange={(url) => updateField('heroImageUrl', url)}
                  accept="image"
                  category="config"
                  fixedKey="about-hero-image"
                  recommendedSize="1920x1080px"
                  formatHint="Imagen principal de la sección hero"
                  maxSizeMB={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historia */}
        <TabsContent value="historia">
          <Card>
            <CardHeader><CardTitle>Historia</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={page?.historyTitle || ''} onChange={(e) => updateField('historyTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Contenido</Label>
                <Textarea value={page?.historyContent || ''} onChange={(e) => updateField('historyContent', e.target.value)} rows={6} />
              </div>
              <div className="space-y-2">
                <Label>Imagen</Label>
                <MediaPickerCompact
                  value={page?.historyImageUrl || ''}
                  onChange={(url) => updateField('historyImageUrl', url)}
                  accept="image"
                  category="config"
                  fixedKey="about-history-image"
                  recommendedSize="800x600px"
                  formatHint="Imagen para la sección de historia"
                  maxSizeMB={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Misión y Visión */}
        <TabsContent value="mision">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Misión</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={page?.missionTitle || ''} onChange={(e) => updateField('missionTitle', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contenido</Label>
                  <Textarea value={page?.missionContent || ''} onChange={(e) => updateField('missionContent', e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Visión</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={page?.visionTitle || ''} onChange={(e) => updateField('visionTitle', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Contenido</Label>
                  <Textarea value={page?.visionContent || ''} onChange={(e) => updateField('visionContent', e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Valores */}
        <TabsContent value="valores">
          <Card>
            <CardHeader><CardTitle>Valores</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título de sección</Label>
                <Input value={page?.valuesTitle || ''} onChange={(e) => updateField('valuesTitle', e.target.value)} />
              </div>
              {values.map((value, index) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg">
                  <select 
                    value={value.icon} 
                    onChange={(e) => updateValue(index, 'icon', e.target.value)} 
                    className="h-10 rounded-md border bg-background px-3"
                  >
                    {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <Input value={value.title} onChange={(e) => updateValue(index, 'title', e.target.value)} placeholder="Título" />
                  <Input value={value.description} onChange={(e) => updateValue(index, 'description', e.target.value)} placeholder="Descripción" />
                  <Button variant="ghost" size="sm" onClick={() => removeValue(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addValue}><Plus className="h-4 w-4 mr-2" />Agregar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estadísticas */}
        <TabsContent value="estadisticas">
          <Card>
            <CardHeader><CardTitle>Estadísticas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <p className="font-medium">Mostrar estadísticas</p>
                <Switch checked={page?.statsEnabled ?? true} onCheckedChange={(checked) => updateField('statsEnabled', checked)} />
              </div>
              {page?.statsEnabled && (
                <>
                  {stats.map((stat, index) => (
                    <div key={index} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg">
                      <select 
                        value={stat.icon} 
                        onChange={(e) => updateStat(index, 'icon', e.target.value)} 
                        className="h-10 rounded-md border bg-background px-3"
                      >
                        {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      <Input value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} placeholder="500+" className="w-24" />
                      <Input value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} placeholder="Clientes" className="flex-1" />
                      <Button variant="ghost" size="sm" onClick={() => removeStat(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addStat}><Plus className="h-4 w-4 mr-2" />Agregar</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Por qué elegirnos */}
        <TabsContent value="elegirnos">
          <Card>
            <CardHeader><CardTitle>Por qué elegirnos</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={page?.whyChooseTitle || ''} onChange={(e) => updateField('whyChooseTitle', e.target.value)} />
              </div>
              {whyChoose.map((item, index) => (
                <div key={index} className="flex gap-2 items-center p-3 bg-muted/50 rounded-lg">
                  <select 
                    value={item.icon} 
                    onChange={(e) => updateWhyChoose(index, 'icon', e.target.value)} 
                    className="h-10 rounded-md border bg-background px-3"
                  >
                    {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  <div className="flex-1 space-y-2">
                    <Input value={item.title} onChange={(e) => updateWhyChoose(index, 'title', e.target.value)} placeholder="Título" />
                    <Input value={item.description} onChange={(e) => updateWhyChoose(index, 'description', e.target.value)} placeholder="Descripción" />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeWhyChoose(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addWhyChoose}><Plus className="h-4 w-4 mr-2" />Agregar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipo */}
        <TabsContent value="equipo">
          <Card>
            <CardHeader><CardTitle>Equipo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Mostrar equipo</p>
                  <p className="text-sm text-muted-foreground">Activa para mostrar los miembros</p>
                </div>
                <Switch checked={page?.teamEnabled ?? false} onCheckedChange={(checked) => updateField('teamEnabled', checked)} />
              </div>
              <div className="space-y-2">
                <Label>Título de sección</Label>
                <Input value={page?.teamTitle || ''} onChange={(e) => updateField('teamTitle', e.target.value)} />
              </div>
              {page?.teamEnabled && (
                <>
                  {team.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input value={member.name} onChange={(e) => updateTeamMember(index, 'name', e.target.value)} placeholder="Nombre" />
                        <Input value={member.role} onChange={(e) => updateTeamMember(index, 'role', e.target.value)} placeholder="Cargo" />
                      </div>
                      <Textarea value={member.bio} onChange={(e) => updateTeamMember(index, 'bio', e.target.value)} placeholder="Biografía" rows={2} />
                      <div className="flex gap-2">
                        <MediaPickerCompact
                          value={member.image}
                          onChange={(url) => updateTeamMember(index, 'image', url)}
                          accept="image"
                          category="config"
                          keyPrefix={`about-team-${index}`}
                          recommendedSize="400x400px"
                          formatHint="Foto del miembro del equipo (cuadrada)"
                          maxSizeMB={2}
                        />
                        <Button variant="ghost" onClick={() => removeTeamMember(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addTeamMember}><Plus className="h-4 w-4 mr-2" />Agregar miembro</Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ubicación */}
        <TabsContent value="ubicacion">
          <Card>
            <CardHeader>
              <CardTitle>Sección de Ubicación</CardTitle>
              <CardDescription>Controla la visibilidad del mapa en la página Quiénes Somos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {page?.showLocationSection ? (
                    <Eye className="h-5 w-5 text-primary" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Mostrar sección de ubicación</p>
                    <p className="text-sm text-muted-foreground">
                      Activa o desactiva el mapa en la página Quiénes Somos
                    </p>
                  </div>
                </div>
                <Switch
                  checked={page?.showLocationSection ?? true}
                  onCheckedChange={(checked) => updateField('showLocationSection', checked)}
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

        {/* CTA */}
        <TabsContent value="cta">
          <Card>
            <CardHeader><CardTitle>Llamada a la acción</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={page?.ctaTitle || ''} onChange={(e) => updateField('ctaTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subtítulo</Label>
                <Input value={page?.ctaSubtitle || ''} onChange={(e) => updateField('ctaSubtitle', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Texto del botón</Label>
                  <Input value={page?.ctaButtonText || ''} onChange={(e) => updateField('ctaButtonText', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>URL del botón</Label>
                  <Input value={page?.ctaButtonUrl || ''} onChange={(e) => updateField('ctaButtonUrl', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
