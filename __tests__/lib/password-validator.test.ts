import { describe, it, expect } from 'vitest'
import { validatePassword, PASSWORD_RULES } from '@/lib/password-validator'

describe('validatePassword', () => {
  describe('contraseña válida completa', () => {
    it('debe retornar válido para una contraseña que cumple todas las reglas', () => {
      const result = validatePassword('Clave123!')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.rules.every((r) => r.passed)).toBe(true)
    })

    it('debe aceptar diferentes caracteres especiales', () => {
      const especiales = ['Clave123@', 'Clave123#', 'Clave123$', 'Clave123%', 'Clave123&']
      for (const pwd of especiales) {
        const result = validatePassword(pwd)
        expect(result.valid).toBe(true)
      }
    })
  })

  describe('regla: mínimo 8 caracteres', () => {
    it('debe fallar con menos de 8 caracteres', () => {
      const result = validatePassword('Ab1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Mínimo 8 caracteres')
    })

    it('debe pasar con exactamente 8 caracteres', () => {
      const result = validatePassword('Abc12!xy')
      expect(result.rules[0].passed).toBe(true)
    })
  })

  describe('regla: al menos una mayúscula', () => {
    it('debe fallar sin mayúsculas', () => {
      const result = validatePassword('abcdefg1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Al menos una mayúscula (A-Z)')
    })

    it('debe pasar con al menos una mayúscula', () => {
      const result = validatePassword('Abcdefg1!')
      expect(result.rules[1].passed).toBe(true)
    })
  })

  describe('regla: al menos una minúscula', () => {
    it('debe fallar sin minúsculas', () => {
      const result = validatePassword('ABCDEFG1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Al menos una minúscula (a-z)')
    })

    it('debe pasar con al menos una minúscula', () => {
      const result = validatePassword('ABCDefg1!')
      expect(result.rules[2].passed).toBe(true)
    })
  })

  describe('regla: al menos un número', () => {
    it('debe fallar sin números', () => {
      const result = validatePassword('Abcdefgh!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Al menos un número (0-9)')
    })

    it('debe pasar con al menos un número', () => {
      const result = validatePassword('Abcdef1h!')
      expect(result.rules[3].passed).toBe(true)
    })
  })

  describe('regla: al menos un carácter especial', () => {
    it('debe fallar sin caracteres especiales', () => {
      const result = validatePassword('Abcdefg12')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Al menos un carácter especial (!@#$%...)')
    })

    it('debe pasar con al menos un carácter especial', () => {
      const result = validatePassword('Abcdefg1@')
      expect(result.rules[4].passed).toBe(true)
    })
  })

  describe('múltiples errores', () => {
    it('debe retornar todos los errores que faltan', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })

    it('debe retornar errores específicos para contraseña vacía', () => {
      const result = validatePassword('')
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(5)
    })
  })

  describe('estructura del resultado', () => {
    it('debe retornar reglas con label y passed', () => {
      const result = validatePassword('test')
      expect(result.rules).toHaveLength(5)
      result.rules.forEach((rule) => {
        expect(rule).toHaveProperty('label')
        expect(rule).toHaveProperty('test')
        expect(rule).toHaveProperty('passed')
      })
    })
  })
})

describe('PASSWORD_RULES', () => {
  it('debe contener exactamente 5 reglas', () => {
    expect(PASSWORD_RULES).toHaveLength(5)
  })

  it('cada regla debe tener label y test function', () => {
    PASSWORD_RULES.forEach((rule) => {
      expect(typeof rule.label).toBe('string')
      expect(typeof rule.test).toBe('function')
    })
  })
})
