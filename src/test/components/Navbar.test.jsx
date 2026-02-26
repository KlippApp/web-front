import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../../components/Navbar'

function renderNavbar(props = {}) {
  return render(<Navbar theme="light" toggleTheme={vi.fn()} {...props} />)
}

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    renderNavbar()
    expect(screen.getByText(/Klipp/i)).toBeInTheDocument()
    expect(screen.getByText(/Features/i)).toBeInTheDocument()
    expect(screen.getByText(/Screenshots/i)).toBeInTheDocument()
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Espace Client/i).length).toBeGreaterThan(0)
  })

  it('toggles mobile menu when hamburger is clicked', () => {
    renderNavbar()
    const toggleButton = screen.getByLabelText(/Toggle menu/i)

    fireEvent.click(toggleButton)

    // Mobile menu opens: Features link now appears twice (desktop nav + mobile menu)
    const mobileLinks = screen.getAllByText(/Features/i)
    expect(mobileLinks.length).toBeGreaterThan(1)
  })

  it('renders the ThemeToggle button', () => {
    renderNavbar()
    expect(screen.getAllByRole('button', { name: /switch to dark mode/i }).length).toBeGreaterThan(0)
  })

  it('renders ThemeToggle with Sun icon when theme is dark', () => {
    renderNavbar({ theme: 'dark' })
    expect(screen.getAllByRole('button', { name: /switch to light mode/i }).length).toBeGreaterThan(0)
  })

  it('calls toggleTheme when ThemeToggle is clicked', () => {
    const toggleTheme = vi.fn()
    renderNavbar({ toggleTheme })
    const [firstToggle] = screen.getAllByRole('button', { name: /switch to dark mode/i })
    fireEvent.click(firstToggle)
    expect(toggleTheme).toHaveBeenCalledOnce()
  })

  it('shows ThemeToggle inside mobile menu when it is open', () => {
    renderNavbar()
    // Before opening: only desktop ThemeToggle
    expect(screen.getAllByRole('button', { name: /switch to dark mode/i })).toHaveLength(1)

    fireEvent.click(screen.getByLabelText(/Toggle menu/i))

    // After opening: desktop + mobile ThemeToggle
    expect(screen.getAllByRole('button', { name: /switch to dark mode/i })).toHaveLength(2)
  })
})
