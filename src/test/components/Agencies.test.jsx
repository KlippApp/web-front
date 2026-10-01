import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Agencies from '../../components/Agencies'

function renderAgencies() {
  return render(
    <MemoryRouter>
      <Agencies />
    </MemoryRouter>
  )
}

describe('Agencies', () => {
  it('renders the section and its three points', () => {
    renderAgencies()
    expect(screen.getByRole('heading', { level: 2, name: 'Are you an agency?' })).toBeInTheDocument()
    ;['Your agents and offices', 'Video listings', 'Your statistics']
      .forEach(title => expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument())
  })

  it('links to agency registration and login', () => {
    renderAgencies()
    expect(screen.getByRole('link', { name: 'Create an agency account' })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
  })

  it('shows a labelled preview of the agency portal', () => {
    renderAgencies()
    expect(screen.getByText('Preview of the agency portal')).toBeInTheDocument()
    expect(screen.getByText('Likes received in the last 30 days')).toBeInTheDocument()
  })
})
