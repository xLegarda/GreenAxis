/**
 * Pruebas unitarias para la validación de teléfono en el backend
 * Simula la validación que se hace en el API de contacto
 */

import { validateFullPhone } from '../phone-validation'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`❌ ASSERTION FAILED: ${message}`)
  }
  console.log(`✅ ${message}`)
}

function runTests() {
  console.log('\n🧪 Ejecutando pruebas de validación de teléfono (Backend)...\n')

  // Pruebas que simulan lo que llega desde el frontend
  console.log('--- Pruebas de números completos (como se envían desde el frontend) ---\n')

  // Número colombiano con código
  const result1 = validateFullPhone('+57 3001234567')
  assert(result1.valid === true, 'Prueba 1: Número completo colombiano con espacio')

  // Número colombiano sin espacio después del código
  const result2 = validateFullPhone('+573001234567')
  assert(result2.valid === true, 'Prueba 2: Número completo colombiano sin espacio')

  // Número español
  const result3 = validateFullPhone('+34 600123456')
  assert(result3.valid === true, 'Prueba 3: Número completo español')

  // Número brasileño con 11 dígitos
  const result4 = validateFullPhone('+55 11987654321')
  assert(result4.valid === true, 'Prueba 4: Número brasileño completo con 11 dígitos')

  // Número alemán con 11 dígitos
  const result5 = validateFullPhone('+49 15123456789')
  assert(result5.valid === true, 'Prueba 5: Número alemán completo con 11 dígitos')

  // Número mexicano
  const result6 = validateFullPhone('+52 5512345678')
  assert(result6.valid === true, 'Prueba 6: Número mexicano completo')

  // Número con guiones y paréntesis
  const result7 = validateFullPhone('+57 (300) 123-4567')
  assert(result7.valid === true, 'Prueba 7: Número con paréntesis y guiones')

  // Número sin código de país (debería fallar)
  const result8 = validateFullPhone('3001234567')
  assert(result8.valid === false, 'Prueba 8: Número sin código de país debería fallar')

  // Número con código de país muy corto
  const result9 = validateFullPhone('+5 3001234567')
  assert(result9.valid === false, 'Prueba 9: Código de país muy corto debería fallar')

  // Número colombiano muy corto (debería fallar)
  const result10 = validateFullPhone('+57 30012345')
  assert(result10.valid === false, 'Prueba 10: Número colombiano muy corto debería fallar')

  // Número colombiano muy largo (debería fallar)
  const result11 = validateFullPhone('+57 30012345678')
  assert(result11.valid === false, 'Prueba 11: Número colombiano muy largo debería fallar')

  // Número de Belice (7 dígitos)
  const result12 = validateFullPhone('+501 2221234')
  assert(result12.valid === true, 'Prueba 12: Número de Belice (7 dígitos)')

  // Número de Uruguay (9 dígitos)
  const result13 = validateFullPhone('+598 987654321')
  assert(result13.valid === true, 'Prueba 13: Número uruguayo (9 dígitos)')

  // Número de Chile (9 dígitos)
  const result14 = validateFullPhone('+56 987654321')
  assert(result14.valid === true, 'Prueba 14: Número chileno (9 dígitos)')

  console.log('\n' + '='.repeat(50))
  console.log('✅ PRUEBAS DE BACKEND COMPLETADAS EXITOSAMENTE')
  console.log('='.repeat(50) + '\n')
}

try {
  runTests()
} catch (error: any) {
  console.error('\n❌ Error en pruebas:', error.message)
  process.exit(1)
}
