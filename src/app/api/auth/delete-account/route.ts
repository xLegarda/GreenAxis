import { NextRequest, NextResponse } from 'next/server'
import { getCurrentAdmin, deleteAdmin, destroySession, countAdmins } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin()
    
    if (!admin) {
      return NextResponse.json({ 
        error: 'No autenticado' 
      }, { status: 401 })
    }
    
    // Verificar que no sea el último administrador
    const count = await countAdmins()
    if (count <= 1) {
      return NextResponse.json({ 
        error: 'No puedes eliminar la última cuenta de administrador' 
      }, { status: 400 })
    }
    
    // Eliminar la cuenta
    const deleted = await deleteAdmin(admin.id)
    
    if (!deleted) {
      return NextResponse.json({ 
        error: 'Error al eliminar la cuenta' 
      }, { status: 500 })
    }
    
    // Destruir la sesión
    await destroySession()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cuenta eliminada correctamente' 
    })
  } catch (error) {
    console.error('Error deleting account:', error)
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 })
  }
}
