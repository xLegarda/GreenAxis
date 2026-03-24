import { describe, it, expect } from 'vitest'
import { validatePhone, validateFullPhone, getCountryHint, COUNTRIES } from '@/lib/phone-validation'

describe('validatePhone', () => {
  describe('campo vacío', () => {
    it('debe retornar válido si el teléfono está vacío', () => {
      expect(validatePhone('', '+57').valid).toBe(true)
    })

    it('debe retornar válido si el teléfono es solo espacios', () => {
      expect(validatePhone('   ', '+57').valid).toBe(true)
    })
  })

  describe('código de país inválido', () => {
    it('debe fallar con código no registrado', () => {
      const result = validatePhone('3001234567', '+999')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Código de país no válido')
    })
  })

  describe('Colombia (+57) - números móviles', () => {
    it('debe aceptar número móvil que empieza con 3', () => {
      expect(validatePhone('3001234567', '+57').valid).toBe(true)
    })

    it('debe aceptar Claro (300-305)', () => {
      expect(validatePhone('3001234567', '+57').valid).toBe(true)
      expect(validatePhone('3011234567', '+57').valid).toBe(true)
      expect(validatePhone('3051234567', '+57').valid).toBe(true)
    })

    it('debe aceptar Movistar (310-315)', () => {
      expect(validatePhone('3101234567', '+57').valid).toBe(true)
      expect(validatePhone('3151234567', '+57').valid).toBe(true)
    })

    it('debe aceptar Tigo (320-323)', () => {
      expect(validatePhone('3201234567', '+57').valid).toBe(true)
      expect(validatePhone('3231234567', '+57').valid).toBe(true)
    })

    it('debe rechazar número que empieza con 1', () => {
      const result = validatePhone('1234567890', '+57')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Debe iniciar con: 2, 3, 5, 6')
    })

    it('debe rechazar número que empieza con 4', () => {
      const result = validatePhone('4234567890', '+57')
      expect(result.valid).toBe(false)
    })

    it('debe rechazar número que empieza con 7', () => {
      const result = validatePhone('7234567890', '+57')
      expect(result.valid).toBe(false)
    })

    it('debe rechazar número que empieza con 8', () => {
      const result = validatePhone('8234567890', '+57')
      expect(result.valid).toBe(false)
    })

    it('debe rechazar número que empieza con 9', () => {
      const result = validatePhone('9234567890', '+57')
      expect(result.valid).toBe(false)
    })
  })

  describe('Colombia (+57) - números fijos', () => {
    it('debe aceptar fijo Bogotá (601)', () => {
      expect(validatePhone('6011234567', '+57').valid).toBe(true)
    })

    it('debe aceptar fijo Cali (602)', () => {
      expect(validatePhone('6021234567', '+57').valid).toBe(true)
    })

    it('debe aceptar fijo Medellín (604)', () => {
      expect(validatePhone('6041234567', '+57').valid).toBe(true)
    })

    it('debe aceptar fijo que empieza con 2', () => {
      expect(validatePhone('2123456789', '+57').valid).toBe(true)
    })

    it('debe aceptar fijo que empieza con 5', () => {
      expect(validatePhone('5123456789', '+57').valid).toBe(true)
    })

    it('debe aceptar fijo que empieza con 6', () => {
      expect(validatePhone('6123456789', '+57').valid).toBe(true)
    })
  })

  describe('Colombia (+57) - longitud incorrecta', () => {
    it('debe rechazar número con menos de 10 dígitos', () => {
      const result = validatePhone('300123456', '+57')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('10')
    })

    it('debe rechazar número con más de 10 dígitos', () => {
      const result = validatePhone('30012345678', '+57')
      expect(result.valid).toBe(false)
    })
  })

  describe('Colombia (+57) - formato con separadores', () => {
    it('debe aceptar número con espacios', () => {
      expect(validatePhone('300 123 4567', '+57').valid).toBe(true)
    })

    it('debe aceptar número con guiones', () => {
      expect(validatePhone('300-123-4567', '+57').valid).toBe(true)
    })

    it('debe aceptar número con paréntesis', () => {
      expect(validatePhone('(300) 123 4567', '+57').valid).toBe(true)
    })
  })

  describe('España (+34)', () => {
    it('debe aceptar móvil español de 9 dígitos', () => {
      expect(validatePhone('612345678', '+34').valid).toBe(true)
    })

    it('debe rechazar menos de 9 dígitos', () => {
      expect(validatePhone('61234567', '+34').valid).toBe(false)
    })

    it('debe rechazar más de 9 dígitos', () => {
      expect(validatePhone('6123456789', '+34').valid).toBe(false)
    })
  })

  describe('México (+52)', () => {
    it('debe aceptar número mexicano de 10 dígitos', () => {
      expect(validatePhone('5512345678', '+52').valid).toBe(true)
    })

    it('debe rechazar menos de 10 dígitos', () => {
      expect(validatePhone('551234567', '+52').valid).toBe(false)
    })
  })

  describe('Argentina (+54)', () => {
    it('debe aceptar número argentino de 10 dígitos', () => {
      expect(validatePhone('1155554444', '+54').valid).toBe(true)
    })
  })

  describe('Brasil (+55)', () => {
    it('debe aceptar número fijo de 10 dígitos', () => {
      expect(validatePhone('1123456789', '+55').valid).toBe(true)
    })

    it('debe aceptar número móvil de 11 dígitos', () => {
      expect(validatePhone('11987654321', '+55').valid).toBe(true)
    })
  })

  describe('Perú (+51)', () => {
    it('debe aceptar número peruano de 9 dígitos', () => {
      expect(validatePhone('912345678', '+51').valid).toBe(true)
    })
  })

  describe('Chile (+56)', () => {
    it('debe aceptar número chileno de 9 dígitos', () => {
      expect(validatePhone('987654321', '+56').valid).toBe(true)
    })
  })

  describe('Uruguay (+598) - números móviles', () => {
    it('debe aceptar móvil que empieza con 9', () => {
      expect(validatePhone('991234567', '+598').valid).toBe(true)
    })

    it('debe aceptar móvil Antel (99)', () => {
      expect(validatePhone('991234567', '+598').valid).toBe(true)
    })

    it('debe aceptar móvil Claro (94)', () => {
      expect(validatePhone('941234567', '+598').valid).toBe(true)
    })

    it('debe aceptar móvil Movistar (98)', () => {
      expect(validatePhone('981234567', '+598').valid).toBe(true)
    })
  })

  describe('Uruguay (+598) - números fijos', () => {
    it('debe aceptar fijo Montevideo que empieza con 2', () => {
      expect(validatePhone('212345678', '+598').valid).toBe(true)
    })

    it('debe aceptar fijo interior que empieza con 4', () => {
      expect(validatePhone('462123456', '+598').valid).toBe(true)
    })
  })

  describe('Uruguay (+598) - prefijos inválidos', () => {
    it('debe rechazar número que empieza con 1', () => {
      const result = validatePhone('123456789', '+598')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Debe iniciar con: 2, 4, 9')
    })

    it('debe rechazar número que empieza con 3', () => {
      const result = validatePhone('323456789', '+598')
      expect(result.valid).toBe(false)
    })

    it('debe rechazar número que empieza con 5', () => {
      const result = validatePhone('523456789', '+598')
      expect(result.valid).toBe(false)
    })

    it('debe rechazar número que empieza con 8', () => {
      const result = validatePhone('823456789', '+598')
      expect(result.valid).toBe(false)
    })
  })

  describe('Uruguay (+598) - longitud incorrecta', () => {
    it('debe rechazar menos de 9 dígitos', () => {
      const result = validatePhone('99123456', '+598')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('9')
    })

    it('debe rechazar más de 9 dígitos', () => {
      const result = validatePhone('9912345678', '+598')
      expect(result.valid).toBe(false)
    })
  })

  describe('Uruguay (+598) - formato con separadores', () => {
    it('debe aceptar con espacios', () => {
      expect(validatePhone('991 234 567', '+598').valid).toBe(true)
    })

    it('debe aceptar con guiones', () => {
      expect(validatePhone('991-234-567', '+598').valid).toBe(true)
    })
  })
})

