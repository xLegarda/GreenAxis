import { PrismaClient } from '../prisma/generated/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./db/custom.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Base local:\n')
  console.log('platformConfig:', (await prisma.platformConfig.findMany()).length)
  console.log('services:', (await prisma.service.findMany()).length)
  console.log('news:', (await prisma.news.findMany()).length)
  console.log('siteImages:', (await prisma.siteImage.findMany()).length)
  console.log('carouselSlides:', (await prisma.carouselSlide.findMany()).length)
  console.log('legalPages:', (await prisma.legalPage.findMany()).length)
  console.log('contactMessages:', (await prisma.contactMessage.findMany()).length)
  console.log('admins:', (await prisma.admin.findMany()).length)
  console.log('aboutPage:', (await prisma.aboutPage.findMany()).length)
  await prisma.$disconnect()
}

main()
