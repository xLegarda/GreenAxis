'use server'

import { db } from '@/lib/db'

// Obtener configuración de la plataforma
export async function getPlatformConfig() {
  let config = await db.platformConfig.findFirst()
  
  if (!config) {
    config = await db.platformConfig.create({
      data: {
        siteName: 'Green Axis S.A.S.',
        siteSlogan: 'Comprometidos con el medio ambiente',
        siteDescription: 'Empresa líder en servicios ambientales en Colombia',
        whatsappMessage: '¡Hola! Me gustaría obtener información sobre sus servicios ambientales.',
        whatsappShowBubble: true,
      }
    })
  }
  
  return config
}

// Obtener servicios activos
export async function getServices() {
  return db.service.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })
}

// Obtener todos los servicios (admin)
export async function getAllServices() {
  return db.service.findMany({
    orderBy: { order: 'asc' }
  })
}

// Obtener servicio por slug
export async function getServiceBySlug(slug: string) {
  return db.service.findUnique({
    where: { slug }
  })
}

// Obtener noticias publicadas
export async function getNews(page: number = 1, limit: number = 6) {
  const skip = (page - 1) * limit
  
  const [news, total] = await Promise.all([
    db.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    db.news.count({ where: { published: true } })
  ])
  
  return {
    news,
    total,
    pages: Math.ceil(total / limit)
  }
}

// Obtener todas las noticias (admin)
export async function getAllNews() {
  return db.news.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// Obtener noticia por slug
export async function getNewsBySlug(slug: string) {
  return db.news.findUnique({
    where: { slug }
  })
}

// Obtener imágenes del sitio
export async function getSiteImages() {
  return db.siteImage.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// Obtener imagen por key
export async function getSiteImageByKey(key: string) {
  return db.siteImage.findUnique({
    where: { key }
  })
}

// Obtener slides del carrusel
export async function getCarouselSlides() {
  return db.carouselSlide.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })
}

// Obtener todos los slides (admin)
export async function getAllCarouselSlides() {
  return db.carouselSlide.findMany({
    orderBy: { order: 'asc' }
  })
}

// Obtener página legal
export async function getLegalPage(slug: string) {
  return db.legalPage.findUnique({
    where: { slug }
  })
}

// Obtener todas las páginas legales (admin)
export async function getAllLegalPages() {
  return db.legalPage.findMany()
}

// Obtener mensajes de contacto
export async function getContactMessages() {
  return db.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

// Obtener configuración de feeds sociales
export async function getSocialFeedConfigs() {
  return db.socialFeedConfig.findMany({
    where: { active: true }
  })
}

