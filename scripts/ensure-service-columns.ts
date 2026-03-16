import { createClient } from '@libsql/client'

type ColumnInfoRow = {
  name?: unknown
}

function getTargetConfig(): { url: string; authToken?: string; targetLabel: string } {
  const args = new Set(process.argv.slice(2))
  const forceLocal = args.has('--local')
  const forceTurso = args.has('--turso')

  if (forceLocal && forceTurso) {
    throw new Error('No uses --local y --turso al mismo tiempo.')
  }

  if (forceLocal) {
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) throw new Error('Falta DATABASE_URL para usar --local.')
    return { url: databaseUrl, targetLabel: 'SQLite (DATABASE_URL)' }
  }

  if (forceTurso) {
    const tursoUrl = process.env.TURSO_DATABASE_URL
    const tursoAuthToken = process.env.TURSO_AUTH_TOKEN
    if (!tursoUrl || !tursoAuthToken) {
      throw new Error('Faltan TURSO_DATABASE_URL/TURSO_AUTH_TOKEN para usar --turso.')
    }
    return { url: tursoUrl, authToken: tursoAuthToken, targetLabel: 'Turso (libsql)' }
  }

  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN
  if (tursoUrl && tursoAuthToken) {
    return { url: tursoUrl, authToken: tursoAuthToken, targetLabel: 'Turso (libsql)' }
  }

  const databaseUrl = process.env.DATABASE_URL
  if (databaseUrl) {
    return { url: databaseUrl, targetLabel: 'SQLite (DATABASE_URL)' }
  }

  throw new Error('Faltan variables: define TURSO_DATABASE_URL/TURSO_AUTH_TOKEN o DATABASE_URL.')
}

async function main() {
  const { url, authToken, targetLabel } = getTargetConfig()
  console.log(`🔧 Verificando columnas de Service en: ${targetLabel}`)

  const client = createClient({ url, authToken })

  const pragma = await client.execute('PRAGMA table_info("Service")')
  const existingColumns = new Set(
    pragma.rows
      .map((row) => (row as ColumnInfoRow).name)
      .filter((name): name is string => typeof name === 'string'),
  )

  if (existingColumns.size === 0) {
    throw new Error('No se encontró la tabla "Service" (o no se pudo leer su esquema).')
  }

  const requiredColumns: Array<{ name: string; sqlType: string }> = [
    { name: 'slug', sqlType: 'TEXT' },
    { name: 'blocks', sqlType: 'TEXT' },
    { name: 'shortBlocks', sqlType: 'TEXT' },
  ]

  const added: string[] = []
  for (const { name, sqlType } of requiredColumns) {
    if (existingColumns.has(name)) continue
    console.log(`+ Agregando columna Service.${name}...`)
    await client.execute(`ALTER TABLE "Service" ADD COLUMN "${name}" ${sqlType}`)
    added.push(name)
  }

  if (added.length === 0) {
    console.log('✅ La tabla "Service" ya está en sync (no había columnas faltantes).')
    return
  }

  console.log(`✅ Listo. Columnas agregadas: ${added.join(', ')}`)
}

main().catch((error) => {
  console.error('❌ Error asegurando columnas:', error)
  process.exit(1)
})