describe('validateFullPhone', () => {
  describe('campo vacío', () => {
    it('debe retornar válido si el teléfono está vacío', () => {
      expect(validateFullPhone('').valid).toBe(true)
    })
  })

  describe('sin código de país', () => {
    it('debe fallar sin código de país', () => {
      const result = validateFullPhone('3001234567')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('código de país')
    })
  })

  describe('Colombia (+57) completo', () => {
    it('debe aceptar móvil colombiano completo', () => {
      expect(validateFullPhone('+57 3001234567').valid).toBe(true)
    })

    it('debe aceptar fijo colombiano completo', () => {
      expect(validateFullPhone('+57 6011234567').valid).toBe(true)
    })

    it('debe rechazar número que no empieza con prefijo válido', () => {
      const result = validateFullPhone('+57 1234567890')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Debe iniciar con: 2, 3, 5, 6')
    })

    it('debe aceptar con espacio separador', () => {
      expect(validateFullPhone('+57 300 123 4567').valid).toBe(true)
    })
  })

  describe('España (+34) completo', () => {
    it('debe aceptar teléfono español completo', () => {
      expect(validateFullPhone('+34 612345678').valid).toBe(true)
    })
  })

  describe('México (+52) completo', () => {
    it('debe aceptar teléfono mexicano completo', () => {
      expect(validateFullPhone('+52 5512345678').valid).toBe(true)
    })
  })

  describe('Norteamérica y Caribe (+1) completo', () => {
    it('debe aceptar teléfono estadounidense completo', () => {
      expect(validateFullPhone('+1 7871234567').valid).toBe(true)
    })
  })

  describe('Uruguay (+598) completo', () => {
    it('debe aceptar móvil uruguayo completo', () => {
      expect(validateFullPhone('+598 991234567').valid).toBe(true)
    })

    it('debe aceptar fijo Montevideo completo', () => {
      expect(validateFullPhone('+598 212345678').valid).toBe(true)
    })

    it('debe aceptar fijo interior completo', () => {
      expect(validateFullPhone('+598 462123456').valid).toBe(true)
    })

    it('debe rechazar prefijo inválido', () => {
      const result = validateFullPhone('+598 123456789')
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Debe iniciar con: 2, 4, 9')
    })

    it('debe aceptar con espacio separador', () => {
      expect(validateFullPhone('+598 991 234 567').valid).toBe(true)
    })
  })

  describe('longitud incorrecta con código', () => {
    it('debe rechazar si faltan dígitos nacionales', () => {
      const result = validateFullPhone('+57 300123')
      expect(result.valid).toBe(false)
    })

    it('debe rechazar si sobran dígitos nacionales', () => {
      const result = validateFullPhone('+57 30012345678')
      expect(result.valid).toBe(false)
    })
  })
})

