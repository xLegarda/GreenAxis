import { NextResponse } from 'next/server'
import { getCurrentAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const admin = await getCurrentAdmin()
    
    if (!admin) {
      return NextResponse.json({ authenticated: false })
    }
    
    return NextResponse.json({ 
      authenticated: true,
      admin: { id: admin.id, email: admin.email, name: admin.name }
    })
  } catch (error) {
    console.error('Error checking auth:', error)
    return NextResponse.json({ authenticated: false })
  }
}
