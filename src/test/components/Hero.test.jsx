import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../../components/Hero'

describe('Hero', () => {
  it('renders headline and subtitle', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: /Real estate, on video/i })).toBeInTheDocument()
    expect(screen.getByText(/Tour the properties around you in seconds/i)).toBeInTheDocument()
  })

  it('renders the three app facts instead of made-up stats', () => {
    render(<Hero />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('€0')).toBeInTheDocument()
    expect(screen.getByText('No account')).toBeInTheDocument()
    expect(screen.queryByText(/4.9★|50K\+/)).not.toBeInTheDocument()
  })

  it('shows store badges as coming soon', () => {
    render(<Hero />)
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
