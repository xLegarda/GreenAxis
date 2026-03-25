import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { validatePassword } from '@/lib/password-validator'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Generar token seguro
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Enviar email con Resend
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
    const { email } = body
    
    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato de email inválido' }, { status: 400 })
    }
    
    // Verificar si existe el usuario
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    // Por seguridad, siempre responder éxito aunque no exista
    if (!admin) {
      return NextResponse.json({ 
        success: true, 
        message: 'Si el email existe, recibirás un enlace de recuperación' 
      })
    }
    
    // Verificar si hay un token reciente (evitar spam)
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
    
    // Invalidar tokens anteriores
    await db.passwordResetToken.updateMany({
      where: { email: email.toLowerCase(), used: false },
      data: { used: true }
    })
    
    // Generar nuevo token en texto plano (para el email)
    const plainToken = generateResetToken()
    // Hashear el token para guardarlo en BD
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex')
    
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    
    await db.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: hashedToken, // Guardamos el hash, no el texto plano
        expiresAt,
      }
    })
    
    // Obtener URL base
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                    request.headers.get('origin') || 
                    'https://greenaxis.com.co'
    
    // Enviar email con el token en TEXTO PLANO
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

// GET - Verificar si un token es válido
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token requerido' }, { status: 400 })
    }
    
    // Hashear el token recibido de la URL para buscarlo en la BD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token: hashedToken }
    })
    
    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: 'Token inválido o expirado' })
    }
    
    return NextResponse.json({ valid: true, email: resetToken.email })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ valid: false, error: 'Error del servidor' }, { status: 500 })
  }
}

// PUT - Restablecer contraseña con token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body
    
    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña son requeridos' }, { status: 400 })
    }
    
    // Validar fortaleza de contraseña
    const validation = validatePassword(password)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 })
    }
    
    // Hashear el token recibido de la petición para buscarlo en la BD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token: hashedToken }
    })
    
    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 })
    }
    
    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Actualizar contraseña
    await db.admin.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword }
    })
    
    // Marcar token como usado (buscando por el hash)
    await db.passwordResetToken.update({
      where: { token: hashedToken },
      data: { used: true }
    })
    
    return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json({ error: 'Error al restablecer contraseña' }, { status: 500 })
  }
}
