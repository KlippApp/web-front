import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DownloadCTA from '../../components/DownloadCTA'

describe('DownloadCTA', () => {
  it('renders CTA text', () => {
    render(<DownloadCTA />)
    expect(screen.getByText(/Start your search today/i)).toBeInTheDocument()
    expect(screen.getByText(/tour your next homes on video/i)).toBeInTheDocument()
  })

  it('renders store buttons', () => {
    render(<DownloadCTA />)
    expect(screen.getByAltText(/Download on the App Store/i)).toBeInTheDocument()
    expect(screen.getByAltText(/Get it on Google Play/i)).toBeInTheDocument()
  })

  it('renders the app icon', () => {
    const { container } = render(<DownloadCTA />)
    expect(container.querySelector('img[src="/favicon.svg"]')).toBeInTheDocument()
  })
})
