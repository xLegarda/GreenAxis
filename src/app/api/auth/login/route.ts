import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin, createSession } from '@/lib/auth'

// Rate limiting dual: IP + Usuario
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

const MAX_IP_ATTEMPTS = 15
const MAX_USER_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos

function checkRateLimit(key: string, maxAttempts: number) {
  const attempts = loginAttempts.get(key)
  if (!attempts) return { blocked: false }

  const elapsed = Date.now() - attempts.lastAttempt
  if (elapsed >= LOCKOUT_TIME) {
    loginAttempts.delete(key)
    return { blocked: false }
  }

  if (attempts.count >= maxAttempts) {
    const remaining = Math.ceil((LOCKOUT_TIME - elapsed) / 60000)
    return { blocked: true, remaining }
  }

  return { blocked: false }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email y contraseña son requeridos'
      }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Formato de email inválido'
      }, { status: 400 })
    }

    const ip = request.headers.get('x-real-ip') ??
           request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
           'unknown'

    const ipKey = `ip:${ip}`
    const userKey = `user:${email.toLowerCase()}`

    // 1. Chequeo por IP (protege contra bots masivos)
    const ipCheck = checkRateLimit(ipKey, MAX_IP_ATTEMPTS)
    if (ipCheck.blocked) {
      return NextResponse.json({
        error: `Demasiados intentos desde esta red. Intente en ${ipCheck.remaining} minuto(s).`,
        locked: true
      }, { status: 429 })
    }

    // 2. Chequeo por usuario (protege la cuenta específica)
    const userCheck = checkRateLimit(userKey, MAX_USER_ATTEMPTS)
    if (userCheck.blocked) {
      return NextResponse.json({
        error: `Cuenta bloqueada temporalmente. Intente en ${userCheck.remaining} minuto(s).`,
        locked: true
      }, { status: 429 })
    }

    const admin = await authenticateAdmin(email, password)

    if (!admin) {
      // Incrementar AMBOS contadores
      const ipAttempts = loginAttempts.get(ipKey) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(ipKey, {
        count: ipAttempts.count + 1,
        lastAttempt: Date.now()
      })

      const userAttempts = loginAttempts.get(userKey) || { count: 0, lastAttempt: 0 }
      loginAttempts.set(userKey, {
        count: userAttempts.count + 1,
        lastAttempt: Date.now()
      })

      const remaining = MAX_USER_ATTEMPTS - (userAttempts.count + 1)
      const errorMessage = remaining > 0
        ? `Credenciales inválidas. ${remaining} intento(s) restante(s).`
        : 'Credenciales inválidas. Cuenta bloqueada temporalmente.'

      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

      return NextResponse.json({
        error: errorMessage,
        attempts: userAttempts.count + 1
      }, { status: 401 })
    }

    // Login exitoso - limpiar ambos contadores
    loginAttempts.delete(ipKey)
    loginAttempts.delete(userKey)

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