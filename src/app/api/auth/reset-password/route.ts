import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { validatePassword } from '@/lib/password-validator'
import { Resend } from 'resend'
import { z } from 'zod'

const resetRequestSchema = z.object({
  email: z.string({ message: 'Email es requerido' }).email({ message: 'Formato de email inválido' }),
})

const resetPasswordSchema = z.object({
  token: z.string({ message: 'Token es requerido' }).min(1, 'Token es requerido'),
  password: z.string({ message: 'Contraseña es requerida' }).min(8, 'La contraseña debe tener mínimo 8 caracteres'),
})

const resend = new Resend(process.env.RESEND_API_KEY || '')
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Rate limiting dual: IP + Email para prevenir abuso del endpoint de reset
const resetAttempts = new Map<string, { count: number; lastAttempt: number }>()

const MAX_RESET_IP_ATTEMPTS = 10
const MAX_RESET_EMAIL_ATTEMPTS = 3
const RESET_LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos

// Función de verificación de rate limit con auto-limpieza de entradas expiradas
function checkResetRateLimit(key: string, maxAttempts: number) {
  const attempts = resetAttempts.get(key)
  if (!attempts) return { blocked: false }

  const elapsed = Date.now() - attempts.lastAttempt
  // Limpiar entradas expiradas automáticamente
  if (elapsed >= RESET_LOCKOUT_TIME) {
    resetAttempts.delete(key)
    return { blocked: false }
  }

  if (attempts.count >= maxAttempts) {
    const remaining = Math.ceil((RESET_LOCKOUT_TIME - elapsed) / 60000)
    return { blocked: true, remaining }
  }

  return { blocked: false }
}

// Generar token seguro de 64 caracteres hex
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Enviar email de recuperación usando Resend API
async function sendResetEmail(email: string, token: string, baseUrl: string): Promise<boolean> {
  const resetUrl = `${baseUrl}/portal-interno/restablecer?token=${token}`

  try {
    await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: email,
      subject: 'Recuperacion de Contrasena - Green Axis',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #005A7A, #6BBE45); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #6BBE45; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Green Axis S.A.S.</h1>
            </div>
            <div class="content">
              <h2>Recuperacion de Contrasena</h2>
              <p>Hemos recibido una solicitud para restablecer tu contrasena.</p>
              <p>Haz clic en el siguiente boton para crear una nueva contrasena:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Restablecer Contrasena</a>
              </p>
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px; font-size: 14px;">
                ${resetUrl}
              </p>
              <div class="warning">
                <strong>Importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Este enlace expira en <strong>1 hora</strong></li>
                  <li>Si no solicitaste este cambio, ignora este correo</li>
                  <li>Nunca compartas este enlace con nadie</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>${new Date().getFullYear()} Green Axis S.A.S. - Servicios Ambientales</p>
              <p>Este es un correo automatico, por favor no respondas.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

// POST - Solicitar recuperación de contraseña
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar formato del email con Zod
    const validationResult = resetRequestSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const { email } = validationResult.data

    // Extraer IP del cliente para rate limiting
    const ip = request.headers.get('x-real-ip') ??
           request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
           'unknown'

    // Keys para rate limiting: normalizamos email a lowercase para evitar bypass por case
    const ipKey = `reset-ip:${ip}`
    const emailKey = `reset-email:${email.toLowerCase()}`

    // Verificar rate limit por IP (protege contra bots que usan múltiples emails)
    const ipCheck = checkResetRateLimit(ipKey, MAX_RESET_IP_ATTEMPTS)
    if (ipCheck.blocked) {
      return NextResponse.json({
        error: `Demasiadas solicitudes desde esta red. Intente en ${ipCheck.remaining} minuto(s).`,
        locked: true
      }, { status: 429 })
    }

    // Verificar rate limit por email (protege contra ataques a email específico)
    const emailCheck = checkResetRateLimit(emailKey, MAX_RESET_EMAIL_ATTEMPTS)
    if (emailCheck.blocked) {
      return NextResponse.json({
        error: `Demasiadas solicitudes para este email. Intente en ${emailCheck.remaining} minuto(s).`,
        locked: true
      }, { status: 429 })
    }

    // Incrementar contadores ANTES del lookup para prevenir enumeración de usuarios
    // Aunque el email no exista en BD, el contador ya se incrementará
    // así un atacante no puede descubrir qué emails están registrados
    const ipAttempts = resetAttempts.get(ipKey) || { count: 0, lastAttempt: 0 }
    resetAttempts.set(ipKey, {
      count: ipAttempts.count + 1,
      lastAttempt: Date.now()
    })

    const emailAttempts = resetAttempts.get(emailKey) || { count: 0, lastAttempt: 0 }
    resetAttempts.set(emailKey, {
      count: emailAttempts.count + 1,
      lastAttempt: Date.now()
    })

    // Buscar usuario por email normalizado
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Por seguridad, siempre respondemos éxito aunque el email no exista
    // Esto evita enumeración de emails válidos
    if (!admin) {
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación'
      })
    }

    // Verificar si ya se envió un token recientemente (5 min de cooldown)
    const recentToken = await db.passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase(),
        createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }
      }
    })

    if (recentToken) {
      return NextResponse.json({
        success: true,
        message: 'Ya se envió un enlace recientemente. Revisa tu correo o espera 5 minutos.'
      })
    }

    // Invalidar tokens anteriores no usados para este email
    await db.passwordResetToken.updateMany({
      where: { email: email.toLowerCase(), used: false },
      data: { used: true }
    })

    // Generar nuevo token: texto plano para email, hash SHA256 para BD
    const plainToken = generateResetToken()
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex')

    // Token expira en 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await db.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: hashedToken,
        expiresAt,
      }
    })

    // Obtener URL base para construir el enlace de recuperación
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                    request.headers.get('origin') ||
                    'https://greenaxis.com.co'

    // Enviar email con el token en texto plano (solo el usuario lo ve)
    await sendResetEmail(email, plainToken, baseUrl)

    return NextResponse.json({
      success: true,
      message: 'Si el email existe, recibirás un enlace de recuperación'
    })
  } catch (error) {
    console.error('Error in password reset:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

// GET - Verificar si un token es válido (usado al cargar la página de reset)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token requerido' }, { status: 400 })
    }

    // Hash del token recibido para buscarlo en la BD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token: hashedToken }
    })

    // Verificar: existe, no usado, no expirado
    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'Token inválido o expirado' })
    }

    return NextResponse.json({ valid: true, email: resetToken.email })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ valid: false, error: 'Error del servidor' }, { status: 500 })
  }
}

