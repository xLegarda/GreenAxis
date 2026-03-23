export const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export const MAX_IP_ATTEMPTS = 15
export const MAX_USER_ATTEMPTS = 5
export const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutos

export function checkRateLimit(key: string, maxAttempts: number) {
  const attempts = loginAttempts.get(key)
  if (!attempts) return { blocked: false }

  const elapsed = Date.now() - attempts.lastAttempt
  if (elapsed >= LOCKOUT_TIME) {
    loginAttempts.delete(key)
    return { blocked: false }
  }

  if (attempts.count >= maxAttempts) {
    const remaining = Math.ceil((LOCKOUT_TIME - elapsed) / 60000)
    return { blocked: true, remaining }
  }

  return { blocked: false }
}
