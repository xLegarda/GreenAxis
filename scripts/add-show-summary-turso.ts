import { createClient } from '@libsql/client'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

/**
 * Agrega la columna showSummary a la tabla Service en Turso
 * Ejecutar: npx tsx scripts/add-show-summary-turso.ts
 */

async function addShowSummaryColumn() {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN

  if (!tursoUrl || !tursoAuthToken) {
    console.error('❌ Error: Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN en el .env')
    process.exit(1)
  }

  console.log('🌐 Conectando a Turso...')
  console.log(`   URL: ${tursoUrl}`)

  const client = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  })

  // Verificar si la columna ya existe
  const pragma = await client.execute('PRAGMA table_info("Service")')
  const columns = pragma.rows.map(row => row.name)
  
  console.log('\n📋 Columnas actuales en Service:', columns.join(', '))

  if (columns.includes('showSummary')) {
    console.log('\n✅ La columna "showSummary" ya existe en Turso. No es necesario agregarla.')
    return
  }

  // Agregar la columna
  console.log('\n🔧 Agregando columna "showSummary" a Service...')
  await client.execute('ALTER TABLE "Service" ADD COLUMN "showSummary" INTEGER DEFAULT 1')
  
  console.log('✅ Columna "showSummary" agregada exitosamente con valor por defecto TRUE')

  // Verificar
  const pragmaAfter = await client.execute('PRAGMA table_info("Service")')
  const columnsAfter = pragmaAfter.rows.map(row => row.name)
  console.log('\n📋 Columnas después del cambio:', columnsAfter.join(', '))
  
  console.log('\n🎉 Listo!')
}

addShowSummaryColumn().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
