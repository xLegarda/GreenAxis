import { PrismaClient } from '../prisma/generated/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import fs from 'fs'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./db/custom.db',
})

const prisma = new PrismaClient({ adapter })

async function importLocal() {
  const files = fs.readdirSync('.').filter(f => f.startsWith('data-export-') && f.endsWith('.json'))
  if (files.length === 0) {
    console.error('No se encontró archivo data-export-*.json')
    process.exit(1)
  }

  const file = files.sort().reverse()[0]
  console.log(`Importando desde ${file} a base local...\n`)

  const data = JSON.parse(fs.readFileSync(file, 'utf-8'))

  const tables = [
    { name: 'platformConfig', fn: () => prisma.platformConfig.createMany({ data: data.platformConfig }) },
    { name: 'services', fn: () => prisma.service.createMany({ data: data.services }) },
    { name: 'news', fn: () => prisma.news.createMany({ data: data.news }) },
    { name: 'siteImages', fn: () => prisma.siteImage.createMany({ data: data.siteImages }) },
    { name: 'carouselSlides', fn: () => prisma.carouselSlide.createMany({ data: data.carouselSlides }) },
    { name: 'legalPages', fn: () => prisma.legalPage.createMany({ data: data.legalPages }) },
    { name: 'contactMessages', fn: () => prisma.contactMessage.createMany({ data: data.contactMessages }) },
    { name: 'admins', fn: () => prisma.admin.createMany({ data: data.admins }) },
    { name: 'aboutPage', fn: () => prisma.aboutPage.createMany({ data: data.aboutPage }) },
  ]

  for (const table of tables) {
    try {
      const items = data[table.name]
      if (items?.length) {
        await table.fn()
        console.log(`${table.name}: ${items.length} registros importados`)
      } else {
        console.log(`${table.name}: 0 registros, saltado`)
      }
    } catch (e: any) {
      console.log(`${table.name}: error - ${e.message}`)
    }
  }

  console.log('\nImportación completada')
  await prisma.$disconnect()
}

importLocal().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
