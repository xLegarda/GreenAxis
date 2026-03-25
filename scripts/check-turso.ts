import { PrismaClient } from '../prisma/generated/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Conectando a Turso...\n')

  const tables = {
    platformConfig: () => prisma.platformConfig.findMany(),
    services: () => prisma.service.findMany(),
    news: () => prisma.news.findMany(),
    siteImages: () => prisma.siteImage.findMany(),
    carouselSlides: () => prisma.carouselSlide.findMany(),
    legalPages: () => prisma.legalPage.findMany(),
    contactMessages: () => prisma.contactMessage.findMany(),
    socialFeedConfigs: () => prisma.socialFeedConfig.findMany(),
    admins: () => prisma.admin.findMany(),
    passwordResetTokens: () => prisma.passwordResetToken.findMany(),
    aboutPage: () => prisma.aboutPage.findMany(),
  }

  for (const [name, query] of Object.entries(tables)) {
    try {
      const count = await query()
      console.log(`${name}: ${count.length} registros`)
    } catch (e) {
      console.log(`${name}: error - ${e}`)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('Error:', e)
  process.exit(1)
})
