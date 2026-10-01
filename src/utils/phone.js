export const countries = [
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+32', flag: '🇧🇪', label: 'BE' },
  { code: '+41', flag: '🇨🇭', label: 'CH' },
  { code: '+352', flag: '🇱🇺', label: 'LU' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
]

export const DEFAULT_COUNTRY_CODE = '+33'

// E.164 allows 15 digits including the country code.
const MAX_NATIONAL_DIGITS = 12

export const nationalDigits = (value) => value.replace(/\D/g, '').replace(/^0/, '').slice(0, MAX_NATIONAL_DIGITS)

// Splits any stored number (E.164, or legacy "+33 6 12…" / "06 12…") into country code and national digits.
export function parsePhone(value, fallbackCode = DEFAULT_COUNTRY_CODE) {
  const raw = (value ?? '').trim()
  if (raw.startsWith('+')) {
    const digits = raw.replace(/\D/g, '')
    const country = countries.find(c => digits.startsWith(c.code.slice(1)))
    if (country) return { countryCode: country.code, national: nationalDigits(digits.slice(country.code.length - 1)) }
  }
  return { countryCode: fallbackCode, national: nationalDigits(raw) }
}

export const toE164 = (countryCode, national) => (national ? `${countryCode}${national}` : '')

export const normalizePhone = (value, fallbackCode) => {
  const { countryCode, national } = parsePhone(value, fallbackCode)
  return toE164(countryCode, national)
}

export const formatNational = (national) =>
  national ? [national[0], ...(national.slice(1).match(/\d{1,2}/g) ?? [])].join(' ') : ''

export function formatPhone(value) {
  if (!value) return ''
  const { countryCode, national } = parsePhone(value)
  return `${countryCode} ${formatNational(national)}`
}
