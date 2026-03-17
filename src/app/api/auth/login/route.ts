import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin, createSession } from '@/lib/auth'

// A07: Rate limiting simple en memoria
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos

export async function POST(request: NextRequest) {
  try {
    // Obtener IP del cliente
    const ip = request.headers.get('x-real-ip') ?? 
           request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 
           'unknown'
    
    // Verificar rate limiting
    const attempts = loginAttempts.get(ip)
    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt
      
      if (attempts.count >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000)
        return NextResponse.json({ 
          error: `Demasiados intentos. Intente nuevamente en ${remainingTime} minuto(s).`,
          locked: true 
        }, { status: 429 })
      }
      
      // Reset si pasó el tiempo de lockout
      if (timeSinceLastAttempt >= LOCKOUT_TIME) {
        loginAttempts.delete(ip)
      }
    }
    
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email y contraseña son requeridos' 
      }, { status: 400 })
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Formato de email inválido' 
      }, { status: 400 })
    }
    
    const admin = await authenticateAdmin(email, password)
    
    if (!admin) {
      // Incrementar contador de intentos fallidos
      const current = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(ip, {
        count: current.count + 1,
        lastAttempt: Date.now()
      })
      
      const remaining = MAX_ATTEMPTS - (current.count + 1)
      const errorMessage = remaining > 0 
        ? `Credenciales inválidas. ${remaining} intento(s) restante(s).`
        : 'Credenciales inválidas. Cuenta bloqueada temporalmente.'
      
      // Delay para prevenir timing attacks
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
      
      return NextResponse.json({ 
        error: errorMessage,
        attempts: current.count + 1
      }, { status: 401 })
    }
    
    // Login exitoso - limpiar intentos
    loginAttempts.delete(ip)
    
    // Crear sesión
    await createSession(admin.id, ip)
    
    return NextResponse.json({ 
      success: true, 
      admin: { id: admin.id, email: admin.email, name: admin.name }
    })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
