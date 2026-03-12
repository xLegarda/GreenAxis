import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import crypto from 'crypto'

const SALT_ROUNDS = 12
const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 días en segundos

// Hashear contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Verificar contraseña
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generar token de sesión seguro
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Crear sesión y establecer cookie
export async function createSession(adminId: string): Promise<string> {
  const token = generateSessionToken()
  const expiresAt = new Date(Date.now() + SESSION_DURATION * 1000)
  
  // En producción, guardarías esto en una tabla Session
  // Por simplicidad, usamos una cookie firmada
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({
    adminId,
    token,
    expiresAt: expiresAt.toISOString()
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt,
    path: '/'
  })
  
  return token
}

// Verificar sesión actual
export async function verifySession(): Promise<{ adminId: string } | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie?.value) {
    return null
  }
  
  try {
    const session = JSON.parse(sessionCookie.value)
    
    // Verificar si la sesión ha expirado
    if (new Date(session.expiresAt) < new Date()) {
      await destroySession()
      return null
    }
    
    return { adminId: session.adminId }
  } catch {
    return null
  }
}

// Destruir sesión
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Verificar si existe un administrador
export async function adminExists(): Promise<boolean> {
  const admin = await db.admin.findFirst()
  return !!admin
}

// Contar número de administradores
export async function countAdmins(): Promise<number> {
  return db.admin.count()
}

// Obtener el límite máximo de cuentas
export function getMaxAccounts(): number {
  return parseInt(process.env.MAX_ADMIN_ACCOUNTS || '2', 10)
}

// Verificar si se puede crear más cuentas
export async function canCreateAdmin(): Promise<boolean> {
  const count = await countAdmins()
  const maxAccounts = getMaxAccounts()
  return count < maxAccounts
}

// Eliminar cuenta de administrador
export async function deleteAdmin(adminId: string): Promise<boolean> {
  try {
    // No permitir eliminar si es el último administrador
    const count = await countAdmins()
    if (count <= 1) {
      return false
    }
    
    await db.admin.delete({
      where: { id: adminId }
    })
    
    return true
  } catch {
    return false
  }
}

// Crear administrador inicial
export async function createAdmin(email: string, password: string, name?: string): Promise<{ id: string; email: string }> {
  const hashedPassword = await hashPassword(password)
  
  const admin = await db.admin.create({
    data: {
      email,
      password: hashedPassword,
      name: name || 'Administrador'
    }
  })
  
  return { id: admin.id, email: admin.email }
}

// Autenticar administrador
export async function authenticateAdmin(email: string, password: string): Promise<{ id: string; email: string; name: string | null } | null> {
  const admin = await db.admin.findUnique({
    where: { email }
  })
  
  if (!admin) {
    return null
  }
  
  const isValid = await verifyPassword(password, admin.password)
  
  if (!isValid) {
    return null
  }
  
  return { id: admin.id, email: admin.email, name: admin.name }
}

// Obtener administrador actual
export async function getCurrentAdmin(): Promise<{ id: string; email: string; name: string | null } | null> {
  const session = await verifySession()
  
  if (!session) {
    return null
  }
  
  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true }
  })
  
  return admin
}
