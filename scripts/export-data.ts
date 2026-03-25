import { PrismaClient } from '../prisma/generated/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'

async function createPrismaClient(): Promise<PrismaClient> {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    console.log('Conectando a Turso...')
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    return new PrismaClient({ adapter })
  } else {
    console.log('Conectando a SQLite local...')
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL || 'file:./db/custom.db',
    })
    return new PrismaClient({ adapter })
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
