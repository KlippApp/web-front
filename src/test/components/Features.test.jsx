import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Features from '../../components/Features'

describe('Features', () => {
  it('renders section header', () => {
    render(<Features />)
    expect(screen.getByText(/Everything you need to find your next home/i)).toBeInTheDocument()
  })

  it('renders the six real app features', () => {
    render(<Features />)
    ;['Video tours', 'Around you', 'Direct contact', 'Favorites and collections', 'Saved searches', 'Post your listing']
      .forEach(title => expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument())
  })
})
