export interface PasswordRule {
  label: string
  test: (password: string) => boolean
}

export interface PasswordValidation {
  valid: boolean
  errors: string[]
  rules: Array<PasswordRule & { passed: boolean }>
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    label: 'Mínimo 8 caracteres',
    test: (p) => p.length >= 8,
  },
  {
    label: 'Al menos una mayúscula (A-Z)',
    test: (p) => /[A-Z]/.test(p),
  },
  {
    label: 'Al menos una minúscula (a-z)',
    test: (p) => /[a-z]/.test(p),
  },
  {
    label: 'Al menos un número (0-9)',
    test: (p) => /[0-9]/.test(p),
  },
  {
    label: 'Al menos un carácter especial (!@#$%...)',
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
]

export function validatePassword(password: string): PasswordValidation {
  const rules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(password),
  }))

  const errors = rules.filter((r) => !r.passed).map((r) => r.label)
  const valid = errors.length === 0

  return { valid, errors, rules }
}
