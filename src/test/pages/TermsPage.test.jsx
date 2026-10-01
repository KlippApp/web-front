import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import TermsPage from '../../pages/TermsPage'

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

describe('TermsPage', () => {
  it('renders every terms of service section', () => {
    render(<MemoryRouter><TermsPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(10)
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/en/privacy')
  })
})
