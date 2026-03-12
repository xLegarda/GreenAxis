import Link from 'next/link'
import { ArrowRight, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CTASectionProps {
  companyPhone?: string | null
  companyEmail?: string | null
}

export function CTASection({ companyPhone, companyEmail }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-[#005A7A] via-[#004A66] to-[#003D52] dark:from-[#051215] dark:via-[#0a1a1f] dark:to-[#0f2028] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-leaves opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para hacer tu empresa más sostenible?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Contáctanos hoy y descubre cómo podemos ayudarte a cumplir con tus objetivos ambientales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="bg-[#6BBE45] hover:bg-[#5CAE38] dark:bg-[#8BC34A] dark:hover:bg-[#7AB83A] text-white font-medium px-8 shadow-xl shadow-green-900/30 hover:-translate-y-0.5 transition-all"
            >
              <Link href="/contacto">
                Solicitar Cotización
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            
            <Button 
              asChild
              size="lg" 
              variant="outline"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-medium px-8 backdrop-blur-sm"
            >
              <Link href="/servicios">
                Ver Servicios
              </Link>
            </Button>
          </div>
          
          {/* Contact Info */}
          {(companyPhone || companyEmail) && (
            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-white/80">
              {companyPhone && (
                <a href={`tel:${companyPhone}`} className="flex items-center gap-2 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] transition-colors">
                  <Phone className="h-5 w-5" />
                  {companyPhone}
                </a>
              )}
              {companyEmail && (
                <a href={`mailto:${companyEmail}`} className="flex items-center gap-2 hover:text-[#6BBE45] dark:hover:text-[#8BC34A] transition-colors">
                  <Mail className="h-5 w-5" />
                  {companyEmail}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
