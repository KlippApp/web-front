import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../../components/Navbar'

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText(/Klipp/i)).toBeInTheDocument()
    expect(screen.getByText(/Features/i)).toBeInTheDocument()
    expect(screen.getByText(/Screenshots/i)).toBeInTheDocument()
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Espace Client/i).length).toBeGreaterThan(0)
  })

  it('toggles mobile menu when hamburger is clicked', () => {
    render(<Navbar />)
    const toggleButton = screen.getByLabelText(/Toggle menu/i)
    
    // Initial state: menu closed (links only in desktop nav which is hidden by CSS, but testing-library sees them)
    // We check for the presence of multiple links (desktop + potential mobile)
    fireEvent.click(toggleButton)
    
    // Now mobile menu should be open
    const mobileLinks = screen.getAllByText(/Features/i)
    expect(mobileLinks.length).toBeGreaterThan(1)
  })
})
