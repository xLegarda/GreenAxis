import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // A02: Security Headers
  // X-Frame-Options: Previene clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options: Previene MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-XSS-Protection: Filtro XSS para navegadores legacy
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer-Policy: Controla qué información se envía en el header Referer
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy: Limita características del navegador
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content-Security-Policy: Define qué recursos pueden cargarse
  // Configuración permisiva para sitios corporativos
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-src 'self' https://www.google.com https://maps.google.com",
    "frame-ancestors 'none'",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
}

// Solo aplicar a rutas que no sean estáticas
export const config = {
  matcher: [
    /*
     * Aplicar a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - uploads (archivos subidos)
     */
    '/((?!_next/static|_next/image|favicon.ico|uploads).*)',
  ],
}
