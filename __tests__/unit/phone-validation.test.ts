/**
 * Phone validation tests
 */

import { describe, it, expect } from 'vitest'
import { validatePhone, validateFullPhone } from '@/lib/phone-validation'

describe('validatePhone', () => {
  it('should validate Colombian number (10 digits)', () => {
    const result = validatePhone('3001234567', '+57')
    expect(result.valid).toBe(true)
  })

  it('should validate Colombian number with spaces', () => {
    const result = validatePhone('300 123 4567', '+57')
    expect(result.valid).toBe(true)
  })

  it('should reject too short Colombian number', () => {
    const result = validatePhone('30012345', '+57')
    expect(result.valid).toBe(false)
  })

  it('should reject too long Colombian number', () => {
    const result = validatePhone('30012345678', '+57')
    expect(result.valid).toBe(false)
  })

  it('should validate Spanish number (9 digits)', () => {
    const result = validatePhone('600123456', '+34')
    expect(result.valid).toBe(true)
  })

  it('should validate Mexican number (10 digits)', () => {
    const result = validatePhone('5512345678', '+52')
    expect(result.valid).toBe(true)
  })

  it('should validate Argentine number (10 digits)', () => {
    const result = validatePhone('1155554444', '+54')
    expect(result.valid).toBe(true)
  })

  it('should validate Brazilian mobile number (11 digits)', () => {
    const result = validatePhone('11987654321', '+55')
    expect(result.valid).toBe(true)
  })

  it('should validate Brazilian landline number (10 digits)', () => {
    const result = validatePhone('1133334444', '+55')
    expect(result.valid).toBe(true)
  })

  it('should validate Chilean number (9 digits)', () => {
    const result = validatePhone('987654321', '+56')
    expect(result.valid).toBe(true)
  })

  it('should validate UK number (10 digits)', () => {
    const result = validatePhone('7700123456', '+44')
    expect(result.valid).toBe(true)
  })

  it('should validate French number (9 digits)', () => {
    const result = validatePhone('612345678', '+33')
    expect(result.valid).toBe(true)
  })

  it('should validate German number (10 digits)', () => {
    const result = validatePhone('1512345678', '+49')
    expect(result.valid).toBe(true)
  })

  it('should validate German number (11 digits)', () => {
    const result = validatePhone('15123456789', '+49')
    expect(result.valid).toBe(true)
  })

  it('should validate Italian number (10 digits)', () => {
    const result = validatePhone('3311234567', '+39')
    expect(result.valid).toBe(true)
  })

  it('should validate Australian number (9 digits)', () => {
    const result = validatePhone('412345678', '+61')
    expect(result.valid).toBe(true)
  })

  it('should validate New Zealand number (9 digits)', () => {
    const result = validatePhone('211234567', '+64')
    expect(result.valid).toBe(true)
  })

  it('should validate Belize number (7 digits)', () => {
    const result = validatePhone('2221234', '+501')
    expect(result.valid).toBe(true)
  })

  it('should validate Guatemalan number (8 digits)', () => {
    const result = validatePhone('55551234', '+502')
    expect(result.valid).toBe(true)
  })

  it('should validate Panamanian number (8 digits)', () => {
    const result = validatePhone('60001234', '+507')
    expect(result.valid).toBe(true)
  })

  it('should validate Ecuadorian number (9 digits)', () => {
    const result = validatePhone('987654321', '+593')
    expect(result.valid).toBe(true)
  })

  it('should validate Uruguayan number (9 digits)', () => {
    const result = validatePhone('987654321', '+598')
    expect(result.valid).toBe(true)
  })

  it('should reject invalid country code', () => {
    const result = validatePhone('12345678', '+999')
    expect(result.valid).toBe(false)
  })

  it('should allow empty phone (optional)', () => {
    const result = validatePhone('', '+57')
    expect(result.valid).toBe(true)
  })

  it('should validate number with parentheses and dashes', () => {
    const result = validatePhone('(300) 123-4567', '+57')
    expect(result.valid).toBe(true)
  })
})

describe('validateFullPhone', () => {
  it('should validate complete Colombian number', () => {
    const result = validateFullPhone('+57 3001234567')
    expect(result.valid).toBe(true)
  })

  it('should validate complete number without space after code', () => {
    const result = validateFullPhone('+573001234567')
    expect(result.valid).toBe(true)
  })

  it('should validate complete Spanish number', () => {
    const result = validateFullPhone('+34 600123456')
    expect(result.valid).toBe(true)
  })

  it('should reject number without country code', () => {
    const result = validateFullPhone('3001234567')
    expect(result.valid).toBe(false)
  })

  it('should reject invalid country code in full phone', () => {
    const result = validateFullPhone('+999 12345678')
    expect(result.valid).toBe(false)
  })
})
