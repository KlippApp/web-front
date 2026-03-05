import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import OfficesPage from '../../pages/OfficesPage'

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

describe('OfficesPage', () => {
  it('renders offices list with empty state by default', () => {
    render(<OfficesPage />)
    expect(screen.getByText('portal.offices.title')).toBeInTheDocument()
    expect(screen.getByText('portal.offices.list.empty')).toBeInTheDocument()
  })

  it('adds an office and displays it in the list', () => {
    render(<OfficesPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.offices.addOffice/i }))

    fireEvent.change(screen.getByLabelText('portal.offices.form.name'), { target: { value: 'Klipp Paris' } })
    fireEvent.change(screen.getByLabelText('portal.offices.form.address'), { target: { value: '123 Avenue' } })
    fireEvent.change(screen.getByLabelText('portal.offices.form.email'), { target: { value: 'paris@klipp.com' } })
    fireEvent.change(screen.getByLabelText('portal.offices.form.phone'), { target: { value: '0123456789' } })

    fireEvent.click(screen.getByRole('button', { name: /portal.offices.form.submit/i }))

    expect(screen.getByText('Klipp Paris')).toBeInTheDocument()
    expect(screen.getByText('123 Avenue')).toBeInTheDocument()
    expect(screen.getByText('paris@klipp.com')).toBeInTheDocument()
    expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument()
  })

  it('edits an existing office', () => {
    render(<OfficesPage />)
    
    // Add
    fireEvent.click(screen.getByRole('button', { name: /portal.offices.addOffice/i }))
    fireEvent.change(screen.getByLabelText('portal.offices.form.name'), { target: { value: 'Office 1' } })
    fireEvent.change(screen.getByLabelText('portal.offices.form.address'), { target: { value: 'Addr 1' } })
    fireEvent.change(screen.getByLabelText('portal.offices.form.email'), { target: { value: 'o1@o.com' } })
    fireEvent.change(screen.getByLabelText('portal.offices.form.phone'), { target: { value: '0123456789' } })
    fireEvent.click(screen.getByRole('button', { name: /portal.offices.form.submit/i }))

    // Edit
    fireEvent.click(screen.getByRole('button', { name: /portal.offices.list.edit/i }))
    fireEvent.change(screen.getByLabelText('portal.offices.form.name'), { target: { value: 'Office 2' } })
    fireEvent.click(screen.getByRole('button', { name: /portal.offices.form.submitEdit/i }))

    expect(screen.getByText('Office 2')).toBeInTheDocument()
    expect(screen.queryByText('Office 1')).not.toBeInTheDocument()
  })
})