describe('getCountryHint', () => {
  it('debe retornar hint de Colombia', () => {
    const hint = getCountryHint('+57')
    expect(hint).toContain('cel')
    expect(hint).toContain('fijo')
  })

  it('debe retornar hint de España', () => {
    expect(getCountryHint('+34')).toBe('612 345 678')
  })

  it('debe retornar hint de México', () => {
    expect(getCountryHint('+52')).toBe('55 1234 5678')
  })

  it('debe retornar hint de Uruguay con cel y fijo', () => {
    const hint = getCountryHint('+598')
    expect(hint).toContain('cel')
    expect(hint).toContain('fijo')
  })

  it('debe retornar fallback para país no registrado', () => {
    expect(getCountryHint('+999')).toBe('123 456 7890')
  })
})

describe('COUNTRIES', () => {
  it('debe contener al menos 30 países', () => {
    expect(COUNTRIES.length).toBeGreaterThanOrEqual(30)
  })

  it('Colombia debe tener validFirstDigits configurado', () => {
    const colombia = COUNTRIES.find(c => c.code === '+57')
    expect(colombia).toBeDefined()
    expect(colombia!.validFirstDigits).toEqual([2, 3, 5, 6])
  })

  it('Uruguay debe tener validFirstDigits configurado', () => {
    const uruguay = COUNTRIES.find(c => c.code === '+598')
    expect(uruguay).toBeDefined()
    expect(uruguay!.validFirstDigits).toEqual([2, 4, 9])
  })

  it('cada país debe tener minDigits y maxDigits válidos', () => {
    COUNTRIES.forEach(country => {
      expect(country.minDigits).toBeGreaterThan(0)
      expect(country.maxDigits).toBeGreaterThanOrEqual(country.minDigits)
    })
  })
})
