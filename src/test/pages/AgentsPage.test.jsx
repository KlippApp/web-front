import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import AgentsPage from '../../pages/AgentsPage'

// Mock i18next
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
    const addButton = screen.getByRole('button', { name: /portal.agents.addAgent/i })
    fireEvent.click(addButton)
    
    // Check if form fields are visible
    expect(screen.getByText('portal.agents.form.firstName')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.lastName')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.email')).toBeInTheDocument()
    expect(screen.getByText('portal.agents.form.phone')).toBeInTheDocument()
  })

  it('adds an agent and displays it in the list', () => {
    render(<AgentsPage />)
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.addAgent/i }))

    // Fill the form - using queryByLabelText or similar if labels were properly linked with htmlFor, 
    // but here we use display text of labels so let's find inputs by their position or placeholder if any.
    // In our implementation, we didn't use placeholders for all, let's use display value or order.
    const firstNameInput = screen.getByLabelText('portal.agents.form.firstName')
    const lastNameInput = screen.getByLabelText('portal.agents.form.lastName')
    const emailInput = screen.getByLabelText('portal.agents.form.email')
    const phoneInput = screen.getByLabelText('portal.agents.form.phone')

    fireEvent.change(firstNameInput, { target: { value: 'John' } })
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(phoneInput, { target: { value: '0123456789' } })

    fireEvent.click(screen.getByRole('button', { name: /portal.agents.form.submit/i }))

    // Modal should close and agent should be in the list
    expect(screen.queryByText('portal.agents.form.submit')).not.toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument()
    expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument()
  })

  it('edits an existing agent', () => {
    render(<AgentsPage />)
    
    // Add an agent first
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.addAgent/i }))
    fireEvent.change(screen.getByLabelText('portal.agents.form.firstName'), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText('portal.agents.form.lastName'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText('portal.agents.form.email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('portal.agents.form.phone'), { target: { value: '0123456789' } })
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.form.submit/i }))

    // Click edit
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.list.edit/i }))

    // Check if modal has edit title
    expect(screen.getByText('portal.agents.editAgent')).toBeInTheDocument()

    // Modify firstName
    fireEvent.change(screen.getByLabelText('portal.agents.form.firstName'), { target: { value: 'Jane' } })
    fireEvent.click(screen.getByRole('button', { name: /portal.agents.form.submitEdit/i }))

    // Check if updated in list
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
    expect(screen.getByText('+33 1 23 45 67 89')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })
})
