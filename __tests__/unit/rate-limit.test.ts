/**
 * Rate limiting dual: IP + Usuario
 * Tests para verificar protección contra fuerza bruta
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  loginAttempts,
  checkRateLimit,
  MAX_IP_ATTEMPTS,
  MAX_USER_ATTEMPTS,
  LOCKOUT_TIME
} from '@/lib/rate-limit'

describe('Rate Limiting Dual', () => {
  beforeEach(() => {
    loginAttempts.clear()
  })

  describe('checkRateLimit', () => {
    it('should allow requests under the limit', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 5, lastAttempt: Date.now() })
      const result = checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS)
      expect(result.blocked).toBe(false)
    })

    it('should block requests at the limit', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 15, lastAttempt: Date.now() })
      const result = checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS)
      expect(result.blocked).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('should block requests over the limit', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 20, lastAttempt: Date.now() })
      const result = checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS)
      expect(result.blocked).toBe(true)
    })

    it('should reset after lockout time passes', () => {
      const oldTime = Date.now() - LOCKOUT_TIME - 1000
      loginAttempts.set('ip:192.168.1.1', { count: 20, lastAttempt: oldTime })
      const result = checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS)
      expect(result.blocked).toBe(false)
    })

    it('should return blocked false for unknown keys', () => {
      const result = checkRateLimit('ip:unknown', MAX_IP_ATTEMPTS)
      expect(result.blocked).toBe(false)
    })
  })

  describe('IP Rate Limiting', () => {
    it('should block after 15 failed attempts from same IP', () => {
      const ipKey = 'ip:192.168.1.1'

      for (let i = 1; i <= 15; i++) {
        loginAttempts.set(ipKey, { count: i, lastAttempt: Date.now() })
      }

      const result = checkRateLimit(ipKey, MAX_IP_ATTEMPTS)
      expect(result.blocked).toBe(true)
    })

    it('should allow different IPs independently', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 15, lastAttempt: Date.now() })
      loginAttempts.set('ip:192.168.1.2', { count: 5, lastAttempt: Date.now() })

      expect(checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS).blocked).toBe(true)
      expect(checkRateLimit('ip:192.168.1.2', MAX_IP_ATTEMPTS).blocked).toBe(false)
    })
  })

  describe('User Rate Limiting', () => {
    it('should block after 5 failed attempts for same user', () => {
      const userKey = 'user:test@example.com'

      for (let i = 1; i <= 5; i++) {
        loginAttempts.set(userKey, { count: i, lastAttempt: Date.now() })
      }

      const result = checkRateLimit(userKey, MAX_USER_ATTEMPTS)
      expect(result.blocked).toBe(true)
    })

    it('should allow different users independently', () => {
      loginAttempts.set('user:user1@example.com', { count: 5, lastAttempt: Date.now() })
      loginAttempts.set('user:user2@example.com', { count: 2, lastAttempt: Date.now() })

      expect(checkRateLimit('user:user1@example.com', MAX_USER_ATTEMPTS).blocked).toBe(true)
      expect(checkRateLimit('user:user2@example.com', MAX_USER_ATTEMPTS).blocked).toBe(false)
    })

    it('should track IP and user separately', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 10, lastAttempt: Date.now() })
      loginAttempts.set('user:test@example.com', { count: 3, lastAttempt: Date.now() })

      expect(checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS).blocked).toBe(false)
      expect(checkRateLimit('user:test@example.com', MAX_USER_ATTEMPTS).blocked).toBe(false)
    })
  })

  describe('Dual Protection', () => {
    it('should block by user limit even if IP limit not reached', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 10, lastAttempt: Date.now() })
      loginAttempts.set('user:victim@example.com', { count: 5, lastAttempt: Date.now() })

      expect(checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS).blocked).toBe(false)
      expect(checkRateLimit('user:victim@example.com', MAX_USER_ATTEMPTS).blocked).toBe(true)
    })

    it('should block by IP limit even if user limit not reached', () => {
      loginAttempts.set('ip:192.168.1.1', { count: 15, lastAttempt: Date.now() })
      loginAttempts.set('user:attacker@example.com', { count: 2, lastAttempt: Date.now() })

      expect(checkRateLimit('ip:192.168.1.1', MAX_IP_ATTEMPTS).blocked).toBe(true)
      expect(checkRateLimit('user:attacker@example.com', MAX_USER_ATTEMPTS).blocked).toBe(false)
    })

    it('should handle botnet attack (many IPs, same user)', () => {
      // Simula botnet: 10 IPs diferentes atacando la misma cuenta
      for (let i = 1; i <= 10; i++) {
        loginAttempts.set(`ip:192.168.1.${i}`, { count: 3, lastAttempt: Date.now() })
      }
      loginAttempts.set('user:target@example.com', { count: 5, lastAttempt: Date.now() })

      // Cada IP individual no excede su límite
      for (let i = 1; i <= 10; i++) {
        expect(checkRateLimit(`ip:192.168.1.${i}`, MAX_IP_ATTEMPTS).blocked).toBe(false)
      }

      // Pero la cuenta del usuario está protegida
      expect(checkRateLimit('user:target@example.com', MAX_USER_ATTEMPTS).blocked).toBe(true)
    })

    it('should handle shared IP scenario (many users, same IP)', () => {
      // Simula IP compartida (oficina, NAT)
      loginAttempts.set('ip:10.0.0.1', { count: 14, lastAttempt: Date.now() })

      // Usuario legítimo en IP compartida
      loginAttempts.set('user:user1@office.com', { count: 2, lastAttempt: Date.now() })
      // Usuario atacante en misma IP
      loginAttempts.set('user:attacker@office.com', { count: 5, lastAttempt: Date.now() })

      // IP casi en el límite pero aún permitida
      expect(checkRateLimit('ip:10.0.0.1', MAX_IP_ATTEMPTS).blocked).toBe(false)

      // Usuario legítimo puede acceder
      expect(checkRateLimit('user:user1@office.com', MAX_USER_ATTEMPTS).blocked).toBe(false)

      // Usuario atacante está bloqueado
      expect(checkRateLimit('user:attacker@office.com', MAX_USER_ATTEMPTS).blocked).toBe(true)
    })
  })
})
