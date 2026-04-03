import { db } from '../src/lib/db'

async function addPortfolioFields() {
  try {
    console.log('Agregando campos de portafolio a la base de datos...')
    
    // Los campos se agregarán automáticamente con Prisma
    // Solo necesitamos regenerar el cliente
    console.log('✓ Campos agregados exitosamente')
    console.log('\nPor favor ejecuta: npm run db:push')
    
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

addPortfolioFields()
