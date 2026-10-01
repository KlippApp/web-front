import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Dropdown from '../../components/Dropdown'

const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]

describe('Dropdown', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(<Dropdown options={options} value="" onChange={() => {}} placeholder="Pick one" />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('selects an option and closes', () => {
    const onChange = vi.fn()
    render(<Dropdown options={options} value="" onChange={onChange} placeholder="Pick one" />)
    fireEvent.click(screen.getByText('Pick one'))
    fireEvent.click(screen.getByText('Beta'))
    expect(onChange).toHaveBeenCalledWith('b')
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('shows the selected label', () => {
    render(<Dropdown options={options} value="a" onChange={() => {}} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
  })

  it('does not open when disabled', () => {
    render(<Dropdown options={options} value="" onChange={() => {}} placeholder="Pick one" disabled />)
    fireEvent.click(screen.getByText('Pick one'))
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })

  it('closes on outside click', () => {
    render(<Dropdown options={options} value="" onChange={() => {}} placeholder="Pick one" />)
    fireEvent.click(screen.getByText('Pick one'))
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument()
  })
})