// PUT - Restablecer contraseña con token válido
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar que token y password vengan en el body
    const validationResult = resetPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const { token, password } = validationResult.data

    // Extraer IP para rate limiting (prevenir fuerza bruta del token)
    const ip = request.headers.get('x-real-ip') ??
           request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
           'unknown'

    const tokenKey = `reset-token:${ip}`

    // Verificar rate limit por IP para intentos de token
    const tokenCheck = checkResetRateLimit(tokenKey, MAX_RESET_IP_ATTEMPTS)
    if (tokenCheck.blocked) {
      return NextResponse.json({
        error: `Demasiados intentos. Intente en ${tokenCheck.remaining} minuto(s).`,
        locked: true
      }, { status: 429 })
    }

    // Validar fortaleza de la nueva contraseña
    const validation = validatePassword(password)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 })
    }

    // Hash del token recibido para buscarlo en la BD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token: hashedToken }
    })

    // Si el token es inválido, expirado o ya usado, incrementar contador
    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      const tokenAttempts = resetAttempts.get(tokenKey) || { count: 0, lastAttempt: 0 }
      resetAttempts.set(tokenKey, {
        count: tokenAttempts.count + 1,
        lastAttempt: Date.now()
      })

      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
    }

    // Hash de la nueva contraseña con bcrypt (12 rounds)
    const hashedPassword = await bcrypt.hash(password, 12)

    // Actualizar contraseña del admin
    await db.admin.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword }
    })

    // Marcar token como usado para evitar reuse
    await db.passwordResetToken.update({
      where: { token: hashedToken },
      data: { used: true }
    })

    // Limpiar contador de intentos al completar exitosamente
    resetAttempts.delete(tokenKey)

    return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Error al restablecer contraseña' }, { status: 500 })
  }
}
