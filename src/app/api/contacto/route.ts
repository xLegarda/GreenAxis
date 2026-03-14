import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'
import { validateFullPhone } from '@/lib/phone-validation'

// Configuración de Resend
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Validación de email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitización básica de input
function sanitizeInput(input: string, maxLength: number): string {
  return input.trim().substring(0, maxLength)
}

// Enviar email de notificación al admin
async function sendContactNotification(
  toEmail: string, 
  contactData: {
    name: string
    email: string
    phone: string | null
    company: string | null
    subject: string | null
    message: string
  }
): Promise<boolean> {
  const siteName = 'Green Axis S.A.S.'
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: toEmail,
        reply_to: contactData.email,
        subject: `📧 Nuevo mensaje de contacto: ${contactData.subject || 'Sin asunto'}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #005A7A, #6BBE45); padding: 25px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .field { margin-bottom: 15px; }
              .field-label { font-weight: bold; color: #005A7A; font-size: 14px; }
              .field-value { background: white; padding: 10px 15px; border-radius: 5px; border-left: 4px solid #6BBE45; margin-top: 5px; }
              .message-box { background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; white-space: pre-wrap; }
              .button { display: inline-block; background: #6BBE45; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🌱 Nuevo Mensaje de Contacto</h1>
              </div>
              <div class="content">
                <p>Has recibido un nuevo mensaje a través del formulario de contacto:</p>
                
                <div class="field">
                  <div class="field-label">👤 Nombre:</div>
                  <div class="field-value">${contactData.name}</div>
                </div>
                
                <div class="field">
                  <div class="field-label">📧 Email:</div>
                  <div class="field-value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
                </div>
                
                ${contactData.phone ? `
                <div class="field">
                  <div class="field-label">📱 Teléfono:</div>
                  <div class="field-value"><a href="tel:${contactData.phone}">${contactData.phone}</a></div>
                </div>
                ` : ''}
                
                ${contactData.company ? `
                <div class="field">
                  <div class="field-label">🏢 Empresa:</div>
                  <div class="field-value">${contactData.company}</div>
                </div>
                ` : ''}
                
                ${contactData.subject ? `
                <div class="field">
                  <div class="field-label">📌 Asunto:</div>
                  <div class="field-value">${contactData.subject}</div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="field-label">💬 Mensaje:</div>
                  <div class="message-box">${contactData.message}</div>
                </div>
                
                <p style="text-align: center; margin-top: 25px;">
                  <a href="https://greenaxis.com.co/admin/mensajes" class="button">Ver en el Panel Admin</a>
                </p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${siteName}</p>
                <p>Este es un correo automático del formulario de contacto.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    })
    
    return response.ok
  } catch (error) {
    console.error('Error sending notification email:', error)
    return false
  }
}

// A07: Rate limiting simple en memoria
const messageAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_MESSAGES = 5
const LOCKOUT_TIME = 60 * 60 * 1000 // 1 hora en milisegundos

export async function POST(request: NextRequest) {
  try {
    // Obtener IP del cliente para Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Verificar rate limiting
    const attempts = messageAttempts.get(ip)
    if (attempts) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt
      
      if (attempts.count >= MAX_MESSAGES && timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000)
        return NextResponse.json({ 
          error: `Has enviado muchos mensajes. Intenta nuevamente en ${remainingTime} minuto(s).`
        }, { status: 429 })
      }
      
      // Reset si pasó el tiempo de lockout
      if (timeSinceLastAttempt >= LOCKOUT_TIME) {
        messageAttempts.delete(ip)
      }
    }

    const body = await request.json()
    
    const { name, email, phone, company, subject, message, consent } = body
    
    // Validaciones
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nombre es requerido (mínimo 2 caracteres)' }, { status: 400 })
    }
    
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Email válido es requerido' }, { status: 400 })
    }
    
    if (phone && typeof phone === 'string') {
      const phoneValidation = validateFullPhone(phone)
      if (!phoneValidation.valid) {
        return NextResponse.json({ error: phoneValidation.error }, { status: 400 })
      }
    }
    
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ error: 'Mensaje es requerido (mínimo 10 caracteres)' }, { status: 400 })
    }
    
    if (!consent) {
      return NextResponse.json({ error: 'Debe aceptar la política de tratamiento de datos' }, { status: 400 })
    }
    
    // Sanitizar datos
    const sanitizedData = {
      name: sanitizeInput(name, 100),
      email: sanitizeInput(email, 100),
      phone: phone ? sanitizeInput(phone, 20) : null,
      company: company ? sanitizeInput(company, 100) : null,
      subject: subject ? sanitizeInput(subject, 200) : null,
      message: sanitizeInput(message, 2000),
    }
    
    // Crear mensaje en la base de datos
    const contactMessage = await db.contactMessage.create({
      data: {
        ...sanitizedData,
        consent: true,
      }
    })
    
    // Registrar el intento exitoso para el rate limiting
    const current = messageAttempts.get(ip) || { count: 0, lastAttempt: 0 }
    messageAttempts.set(ip, {
      count: current.count + 1,
      lastAttempt: Date.now()
    })
    
    // Obtener email de notificación de la configuración
    const config = await db.platformConfig.findFirst()
    const notificationEmail = config?.notificationEmail || config?.companyEmail
    
    // Enviar email de notificación si hay email configurado
    if (notificationEmail) {
      await sendContactNotification(notificationEmail, sanitizedData)
    }
    
    return NextResponse.json({ success: true, id: contactMessage.id })
  } catch (error) {
    console.error('Error saving contact message:', error)
    return NextResponse.json({ error: 'Error al guardar mensaje' }, { status: 500 })
  }
}

// GET - Solo admin puede ver mensajes
export async function GET() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const messages = await db.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 })
  }
}

// PUT - Marcar como leído (solo admin)
export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, read } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    const message = await db.contactMessage.update({
      where: { id },
      data: { read }
    })
    
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Error al actualizar mensaje' }, { status: 500 })
  }
}

// DELETE - Eliminar mensaje (solo admin)
export async function DELETE(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    await db.contactMessage.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Error al eliminar mensaje' }, { status: 500 })
  }
}
