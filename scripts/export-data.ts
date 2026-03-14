import { PrismaClient } from '@prisma/client'
import fs from 'fs'

/**
 * Crea el cliente de Prisma usando la misma lógica que la app:
 * - Si TURSO_DATABASE_URL está definida → usa Turso (base de datos en línea)
 * - Si no → usa SQLite local (DATABASE_URL del .env)
 */
async function createPrismaClient(): Promise<PrismaClient> {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    console.log('🌐 Conectando a Turso (base de datos en línea)...')
    const { PrismaLibSql } = await import('@prisma/adapter-libsql')
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    return new PrismaClient({ adapter } as any)
  } else {
    console.log('💾 Conectando a SQLite local (DATABASE_URL del .env)...')
    return new PrismaClient()
  }
}

async function exportData() {
  const prisma = await createPrismaClient()

  try {
    const data = {
      platformConfig: await prisma.platformConfig.findMany(),
      services: await prisma.service.findMany(),
      news: await prisma.news.findMany(),
      siteImages: await prisma.siteImage.findMany(),
      carouselSlides: await prisma.carouselSlide.findMany(),
      legalPages: await prisma.legalPage.findMany(),
      contactMessages: await prisma.contactMessage.findMany(),
      admins: await prisma.admin.findMany(),
      aboutPage: await prisma.aboutPage.findMany(),
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const filename = `data-export-${timestamp}.json`

    fs.writeFileSync(filename, JSON.stringify(data, null, 2))
    console.log(`✅ Datos exportados a ${filename}`)
    console.log(`   - ${data.platformConfig.length} configuraciones`)
    console.log(`   - ${data.services.length} servicios`)
    console.log(`   - ${data.news.length} noticias`)
    console.log(`   - ${data.siteImages.length} imágenes`)
    console.log(`   - ${data.carouselSlides.length} slides`)
    console.log(`   - ${data.legalPages.length} páginas legales`)
    console.log(`   - ${data.contactMessages.length} mensajes de contacto`)
    console.log(`   - ${data.admins.length} administradores`)
    console.log(`   - ${data.aboutPage.length} páginas "Quiénes Somos"`)
  } catch (error) {
    console.error('❌ Error exportando datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
