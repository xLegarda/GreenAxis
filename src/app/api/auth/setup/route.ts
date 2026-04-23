import { NextRequest, NextResponse } from 'next/server'
import { adminExists, createAdmin, canCreateAdmin, countAdmins, getMaxAccounts } from '@/lib/auth'
import { validatePassword } from '@/lib/password-validator'
import { z } from 'zod'

const setupSchema = z.object({
  email: z.string({ message: 'Email es requerido' }).email({ message: 'Formato de email inválido' }),
  password: z.string({ message: 'Contraseña es requerida' }).min(8, 'Contraseña mínima de 8 caracteres'),
  name: z.string().optional()
})

export async function GET() {
  try {
    const exists = await adminExists()
    const count = await countAdmins()
    const maxAccounts = getMaxAccounts()
    const canCreate = await canCreateAdmin()
    
    return NextResponse.json({ 
      exists,
      count,
      maxAccounts,
      canCreate
    })
  } catch (error) {
    console.error('Error checking admin:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar si se puede crear más cuentas
    const canCreate = await canCreateAdmin()
    const maxAccounts = getMaxAccounts()
    
    if (!canCreate) {
      return NextResponse.json({ 
        error: `Se ha alcanzado el límite máximo de ${maxAccounts} cuenta(s). No se pueden crear más cuentas.` 
      }, { status: 400 })
    }
    
    const body = await request.json()
    
    const validationResult = setupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.issues[0].message }, { status: 400 })
    }
    const { email, password, name } = validationResult.data
    
    // Validar contraseña segura
    const validation = validatePassword(password)
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.errors.join(', ') 
      }, { status: 400 })
    }
    
    const admin = await createAdmin(email, password, name)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Administrador creado correctamente',
      admin: { id: admin.id, email: admin.email }
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
