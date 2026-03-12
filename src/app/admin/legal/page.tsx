'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { EditorJSComponent, editorDataToText } from '@/components/editor-js'

interface LegalPage {
  id: string
  slug: string
  title: string
  content: string
  blocks?: string | null
  manualDate: string | null
  updatedAt: Date
}

// Contenido por defecto de términos y condiciones en formato Editor.js
const defaultTerminos = {
  blocks: [
    { type: 'titulo1', data: { text: 'Términos y Condiciones', level: 1 } },
    { type: 'paragraph', data: { text: 'Los presentes Términos y Condiciones regulan el uso del sitio web y los servicios ofrecidos por Green Axis S.A.S., empresa dedicada a servicios ambientales.' } },
    { type: 'titulo2', data: { text: '1. Objeto', level: 2 } },
    { type: 'paragraph', data: { text: 'Los presentes Términos y Condiciones regulan el uso del sitio web y los servicios ofrecidos por nuestra empresa de servicios ambientales.' } },
    { type: 'titulo2', data: { text: '2. Aceptación', level: 2 } },
    { type: 'paragraph', data: { text: 'El uso de nuestros servicios implica la aceptación plena de estos términos y condiciones. Si no está de acuerdo con ellos, le solicitamos que no utilice nuestros servicios.' } },
    { type: 'titulo2', data: { text: '3. Servicios', level: 2 } },
    { type: 'paragraph', data: { text: 'Ofrecemos servicios ambientales que incluyen:' } },
    { type: 'list', data: { style: 'unordered', items: ['Gestión de residuos', 'Consultoría ambiental', 'Auditorías ambientales', 'Restauración ecológica', 'Trámites ambientales', 'Capacitación y formación ambiental'] } },
    { type: 'titulo2', data: { text: '4. Responsabilidades', level: 2 } },
    { type: 'paragraph', data: { text: 'El cliente se compromete a proporcionar información veraz y completa para la correcta prestación de nuestros servicios. Nos comprometemos a ofrecer servicios de calidad con profesionalismo y ética.' } },
    { type: 'titulo2', data: { text: '5. Propiedad Intelectual', level: 2 } },
    { type: 'paragraph', data: { text: 'Todo el contenido del sitio web, incluyendo textos, imágenes, logos y diseños, es propiedad de Green Axis S.A.S. y está protegido por las leyes de propiedad intelectual de Colombia.' } },
    { type: 'titulo2', data: { text: '6. Modificaciones', level: 2 } },
    { type: 'paragraph', data: { text: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.' } },
    { type: 'titulo2', data: { text: '7. Legislación Aplicable', level: 2 } },
    { type: 'paragraph', data: { text: 'Estos términos se rigen por la legislación colombiana vigente. Cualquier conflicto será resuelto por los tribunales competentes de Colombia.' } },
    { type: 'titulo2', data: { text: '8. Contacto', level: 2 } },
    { type: 'paragraph', data: { text: 'Para cualquier consulta sobre estos términos, puede contactarnos a través de los medios indicados en nuestra página de contacto.' } }
  ]
}

// Contenido por defecto de política de privacidad en formato Editor.js
const defaultPrivacidad = {
  blocks: [
    { type: 'titulo1', data: { text: 'Política de Tratamiento de Datos Personales', level: 1 } },
    { type: 'paragraph', data: { text: 'En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, informamos nuestra política de tratamiento de datos personales.' } },
    { type: 'titulo2', data: { text: '1. Responsable del Tratamiento', level: 2 } },
    { type: 'paragraph', data: { text: 'Green Axis S.A.S., con NIT [NIT de la empresa], domiciliada en [dirección de la empresa], es responsable del tratamiento de sus datos personales.' } },
    { type: 'titulo2', data: { text: '2. Finalidad del Tratamiento', level: 2 } },
    { type: 'paragraph', data: { text: 'Los datos personales que recolectamos serán utilizados para:' } },
    { type: 'list', data: { style: 'unordered', items: ['Responder a sus solicitudes de información y cotizaciones', 'Prestar los servicios ambientales contratados', 'Enviar comunicaciones comerciales (previa autorización)', 'Cumplir con obligaciones legales', 'Mejorar nuestros servicios y atención al cliente'] } },
    { type: 'titulo2', data: { text: '3. Datos Recolectados', level: 2 } },
    { type: 'paragraph', data: { text: 'Podemos recolectar los siguientes datos:' } },
    { type: 'list', data: { style: 'unordered', items: ['Nombre completo', 'Correo electrónico', 'Número de teléfono', 'Nombre de empresa (si aplica)', 'Información necesaria para la prestación del servicio'] } },
    { type: 'titulo2', data: { text: '4. Derechos del Titular', level: 2 } },
    { type: 'paragraph', data: { text: 'Como titular de datos personales, tiene derecho a:' } },
    { type: 'list', data: { style: 'unordered', items: ['Conocer, actualizar y rectificar sus datos', 'Solicitar prueba de la autorización otorgada', 'Ser informado sobre el uso de sus datos', 'Presentar quejas ante la Superintendencia de Industria y Comercio', 'Revocar la autorización y/o solicitar la supresión de sus datos'] } },
    { type: 'titulo2', data: { text: '5. Autorización', level: 2 } },
    { type: 'paragraph', data: { text: 'El titular autoriza de manera previa, expresa e informada el tratamiento de sus datos personales para las finalidades descritas en esta política.' } },
    { type: 'titulo2', data: { text: '6. Seguridad', level: 2 } },
    { type: 'paragraph', data: { text: 'Implementamos medidas técnicas, humanas y administrativas para proteger sus datos personales contra acceso no autorizado, pérdida o alteración.' } },
    { type: 'titulo2', data: { text: '7. Transferencia de Datos', level: 2 } },
    { type: 'paragraph', data: { text: 'No transferiremos sus datos a terceros sin su autorización previa, salvo en los casos previstos por la ley colombiana.' } },
    { type: 'titulo2', data: { text: '8. Vigencia', level: 2 } },
    { type: 'paragraph', data: { text: 'Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades del tratamiento y las obligaciones legales aplicables.' } },
    { type: 'titulo2', data: { text: '9. Contacto', level: 2 } },
    { type: 'paragraph', data: { text: 'Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos, puede contactarnos a través de los medios indicados en nuestra página de contacto.' } },
    { type: 'titulo2', data: { text: '10. Modificaciones', level: 2 } },
    { type: 'paragraph', data: { text: 'Nos reservamos el derecho de modificar esta política. Las modificaciones serán comunicadas a través de nuestro sitio web.' } }
  ]
}

export default function LegalAdminPage() {
  const [pages, setPages] = useState<Record<string, LegalPage | null>>({
    terminos: null,
    privacidad: null
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Record<string, { title: string; manualDate: string }>>({
    terminos: { title: 'Términos y Condiciones', manualDate: '' },
    privacidad: { title: 'Política de Privacidad', manualDate: '' }
  })

  // Editor data state
  const [editorData, setEditorData] = useState<Record<string, any>>({
    terminos: defaultTerminos,
    privacidad: defaultPrivacidad
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const [terminosRes, privacidadRes] = await Promise.all([
        fetch('/api/legal?slug=terminos'),
        fetch('/api/legal?slug=privacidad')
      ])

      const terminos = terminosRes.ok ? await terminosRes.json() : null
      const privacidad = privacidadRes.ok ? await privacidadRes.json() : null

      setPages({ terminos, privacidad })
      
      // Parse blocks for editor, or use defaults
      let terminosBlocks = defaultTerminos
      let privacidadBlocks = defaultPrivacidad
      
      if (terminos?.blocks) {
        try {
          const parsed = JSON.parse(terminos.blocks)
          if (parsed?.blocks?.length > 0) {
            terminosBlocks = parsed
          }
        } catch {}
      }
      if (privacidad?.blocks) {
        try {
          const parsed = JSON.parse(privacidad.blocks)
          if (parsed?.blocks?.length > 0) {
            privacidadBlocks = parsed
          }
        } catch {}
      }
      
      setEditorData({
        terminos: terminosBlocks,
        privacidad: privacidadBlocks
      })
      
      setFormData({
        terminos: {
          title: terminos?.title || 'Términos y Condiciones',
          manualDate: terminos?.manualDate || ''
        },
        privacidad: {
          title: privacidad?.title || 'Política de Privacidad',
          manualDate: privacidad?.manualDate || ''
        }
      })
    } catch (error) {
      console.error('Error fetching legal pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditorChange = useCallback((slug: string, data: any) => {
    setEditorData(prev => ({ ...prev, [slug]: data }))
  }, [])

  const handleSave = async (slug: string) => {
    setSaving(slug)
    try {
      let blocks = null
      let content = ''
      
      if (editorData[slug]) {
        blocks = JSON.stringify(editorData[slug])
        content = editorDataToText(editorData[slug])
      }

      const response = await fetch('/api/legal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title: formData[slug].title,
          content,
          blocks,
          manualDate: formData[slug].manualDate || null
        })
      })

      if (response.ok) {
        toast({ title: 'Página guardada correctamente' })
        fetchPages()
      }
    } catch (error) {
      toast({ title: 'Error al guardar', variant: 'destructive' })
    } finally {
      setSaving(null)
    }
  }

  // Generar fecha actual en formato español
  const getCurrentDate = () => {
    const now = new Date()
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    return `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Cargando...</div>
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Páginas Legales
        </h1>
        <p className="text-sm text-muted-foreground">Edita los documentos legales del sitio</p>
      </div>

      <Tabs defaultValue="terminos">
        <TabsList className="bg-card mb-6">
          <TabsTrigger value="terminos">Términos y Condiciones</TabsTrigger>
          <TabsTrigger value="privacidad">Política de Privacidad</TabsTrigger>
        </TabsList>

        {['terminos', 'privacidad'].map((slug) => (
          <TabsContent key={slug} value={slug}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{formData[slug].title}</CardTitle>
                    <CardDescription>
                      {pages[slug]?.updatedAt ? (
                        <>Última modificación: {new Date(pages[slug]!.updatedAt).toLocaleDateString('es-CO')}</>
                      ) : (
                        <>Contenido por defecto - Edita y guarda para publicar</>
                      )}
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => handleSave(slug)} 
                    disabled={saving === slug}
                    className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving === slug ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input
                      value={formData[slug].title}
                      onChange={(e) => setFormData({
                        ...formData,
                        [slug]: { ...formData[slug], title: e.target.value }
                      })}
                      placeholder="Título de la página"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Fecha de actualización
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData[slug].manualDate}
                        onChange={(e) => setFormData({
                          ...formData,
                          [slug]: { ...formData[slug], manualDate: e.target.value }
                        })}
                        placeholder="Ej: 10 de marzo de 2025"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline"
                        size="icon"
                        onClick={() => setFormData({
                          ...formData,
                          [slug]: { ...formData[slug], manualDate: getCurrentDate() }
                        })}
                        title="Usar fecha actual"
                      >
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Editor.js Content */}
                <div className="space-y-2">
                  <Label>Contenido</Label>
                  <EditorJSComponent 
                    key={`editor-${slug}`}
                    data={editorData[slug]} 
                    onChange={(data) => handleEditorChange(slug, data)}
                    placeholder="Escribe aquí el contenido legal..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
