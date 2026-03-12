import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      const page = await db.legalPage.findUnique({
        where: { slug },
        select: {
          id: true,
          slug: true,
          title: true,
          content: true,
          blocks: true,
          manualDate: true,
          updatedAt: true,
          createdAt: true
        }
      })
      return NextResponse.json(page)
    }
    
    const pages = await db.legalPage.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        content: true,
        blocks: true,
        manualDate: true,
        updatedAt: true,
        createdAt: true
      }
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching legal pages:', error)
    return NextResponse.json({ error: 'Error al obtener páginas' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const admin = await getCurrentAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug, title, content, blocks, manualDate } = body
    
    if (!slug || !title) {
      return NextResponse.json({ error: 'Slug y título son requeridos' }, { status: 400 })
    }
    
    // Upsert: crear si no existe, actualizar si existe
    const page = await db.legalPage.upsert({
      where: { slug },
      create: { 
        slug, 
        title, 
        content: content || '', 
        blocks: blocks || null,
        manualDate: manualDate || null 
      },
      update: { 
        title, 
        content: content || '', 
        blocks: blocks || null,
        manualDate: manualDate || null 
      }
    })
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error saving legal page:', error)
    return NextResponse.json({ error: 'Error al guardar página' }, { status: 500 })
  }
}
