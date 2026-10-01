import { describe, it, expect } from 'vitest'
import { formatNational, formatPhone, normalizePhone, parsePhone } from '../../utils/phone.js'

describe('phone utils', () => {
  it.each([
    ['+33768308898', '+33768308898'],
    ['+33 7 68 30 88 98', '+33768308898'],
    ['+337 68 30 88 98', '+33768308898'],
    ['0768308898', '+33768308898'],
    ['+33 0123456789', '+33123456789'],
    ['+352612345', '+352612345'],
    ['', ''],
    [null, ''],
  ])('normalizes %j to %j', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it('keeps numbers longer than French ones', () => {
    expect(normalizePhone('+447911123456')).toBe('+447911123456')
    expect(normalizePhone('+12025550123')).toBe('+12025550123')
  })

  it('uses the fallback country code for numbers without one', () => {
    expect(parsePhone('0612345678', '+32')).toEqual({ countryCode: '+32', national: '612345678' })
  })

  it('formats national digits in pairs after the first one', () => {
    expect(formatNational('768308898')).toBe('7 68 30 88 98')
    expect(formatNational('76')).toBe('7 6')
    expect(formatNational('7911123456')).toBe('7 91 11 23 45 6')
    expect(formatNational('')).toBe('')
  })

  it('formats a stored number for display, without duplicating the country code', () => {
    expect(formatPhone('+33768308898')).toBe('+33 7 68 30 88 98')
    expect(formatPhone('+33 7 68 30 88 98')).toBe('+33 7 68 30 88 98')
    expect(formatPhone(null)).toBe('')
  })
})
