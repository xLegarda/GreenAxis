import 'dotenv/config'
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

async function migratePortfolioFields() {
  console.log('🚀 Iniciando migración de campos de portafolio a Turso...\n')

  try {
    // Verificar conexión
    console.log('📡 Verificando conexión a Turso...')
    await client.execute('SELECT 1')
    console.log('✅ Conexión exitosa\n')

    // Agregar campos a PlatformConfig
    console.log('📝 Agregando campos a PlatformConfig...')
    
    const platformConfigFields = [
      { name: 'portfolioEnabled', sql: 'ALTER TABLE PlatformConfig ADD COLUMN portfolioEnabled BOOLEAN NOT NULL DEFAULT 0' },
      { name: 'portfolioTitle', sql: "ALTER TABLE PlatformConfig ADD COLUMN portfolioTitle TEXT DEFAULT 'Descarga Nuestro Portafolio Corporativo'" },
      { name: 'portfolioUrl', sql: 'ALTER TABLE PlatformConfig ADD COLUMN portfolioUrl TEXT' },
    ]

    for (const field of platformConfigFields) {
      try {
        await client.execute(field.sql)
        console.log(`  ✓ ${field.name} agregado`)
      } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
          console.log(`  ⚠ ${field.name} ya existe`)
        } else {
          console.error(`  ❌ Error agregando ${field.name}:`, e.message)
        }
      }
    }

    // Agregar campos a Service
    console.log('\n📝 Agregando campos a Service...')
    
    const serviceFields = [
      { name: 'portfolioEnabled', sql: 'ALTER TABLE Service ADD COLUMN portfolioEnabled BOOLEAN NOT NULL DEFAULT 0' },
      { name: 'portfolioTitle', sql: "ALTER TABLE Service ADD COLUMN portfolioTitle TEXT DEFAULT 'Descarga el Portafolio de Servicios Ambientales'" },
      { name: 'portfolioUrl', sql: 'ALTER TABLE Service ADD COLUMN portfolioUrl TEXT' },
    ]

    for (const field of serviceFields) {
      try {
        await client.execute(field.sql)
        console.log(`  ✓ ${field.name} agregado`)
      } catch (e: any) {
        if (e.message.includes('duplicate column name')) {
          console.log(`  ⚠ ${field.name} ya existe`)
        } else {
          console.error(`  ❌ Error agregando ${field.name}:`, e.message)
        }
      }
    }

    console.log('\n✅ Migración completada exitosamente!')
    console.log('\n📊 Verificando estructura...')
    
    // Verificar que los campos existen
    const configResult = await client.execute('SELECT portfolioEnabled, portfolioTitle, portfolioUrl FROM PlatformConfig LIMIT 1')
    const serviceResult = await client.execute('SELECT portfolioEnabled, portfolioTitle, portfolioUrl FROM Service LIMIT 1')
    
    console.log('\nPlatformConfig tiene los campos:', configResult.columns.length === 3 ? '✅' : '❌')
    console.log('Service tiene los campos:', serviceResult.columns.length === 3 ? '✅' : '❌')

  } catch (error) {
    console.error('\n❌ Error durante la migración:', error)
    process.exit(1)
  } finally {
    client.close()
  }
}

migratePortfolioFields()
