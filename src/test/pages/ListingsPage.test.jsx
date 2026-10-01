import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ListingsPage from '../../pages/ListingsPage'

describe('ListingsPage without API', () => {
  it('shows the title and the empty state', () => {
    render(<ListingsPage />)
    expect(screen.getByRole('heading', { name: 'Listings' })).toBeInTheDocument()
    expect(screen.getByText(/No listings yet/)).toBeInTheDocument()
  })
})
