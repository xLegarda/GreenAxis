/**
 * Phone validation tests for backend
 */

import { describe, it, expect } from 'vitest'
import { validateFullPhone } from '@/lib/phone-validation'

describe('validateFullPhone (Backend)', () => {
  it('should validate Colombian number with space', () => {
    const result = validateFullPhone('+57 3001234567')
    expect(result.valid).toBe(true)
  })

  it('should validate Colombian number without space', () => {
    const result = validateFullPhone('+573001234567')
    expect(result.valid).toBe(true)
  })

  it('should validate Spanish number', () => {
    const result = validateFullPhone('+34 600123456')
    expect(result.valid).toBe(true)
  })

  it('should validate Brazilian number with 11 digits', () => {
    const result = validateFullPhone('+55 11987654321')
    expect(result.valid).toBe(true)
  })

  it('should validate German number with 11 digits', () => {
    const result = validateFullPhone('+49 15123456789')
    expect(result.valid).toBe(true)
  })

  it('should validate Mexican number', () => {
    const result = validateFullPhone('+52 5512345678')
    expect(result.valid).toBe(true)
  })

  it('should validate number with parentheses and dashes', () => {
    const result = validateFullPhone('+57 (300) 123-4567')
    expect(result.valid).toBe(true)
  })

  it('should reject number without country code', () => {
    const result = validateFullPhone('3001234567')
    expect(result.valid).toBe(false)
  })

  it('should reject very short country code', () => {
    const result = validateFullPhone('+5 3001234567')
    expect(result.valid).toBe(false)
  })

  it('should reject too short Colombian number', () => {
    const result = validateFullPhone('+57 30012345')
    expect(result.valid).toBe(false)
  })

  it('should reject too long Colombian number', () => {
    const result = validateFullPhone('+57 30012345678')
    expect(result.valid).toBe(false)
  })

  it('should validate Belize number (7 digits)', () => {
    const result = validateFullPhone('+501 2221234')
    expect(result.valid).toBe(true)
  })

  it('should validate Uruguay number (9 digits)', () => {
    const result = validateFullPhone('+598 987654321')
    expect(result.valid).toBe(true)
  })

  it('should validate Chile number (9 digits)', () => {
    const result = validateFullPhone('+56 987654321')
    expect(result.valid).toBe(true)
  })
})
