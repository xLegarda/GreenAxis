/**
 * Pruebas unitarias para la validación de teléfonos
 * Ejecutar con: tsx src/lib/__tests__/phone-validation.test.ts
 */

import { validatePhone, validateFullPhone, COUNTRIES } from '../src/lib/phone-validation'

// Helper para afirmar
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`❌ ASSERTION FAILED: ${message}`)
  }
  console.log(`✅ ${message}`)
}

function runTests() {
  console.log('\n🧪 Ejecutando pruebas de validación de teléfono...\n')

  // ==================== PRUEBAS DE validatePhone ====================

  console.log('--- Pruebas de validatePhone ---\n')

  // Prueba 1: Número válido para Colombia
  const result1 = validatePhone('3001234567', '+57')
  assert(result1.valid === true, 'Prueba 1: Número colombiano válido (10 dígitos)')

  // Prueba 2: Número con espacios válido para Colombia
  const result2 = validatePhone('300 123 4567', '+57')
  assert(result2.valid === true, 'Prueba 2: Número colombiano con espacios')

  // Prueba 3: Número muy corto para Colombia
  const result3 = validatePhone('30012345', '+57')
  assert(result3.valid === false, 'Prueba 3: Número colombiano muy corto (8 dígitos)')

  // Prueba 4: Número muy largo para Colombia
  const result4 = validatePhone('30012345678', '+57')
  assert(result4.valid === false, 'Prueba 4: Número colombiano muy largo (11 dígitos)')

  // Prueba 5: España - 9 dígitos
  const result5 = validatePhone('600123456', '+34')
  assert(result5.valid === true, 'Prueba 5: Número español válido (9 dígitos)')

  // Prueba 6: México - 10 dígitos
  const result6 = validatePhone('5512345678', '+52')
  assert(result6.valid === true, 'Prueba 6: Número mexicano válido (10 dígitos)')

  // Prueba 7: Argentina - 10 dígitos
  const result7 = validatePhone('1155554444', '+54')
  assert(result7.valid === true, 'Prueba 7: Número argentino válido (10 dígitos)')

  // Prueba 8: Brasil - 11 dígitos (móvil)
  const result8 = validatePhone('11987654321', '+55')
  assert(result8.valid === true, 'Prueba 8: Número brasileño móvil válido (11 dígitos)')

  // Prueba 8b: Brasil - 10 dígitos (fijo)
  const result8b = validatePhone('1133334444', '+55')
  assert(result8b.valid === true, 'Prueba 8b: Número brasileño fijo válido (10 dígitos)')

  // Prueba 9: Chile - 9 dígitos
  const result9 = validatePhone('987654321', '+56')
  assert(result9.valid === true, 'Prueba 9: Número chileno válido (9 dígitos)')

  // Prueba 10: Reino Unido - 10 dígitos
  const result10 = validatePhone('7700123456', '+44')
  assert(result10.valid === true, 'Prueba 10: Número británico válido (10 dígitos)')

  // Prueba 11: Francia - 9 dígitos
  const result11 = validatePhone('612345678', '+33')
  assert(result11.valid === true, 'Prueba 11: Número francés válido (9 dígitos)')

  // Prueba 12: Alemania - 10 dígitos
  const result12 = validatePhone('15123456789', '+49')
  assert(result12.valid === true, 'Prueba 12: Número alemán válido (10 dígitos)')

  // Prueba 13: Italia - 10 dígitos
  const result13 = validatePhone('3311234567', '+39')
  assert(result13.valid === true, 'Prueba 13: Número italiano válido (10 dígitos)')

  // Prueba 14: Australia - 9 dígitos
  const result14 = validatePhone('412345678', '+61')
  assert(result14.valid === true, 'Prueba 14: Número australiano válido (9 dígitos)')

  // Prueba 15: Nueva Zelanda - 9 dígitos
  const result15 = validatePhone('211234567', '+64')
  assert(result15.valid === true, 'Prueba 15: Número neozelandés válido (9 dígitos)')

  // Prueba 16: Belice - 7 dígitos
  const result16 = validatePhone('2221234', '+501')
  assert(result16.valid === true, 'Prueba 16: Número de Belice válido (7 dígitos)')

  // Prueba 17: Guatemala - 8 dígitos
  const result17 = validatePhone('55551234', '+502')
  assert(result17.valid === true, 'Prueba 17: Número guatemalteco válido (8 dígitos)')

  // Prueba 18: Panama - 8 dígitos
  const result18 = validatePhone('60001234', '+507')
  assert(result18.valid === true, 'Prueba 18: Número panameño válido (8 dígitos)')

  // Prueba 19: Ecuador - 9 dígitos
  const result19 = validatePhone('987654321', '+593')
  assert(result19.valid === true, 'Prueba 19: Número ecuatoriano válido (9 dígitos)')

  // Prueba 20: Uruguay - 9 dígitos
  const result20 = validatePhone('987654321', '+598')
  assert(result20.valid === true, 'Prueba 20: Número uruguayo válido (9 dígitos)')

  // Prueba 21: País no encontrado
  const result21 = validatePhone('12345678', '+999')
  assert(result21.valid === false && result21.error !== undefined, 'Prueba 21: Código de país no válido')

  // Prueba 22: Teléfono vacío (opcional)
  const result22 = validatePhone('', '+57')
  assert(result22.valid === true, 'Prueba 22: Teléfono vacío es válido')

  // Prueba 23: Con caracteres especiales
  const result23 = validatePhone('(300) 123-4567', '+57')
  assert(result23.valid === true, 'Prueba 23: Número con paréntesis y guiones')

  // ==================== PRUEBAS DE validateFullPhone ====================

  console.log('\n--- Pruebas de validateFullPhone ---\n')

  // Prueba 24: Número completo con código de país
  const result24 = validateFullPhone('+57 3001234567')
  assert(result24.valid === true, 'Prueba 24: Número completo colombiano')

  // Prueba 25: Número completo sin espacio después del código
  const result25 = validateFullPhone('+573001234567')
  assert(result25.valid === true, 'Prueba 25: Número completo sin espacio después del código')

  // Prueba 26: Número completo español
  const result26 = validateFullPhone('+34 600123456')
  assert(result26.valid === true, 'Prueba 26: Número completo español')

  // Prueba 27: Número completo sin código de país
  const result27 = validateFullPhone('3001234567')
  assert(result27.valid === false, 'Prueba 27: Número sin código de país debería fallar')

  // Prueba 28: Código de país no válido en full phone
  const result28 = validateFullPhone('+999 12345678')
  assert(result28.valid === false, 'Prueba 28: Código de país no válido')

  // ==================== PRUEBAS DE LONGITUD POR PAÍS ====================

  console.log('\n--- Pruebas de longitudes específicas ---\n')

  // Prueba 29: Argentina - longitud exacta 10
  const result29a = validatePhone('1155554444', '+54')
  assert(result29a.valid === true, 'Prueba 29a: Argentina - 10 dígitos (válido)')
  const result29b = validatePhone('115555444', '+54')
  assert(result29b.valid === false, 'Prueba 29b: Argentina - 9 dígitos (inválido)')

  // Prueba 30: Alemania - permite 10-11 dígitos
  const result30a = validatePhone('1512345678', '+49')
  assert(result30a.valid === true, 'Prueba 30a: Alemania - 10 dígitos (válido)')
  const result30b = validatePhone('15123456789', '+49')
  assert(result30b.valid === true, 'Prueba 30b: Alemania - 11 dígitos (válido)')

  // ==================== RESUMEN ====================

  console.log('\n' + '='.repeat(50))
  console.log('✅ PRUEBAS COMPLETADAS EXITOSAMENTE')
  console.log('='.repeat(50) + '\n')
}

// Ejecutar pruebas
try {
  runTests()
} catch (error: any) {
  console.error('\n❌ Error en pruebas:', error.message)
  process.exit(1)
}
