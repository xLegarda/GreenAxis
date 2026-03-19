import Link from 'next/link'
import { 
  Settings, 
  Wrench, 
  Newspaper, 
  Image as ImageIcon, 
  Sliders, 
  FileText, 
  Mail,
  MessageSquare,
  Users,
  Star
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const adminSections = [
  {
    title: 'Configuración General',
    description: 'Nombre del sitio, logo, datos de contacto y redes sociales',
    icon: Settings,
    href: '/admin/configuracion',
    color: 'bg-primary/10 text-primary'
  },
  {
    title: 'Quiénes Somos',
    description: 'Edita la página completa de "Quiénes Somos"',
    icon: Users,
    href: '/admin/quienes-somos',
    color: 'bg-teal-500/10 text-teal-500'
  },
  {
    title: 'Servicios',
    description: 'Gestionar los servicios que ofrece la empresa',
    icon: Wrench,
    href: '/admin/servicios',
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    title: 'Noticias / Blog',
    description: 'Crear y editar artículos del blog',
    icon: Newspaper,
    href: '/admin/noticias',
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    title: 'Imágenes',
    description: 'Biblioteca de imágenes, videos y audios del sitio',
    icon: ImageIcon,
    href: '/admin/imagenes',
    color: 'bg-orange-500/10 text-orange-500'
  },
  {
    title: 'Carrusel Principal',
    description: 'Administrar los slides del carrusel de inicio',
    icon: Sliders,
    href: '/admin/carrusel',
    color: 'bg-pink-500/10 text-pink-500'
  },
  {
    title: 'Páginas Legales',
    description: 'Términos, condiciones y política de privacidad',
    icon: FileText,
    href: '/admin/legal',
    color: 'bg-amber-500/10 text-amber-500'
  },
  {
    title: 'Mensajes de Contacto',
    description: 'Ver mensajes recibidos del formulario de contacto',
    icon: Mail,
    href: '/admin/mensajes',
    color: 'bg-cyan-500/10 text-cyan-500'
  },
  {
    title: 'Contáctame',
    description: '¿Quieres más funcionalidades?',
    icon: Star,
    href: 'https://wa.me/573127711646',
    color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
    external: true
  }
]

export default function AdminPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Panel de Administración</h1>
        <p className="text-sm text-muted-foreground mt-1">Gestiona el contenido de tu sitio web</p>
      </div>
      
      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Link 
              key={section.href} 
              href={section.href}
              target={section.external ? '_blank' : undefined}
              rel={section.external ? 'noopener noreferrer' : undefined}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-0 bg-card">
                <CardHeader className="p-4 sm:p-6">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${section.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{section.title}</CardTitle>
                  <CardDescription className="text-sm">{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
