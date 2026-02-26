import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ThemeToggle from '../../components/ThemeToggle'

describe('ThemeToggle', () => {
  it('renders a button with aria-label "Switch to dark mode" when theme is light', () => {
    render(<ThemeToggle theme="light" toggleTheme={() => {}} />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })

  it('renders a button with aria-label "Switch to light mode" when theme is dark', () => {
    render(<ThemeToggle theme="dark" toggleTheme={() => {}} />)
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })

  it('calls toggleTheme when clicked', () => {
    const toggleTheme = vi.fn()
    render(<ThemeToggle theme="light" toggleTheme={toggleTheme} />)
    fireEvent.click(screen.getByRole('button'))
    expect(toggleTheme).toHaveBeenCalledOnce()
  })

  it('updates aria-label when theme prop changes', () => {
    const { rerender } = render(<ThemeToggle theme="light" toggleTheme={() => {}} />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()

    rerender(<ThemeToggle theme="dark" toggleTheme={() => {}} />)
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })
})
