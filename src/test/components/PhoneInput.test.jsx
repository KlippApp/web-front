import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import PhoneInput from '../../components/PhoneInput'

function Controlled({ initial = '', onValue = () => {} }) {
  const [value, setValue] = useState(initial)
  return (
    <>
      <label htmlFor="phone">Phone</label>
      <PhoneInput id="phone" value={value} onChange={v => { setValue(v); onValue(v) }} />
    </>
  )
}

describe('PhoneInput', () => {
  it('formats the typed number and emits it in E.164', () => {
    const onValue = vi.fn()
    render(<Controlled onValue={onValue} />)
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '0768308898' } })
    expect(screen.getByLabelText('Phone')).toHaveValue('7 68 30 88 98')
    expect(onValue).toHaveBeenLastCalledWith('+33768308898')
  })

  it('shows an existing number split into country and national part', () => {
    render(<Controlled initial="+32612345678" />)
    expect(screen.getByLabelText('Phone')).toHaveValue('6 12 34 56 78')
    expect(screen.getByText('🇧🇪 +32')).toBeInTheDocument()
  })

  it('changes the country code', () => {
    const onValue = vi.fn()
    render(<Controlled initial="+33768308898" onValue={onValue} />)
    fireEvent.click(screen.getByText('🇫🇷 +33'))
    fireEvent.click(screen.getByText('🇨🇭 +41'))
    expect(onValue).toHaveBeenLastCalledWith('+41768308898')
  })

  it('keeps the chosen country while the number is empty', () => {
    const onValue = vi.fn()
    render(<Controlled onValue={onValue} />)
    fireEvent.click(screen.getByText('🇫🇷 +33'))
    fireEvent.click(screen.getByText('🇬🇧 +44'))
    expect(onValue).toHaveBeenLastCalledWith('')
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '7911123456' } })
    expect(onValue).toHaveBeenLastCalledWith('+447911123456')
  })

  it('accepts a pasted international number', () => {
    const onValue = vi.fn()
    render(<Controlled onValue={onValue} />)
    fireEvent.change(screen.getByLabelText('Phone'), { target: { value: '+32 6 12 34 56 78' } })
    expect(onValue).toHaveBeenLastCalledWith('+32612345678')
    expect(screen.getByText('🇧🇪 +32')).toBeInTheDocument()
  })
})
