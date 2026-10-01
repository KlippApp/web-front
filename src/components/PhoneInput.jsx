import { useState } from 'react'
import Dropdown from './Dropdown.jsx'
import { countries, formatNational, nationalDigits, parsePhone, toE164 } from '../utils/phone.js'

export default function PhoneInput({ id, value, onChange, inputStyle, required = true, ...inputProps }) {
  const [emptyCountryCode, setEmptyCountryCode] = useState(() => parsePhone(value).countryCode)
  const parsed = parsePhone(value, emptyCountryCode)

  const changeCountry = (countryCode) => {
    setEmptyCountryCode(countryCode)
    onChange(toE164(countryCode, parsed.national))
  }

  const changeNumber = (e) => {
    const raw = e.target.value
    if (raw.trim().startsWith('+')) {
      const pasted = parsePhone(raw)
      setEmptyCountryCode(pasted.countryCode)
      onChange(toE164(pasted.countryCode, pasted.national))
      return
    }
    onChange(toE164(parsed.countryCode, nationalDigits(raw)))
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Dropdown
        options={countries.map(c => ({ value: c.code, label: `${c.flag} ${c.code}` }))}
        value={parsed.countryCode}
        onChange={changeCountry}
        style={{ width: '110px', flexShrink: 0 }}
      />
      <input
        id={id} type="tel" required={required} style={inputStyle}
        value={formatNational(parsed.national)} onChange={changeNumber} placeholder="6 12 34 56 78"
        {...inputProps}
      />
    </div>
  )
}
