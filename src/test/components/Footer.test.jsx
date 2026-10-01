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
    expect(screen.getByText(/Homes for sale and rent, around you/i)).toBeInTheDocument()
  })

  it('links to the how it works section', () => {
    renderFooter()
    expect(screen.getByRole('link', { name: 'How it works' })).toHaveAttribute('href', '/en#how')
    expect(screen.getByRole('link', { name: 'Agencies' })).toHaveAttribute('href', '/en/agences')
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
    expect(screen.getByRole('link', { name: 'Cookies' })).toHaveAttribute('href', '/en/privacy#cookies')
  })

  it('links the agency portal and has no placeholder links', () => {
    const { container } = renderFooter()
    expect(screen.getByRole('link', { name: 'Agency portal' })).toHaveAttribute('href', '/login')
    expect(container.querySelector('a[href="#"]')).toBeNull()
  })
})
