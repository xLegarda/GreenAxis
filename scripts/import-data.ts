import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import fs from 'fs'

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const prisma = new PrismaClient({ adapter })

async function importData() {
  try {
    const data = JSON.parse(fs.readFileSync('data-export.json', 'utf-8'))

    console.log('📦 Importando datos a Turso...')

    // Importar en orden para evitar problemas de relaciones
    if (data.platformConfig?.length) {
      await prisma.platformConfig.createMany({ data: data.platformConfig, skipDuplicates: true })
      console.log(`✅ ${data.platformConfig.length} configuraciones importadas`)
    }

    if (data.services?.length) {
      await prisma.service.createMany({ data: data.services, skipDuplicates: true })
      console.log(`✅ ${data.services.length} servicios importados`)
    }

    if (data.news?.length) {
      await prisma.news.createMany({ data: data.news, skipDuplicates: true })
      console.log(`✅ ${data.news.length} noticias importadas`)
    }

    if (data.siteImages?.length) {
      await prisma.siteImage.createMany({ data: data.siteImages, skipDuplicates: true })
      console.log(`✅ ${data.siteImages.length} imágenes importadas`)
    }

    if (data.carouselSlides?.length) {
      await prisma.carouselSlide.createMany({ data: data.carouselSlides, skipDuplicates: true })
      console.log(`✅ ${data.carouselSlides.length} slides importados`)
    }

    if (data.legalPages?.length) {
      await prisma.legalPage.createMany({ data: data.legalPages, skipDuplicates: true })
      console.log(`✅ ${data.legalPages.length} páginas legales importadas`)
    }

    if (data.contactMessages?.length) {
      await prisma.contactMessage.createMany({ data: data.contactMessages, skipDuplicates: true })
      console.log(`✅ ${data.contactMessages.length} mensajes importados`)
    }

    if (data.admins?.length) {
      await prisma.admin.createMany({ data: data.admins, skipDuplicates: true })
      console.log(`✅ ${data.admins.length} administradores importados`)
    }

    if (data.aboutPage?.length) {
      await prisma.aboutPage.createMany({ data: data.aboutPage, skipDuplicates: true })
      console.log(`✅ ${data.aboutPage.length} páginas "Quiénes Somos" importadas`)
    }

    console.log('🎉 Importación completada exitosamente')
  } catch (error) {
    console.error('❌ Error importando datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData()
