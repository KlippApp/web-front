import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StoreButton from '../../components/StoreButton'

describe('StoreButton', () => {
  it('renders apple store button correctly', () => {
    render(<StoreButton store="apple" href="https://apple.com" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://apple.com')
    expect(screen.getByAltText(/App Store/i)).toBeInTheDocument()
  })

  it('renders google play button correctly', () => {
    render(<StoreButton store="google" href="https://google.com" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://google.com')
    expect(screen.getByAltText(/Google Play/i)).toBeInTheDocument()
  })

  it('shows a coming soon badge without a link when no href is given', () => {
    render(<StoreButton store="apple" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.getByAltText(/App Store/i)).toBeInTheDocument()
  })
})
