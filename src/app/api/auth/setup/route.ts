import { NextRequest, NextResponse } from 'next/server'
import { adminExists, createAdmin, canCreateAdmin, countAdmins, getMaxAccounts } from '@/lib/auth'

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
    const { email, password, name } = body
    
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email y contraseña son requeridos' 
      }, { status: 400 })
    }
    
    // Validar contraseña segura
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'La contraseña debe tener al menos 8 caracteres' 
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
