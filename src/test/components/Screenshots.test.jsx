import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Screenshots from '../../components/Screenshots'

describe('Screenshots', () => {
  it('renders section header', () => {
    render(<Screenshots />)
    expect(screen.getByText(/Designed for your pocket/i)).toBeInTheDocument()
  })

  it('renders phone mockups with screenshots', () => {
    render(<Screenshots />)
    expect(screen.getByAltText(/Klipp home screen/i)).toBeInTheDocument()
    // Other phones might be hidden on mobile in real DOM but present in JSDOM
    expect(screen.getByAltText(/Klipp search screen/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Klipp property detail screen/i)).toBeInTheDocument()
  })
})
