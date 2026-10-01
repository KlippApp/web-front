import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DownloadCTA from '../../components/DownloadCTA'

describe('DownloadCTA', () => {
  it('renders the call to action with the brand dot', () => {
    render(<DownloadCTA />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Your next home is one swipe away.')
    expect(screen.getByText(/tour your next homes on video/i)).toBeInTheDocument()
    expect(screen.getByText('iOS 15+ and Android 7+')).toBeInTheDocument()
  })

  it('renders the app icon and coming soon store badges', () => {
    const { container } = render(<DownloadCTA />)
    expect(container.querySelector('img[src="/favicon.svg"]')).toBeInTheDocument()
    expect(screen.getAllByText('Coming soon')).toHaveLength(2)
  })
})
