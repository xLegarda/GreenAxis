/**
 * Validación de teléfonos para países de habla hispana, Europa, Australia y Nueva Zelanda
 */

export interface CountryValidation {
  code: string
  name: string
  minDigits: number
  maxDigits: number
  hint?: string
}

export const COUNTRIES: CountryValidation[] = [
  { code: '+1', name: 'EE.UU. / Canadá', minDigits: 10, maxDigits: 10, hint: '(787) 123 4567' },
  { code: '+1', name: 'Puerto Rico', minDigits: 10, maxDigits: 10, hint: '(787) 123 4567' },
  { code: '+1', name: 'Rep. Dominicana', minDigits: 10, maxDigits: 10, hint: '(809) 123 4567' },
  { code: '+501', name: 'Belice', minDigits: 7, maxDigits: 7, hint: '222 1234' },
  { code: '+502', name: 'Guatemala', minDigits: 8, maxDigits: 8, hint: '5555 1234' },
  { code: '+503', name: 'El Salvador', minDigits: 8, maxDigits: 8, hint: '7000 1234' },
  { code: '+504', name: 'Honduras', minDigits: 8, maxDigits: 8, hint: '9500 1234' },
  { code: '+505', name: 'Nicaragua', minDigits: 8, maxDigits: 8, hint: '8000 1234' },
  { code: '+506', name: 'Costa Rica', minDigits: 8, maxDigits: 8, hint: '8000 1234' },
  { code: '+507', name: 'Panamá', minDigits: 8, maxDigits: 8, hint: '6000 1234' },
  { code: '+34', name: 'España', minDigits: 9, maxDigits: 9, hint: '612 345 678' },
  { code: '+51', name: 'Perú', minDigits: 9, maxDigits: 9, hint: '912 345 678' },
  { code: '+52', name: 'México', minDigits: 10, maxDigits: 10, hint: '55 1234 5678' },
  { code: '+53', name: 'Cuba', minDigits: 8, maxDigits: 8, hint: '05 1234 5678' },
  { code: '+54', name: 'Argentina', minDigits: 10, maxDigits: 10, hint: '11 5555 4444' },
  { code: '+55', name: 'Brasil', minDigits: 10, maxDigits: 11, hint: '(11) 98765-4321' },
  { code: '+56', name: 'Chile', minDigits: 9, maxDigits: 9, hint: '9 8765 4321' },
  { code: '+57', name: 'Colombia', minDigits: 10, maxDigits: 10, hint: '300 123 4567' },
  { code: '+58', name: 'Venezuela', minDigits: 10, maxDigits: 10, hint: '412 123 4567' },
  { code: '+593', name: 'Ecuador', minDigits: 9, maxDigits: 9, hint: '98 765 4321' },
  { code: '+595', name: 'Paraguay', minDigits: 9, maxDigits: 9, hint: '981 234 567' },
  { code: '+597', name: 'Surinam', minDigits: 9, maxDigits: 9, hint: '741 2345' },
  { code: '+598', name: 'Uruguay', minDigits: 9, maxDigits: 9, hint: '94 123 456' },
  { code: '+44', name: 'Reino Unido', minDigits: 10, maxDigits: 10, hint: '7700 900123' },
  { code: '+33', name: 'Francia', minDigits: 9, maxDigits: 9, hint: '6 12 34 56 78' },
  { code: '+49', name: 'Alemania', minDigits: 10, maxDigits: 11, hint: '1512 3456789' },
  { code: '+39', name: 'Italia', minDigits: 10, maxDigits: 10, hint: '312 345 6789' },
  { code: '+31', name: 'Países Bajos', minDigits: 9, maxDigits: 9, hint: '6 12345678' },
  { code: '+32', name: 'Bélgica', minDigits: 9, maxDigits: 9, hint: '470 12 34 56' },
  { code: '+61', name: 'Australia', minDigits: 9, maxDigits: 9, hint: '412 345 678' },
  { code: '+64', name: 'Nueva Zelanda', minDigits: 9, maxDigits: 9, hint: '21 234 5678' },
  { code: '+240', name: 'Guinea Ecuatorial', minDigits: 9, maxDigits: 9, hint: '222 123 456' },
]

export function validatePhone(phone: string, countryCode: string): { valid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { valid: true }
  }

  const country = COUNTRIES.find(c => c.code === countryCode)
  if (!country) {
    return { valid: false, error: `Código de país no válido: ${countryCode}` }
  }

  const digitsOnly = phone.replace(/\D/g, '')
  
  if (digitsOnly.length < country.minDigits || digitsOnly.length > country.maxDigits) {
    return { 
      valid: false, 
      error: `El número debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos para ${country.name}` 
    }
  }
  
  return { valid: true }
}

export function getCountryHint(countryCode: string): string {
  const country = COUNTRIES.find(c => c.code === countryCode)
  return country?.hint || '123 456 7890'
}

export function validateFullPhone(phone: string): { valid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { valid: true }
  }

  // Buscar el código de país en la lista de códigos disponibles
  let foundCountryCode: string | null = null
  
  for (const country of COUNTRIES) {
    if (phone.startsWith(country.code + ' ') || phone.startsWith(country.code)) {
      foundCountryCode = country.code
      break
    }
  }
  
  if (!foundCountryCode) {
    return { valid: false, error: 'El teléfono debe incluir el código de país (ej: +57)' }
  }

  const countryCodeDigits = foundCountryCode.replace('+', '')
  const digitsOnly = phone.replace(/\D/g, '')
  const nationalNumberLength = digitsOnly.length - countryCodeDigits.length
  
  // Validar longitud
  const country = COUNTRIES.find(c => c.code === foundCountryCode)
  if (!country) {
    return { valid: false, error: `Código de país no válido: ${foundCountryCode}` }
  }
  
  if (nationalNumberLength < country.minDigits || nationalNumberLength > country.maxDigits) {
    return { 
      valid: false, 
      error: `El número debe tener entre ${country.minDigits} y ${country.maxDigits} dígitos después del código de país` 
    }
  }
  
  return { valid: true }
}
