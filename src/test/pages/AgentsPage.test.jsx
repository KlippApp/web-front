import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AgentsPage from '../../pages/AgentsPage'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}))

describe('AgentsPage', () => {
  it('renders agents list with empty state by default', () => {
    render(<AgentsPage />)
    expect(screen.getByText('portal.agents.title')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.list.empty')).toBeInTheDocument()
  })

  it('opens modal when clicking add button', () => {
    render(<AgentsPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.addAgent/i }))

    expect(screen.getByText('portal.agents.form.firstName')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.lastName')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.email')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.phone')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.office')).toBeInTheDocument()
  })

  it('submit button is disabled until a physical office is selected', () => {
    render(<AgentsPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.addAgent/i }))

    fireEvent.change(screen.getByLabelText('portal.agents.form.firstName'), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText('portal.agents.form.lastName'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText('portal.agents.form.email'), { target: { value: 'john.doe@example.com' } })
    fireEvent.change(screen.getByLabelText('portal.agents.form.phone'), { target: { value: '0612345678' } })

    const submitButton = screen.getByRole('button', { name: /portal.agents.form.submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('closes modal when clicking cancel', () => {
    render(<AgentsPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.addAgent/i }))

    expect(screen.getByText('portal.agents.form.firstName')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /portal.agents.form.cancel/i }))

    expect(screen.queryByText('portal.agents.form.firstName')).not.toBeInTheDocument()
  })
})
