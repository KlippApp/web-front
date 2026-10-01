import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HowItWorks from '../../components/HowItWorks'

describe('HowItWorks', () => {
  it('renders the three steps in order', () => {
    render(<HowItWorks />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Swipe, save, contact.')
    const steps = screen.getAllByRole('listitem').map(li => li.querySelector('h3').textContent)
    expect(steps).toEqual(['1Swipe', '2Save', '3Contact'])
  })

  it('mentions the other app features', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Saved searches')).toBeInTheDocument()
    expect(screen.getByText('Post your listing')).toBeInTheDocument()
  })
})
