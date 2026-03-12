import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./db/custom.db'
    }
  }
})

async function exportData() {
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

    fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2))
    console.log('✅ Datos exportados a data-export.json')
  } catch (error) {
    console.error('❌ Error exportando datos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
