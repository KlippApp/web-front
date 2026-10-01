import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../../components/Hero'

describe('Hero', () => {
  it('renders the slogan with the brand dot and the subtitle', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Real estate, on video.')
    expect(screen.getByText(/Tour the properties around you in seconds/i)).toBeInTheDocument()
    expect(screen.getByText('Free, and no account needed to browse.')).toBeInTheDocument()
  })

  it('shows the listing feed preview and coming soon store badges', () => {
    render(<Hero />)
    expect(screen.getByRole('img', { name: 'Preview of the Klipp listing feed' })).toBeInTheDocument()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
