'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CarouselSlide {
  id: string
  title: string | null
  subtitle: string | null
  description: string | null
  imageUrl: string
  buttonText: string | null
  buttonUrl: string | null
  linkUrl: string | null
  gradientEnabled: boolean | null
  animationEnabled: boolean | null
  gradientColor: string | null
}

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [zoomProgress, setZoomProgress] = useState(1)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const showAnimationRef = useRef<boolean>(true)
  
  const defaultSlides: CarouselSlide[] = [
    {
      id: 'default-1',
      title: 'Soluciones Ambientales Integrales',
      subtitle: 'Green Axis S.A.S.',
      description: 'Comprometidos con el desarrollo sostenible y la protección del medio ambiente.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
      buttonText: 'Conoce nuestros servicios',
      buttonUrl: '/servicios',
      linkUrl: null,
      gradientEnabled: true,
      animationEnabled: true,
      gradientColor: null
    },
    {
      id: 'default-2',
      title: 'Gestión de Residuos Profesional',
      subtitle: 'Servicios especializados',
      description: 'Manejo integral de residuos con certificación ambiental.',
      imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1920&q=80',
      buttonText: 'Solicitar información',
      buttonUrl: '/contacto',
      linkUrl: null,
      gradientEnabled: true,
      animationEnabled: true,
      gradientColor: null
    },
    {
      id: 'default-3',
      title: 'Consultoría Ambiental Experta',
      subtitle: 'Más de 15 años de experiencia',
      description: 'Asesoría especializada en normativas ambientales colombianas.',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
      buttonText: 'Contáctanos',
      buttonUrl: '/contacto',
      linkUrl: null,
      gradientEnabled: true,
      animationEnabled: true,
      gradientColor: null
    }
  ]
  
  const displaySlides = slides.length > 0 ? slides : defaultSlides
  const currentSlideData = displaySlides[currentSlide]
  const showAnimation = currentSlideData?.animationEnabled !== false
  
  // Mantener referencia actualizada de showAnimation
  useEffect(() => {
    showAnimationRef.current = showAnimation
  }, [showAnimation])
  
  // Animación de zoom controlada por requestAnimationFrame
  useEffect(() => {
    let isCancelled = false
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp
      }
      
      const elapsed = timestamp - startTimeRef.current
      const duration = 5500 // 5.5 segundos
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const zoom = 1 + (easedProgress * 0.08) // De 1 a 1.08
      
      if (!isCancelled) {
        setZoomProgress(zoom)
        
        if (progress < 1 && showAnimationRef.current) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
    }
    
    // Cancelar animación anterior
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // Reset y comenzar animación
    startTimeRef.current = 0
    
    // Pequeño delay para que el slide se muestre primero
    const timer = setTimeout(() => {
      if (!isCancelled) {
        setZoomProgress(1)
        if (showAnimation) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
    }, 50)
    
    return () => {
      isCancelled = true
      clearTimeout(timer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [currentSlide, showAnimation])
  
  // Cambio automático de slides
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
  }, [displaySlides.length])
  
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
  }, [displaySlides.length])
  
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])
  
  return (
    <section className="relative h-[550px] md:h-[650px] lg:h-[700px] overflow-hidden">
      {/* Slides */}
      {displaySlides.map((slide, index) => {
        const isActive = index === currentSlide
        const showGradient = slide.gradientEnabled !== false
        const customGradient = slide.gradientColor ? `#${slide.gradientColor}` : null
        
        // Generar color de degradado dinámico
        const gradientStyle = showGradient ? {
          background: customGradient 
            ? `linear-gradient(to right, ${customGradient}e6, ${customGradient}99, transparent)` 
            : 'linear-gradient(to right, rgba(0, 90, 122, 0.9), rgba(0, 90, 122, 0.6), transparent)'
        } : {}
        
        const SlideContent = () => (
          <>
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.imageUrl}
                alt={slide.title || 'Slide'}
                fill
                className="object-cover"
                style={{
                  transform: isActive ? `scale(${zoomProgress})` : 'scale(1.08)',
                  transition: isActive ? 'none' : 'none'
                }}
                priority={index === 0}
              />
              {/* Gradient Overlay */}
              {showGradient && (
                <div className="absolute inset-0" style={gradientStyle} />
              )}
              {/* Dark overlay for readability without gradient */}
              {!showGradient && (
                <div className="absolute inset-0 bg-black/40" />
              )}
            </div>
            
            {/* Content */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="max-w-2xl text-white space-y-6">
                {slide.subtitle && (
                  <p className="text-[#6BBE45] font-semibold text-lg tracking-wide uppercase">
                    {slide.subtitle}
                  </p>
                )}
                {slide.title && (
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                    {slide.title}
                  </h1>
                )}
                {slide.description && (
                  <p className="text-lg md:text-xl text-white/90 max-w-xl leading-relaxed">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && slide.buttonUrl && (
                  <div className="flex flex-wrap gap-4 pt-2">
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#6BBE45] hover:bg-[#5CAE38] text-white font-medium px-8 text-base shadow-xl shadow-green-900/20 hover:-translate-y-0.5 transition-all"
                    >
                      <Link href={slide.buttonUrl}>
                        {slide.buttonText}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#005A7A] hover:bg-[#004A66] text-white font-medium px-8 text-base shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                      <Link href="/contacto">
                        Contáctanos
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )
        
        // Si tiene link, envolver en Link
        const Wrapper = slide.linkUrl ? ({ children }: { children: React.ReactNode }) => (
          <Link href={slide.linkUrl} className="block w-full h-full cursor-pointer">
            {children}
          </Link>
        ) : ({ children }: { children: React.ReactNode }) => <>{children}</>
        
        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <Wrapper>
              <SlideContent />
            </Wrapper>
          </div>
        )
      })}
      
      {/* Navigation Arrows */}
      {displaySlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  index === currentSlide
                    ? 'w-10 bg-[#6BBE45]'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                )}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
