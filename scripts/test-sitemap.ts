/**
 * Script de prueba para verificar que el sitemap funcione correctamente
 * Ejecutar con: bun run scripts/test-sitemap.ts
 */

import { db } from '../src/lib/db'

async function testSitemap() {
  console.log('🔍 Verificando configuración del sitemap...\n')

  try {
    // 1. Verificar configuración de la plataforma
    console.log('1️⃣ Verificando configuración de la plataforma...')
    const config = await db.platformConfig.findFirst()
    
    if (!config) {
      console.log('⚠️  No hay configuración de plataforma')
      console.log('   Se usará el fallback: https://greenaxis.com.co')
    } else {
      console.log(`✅ siteUrl: ${config.siteUrl || 'No configurado (usará fallback)'}`)
      console.log(`✅ siteName: ${config.siteName}`)
    }

    // 2. Verificar servicios activos
    console.log('\n2️⃣ Verificando servicios activos...')
    const services = await db.service.findMany({
      where: {
        active: true,
        slug: { not: null },
      },
      select: {
        slug: true,
        imageUrl: true,
        featured: true,
      },
    })

    console.log(`✅ Servicios activos encontrados: ${services.length}`)
    services.forEach((service, index) => {
      const hasImage = service.imageUrl ? '🖼️' : '❌'
      const isFeatured = service.featured ? '⭐' : '  '
      console.log(`   ${index + 1}. ${isFeatured} ${hasImage} /servicios/${service.slug}`)
    })

    // 3. Verificar noticias publicadas
    console.log('\n3️⃣ Verificando noticias publicadas...')
    const news = await db.news.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        imageUrl: true,
        featured: true,
      },
    })

    console.log(`✅ Noticias publicadas encontradas: ${news.length}`)
    news.forEach((article, index) => {
      const hasImage = article.imageUrl ? '🖼️' : '❌'
      const isFeatured = article.featured ? '⭐' : '  '
      console.log(`   ${index + 1}. ${isFeatured} ${hasImage} /noticias/${article.slug}`)
    })

    // 4. Resumen
    console.log('\n📊 RESUMEN DEL SITEMAP:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📄 Páginas estáticas: 7`)
    console.log(`🔧 Servicios: ${services.length}`)
    console.log(`📰 Noticias: ${news.length}`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📊 TOTAL URLs en sitemap: ${7 + services.length + news.length}`)
    
    const servicesWithImages = services.filter(s => s.imageUrl).length
    const newsWithImages = news.filter(n => n.imageUrl).length
    console.log(`🖼️  URLs con imágenes: ${servicesWithImages + newsWithImages}`)

    // 5. Verificar problemas potenciales
    console.log('\n🔍 VERIFICACIÓN DE PROBLEMAS:')
    
    const servicesWithoutSlug = await db.service.findMany({
      where: {
        active: true,
        slug: null,
      },
    })
    
    if (servicesWithoutSlug.length > 0) {
      console.log(`⚠️  ${servicesWithoutSlug.length} servicios activos SIN slug (no aparecerán en sitemap)`)
    } else {
      console.log('✅ Todos los servicios activos tienen slug')
    }

    const newsWithoutSlug = await db.news.findMany({
      where: {
        published: true,
        slug: { equals: null },
      },
    })
    
    if (newsWithoutSlug.length > 0) {
      console.log(`⚠️  ${newsWithoutSlug.length} noticias publicadas SIN slug (no aparecerán en sitemap)`)
    } else {
      console.log('✅ Todas las noticias publicadas tienen slug')
    }

    console.log('\n✅ Verificación completada exitosamente!')
    console.log('\n💡 Para probar el sitemap:')
    console.log('   1. Ejecuta: npm run dev')
    console.log('   2. Visita: http://localhost:3000/sitemap.xml')
    console.log('   3. Verifica que veas el XML con todas las URLs')

  } catch (error) {
    console.error('❌ Error al verificar sitemap:', error)
    process.exit(1)
  }
}

testSitemap()
