import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Footer from '../../components/Footer'

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  )
}

describe('Footer', () => {
  it('renders brand and description', () => {
    renderFooter()
    const brandElements = screen.getAllByText(/Klipp/i)
    expect(brandElements.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/Find your perfect home with AI-powered search/i)).toBeInTheDocument()
  })

  it('renders link sections', () => {
    renderFooter()
    expect(screen.getByText(/Product/i)).toBeInTheDocument()
    expect(screen.getByText(/Company/i)).toBeInTheDocument()
    expect(screen.getByText(/Legal/i)).toBeInTheDocument()
  })

  it('renders copyright with current year', () => {
    renderFooter()
    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })

  it('links legal entries to the legal pages', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/en/privacy')
    expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/en/terms')
    expect(screen.getByRole('link', { name: 'Cookie Policy' })).toHaveAttribute('href', '/en/privacy#cookies')
  })
})
