import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import PrivacyPage from '../../pages/PrivacyPage'

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

describe('PrivacyPage', () => {
  it('renders every privacy policy section', () => {
    render(<MemoryRouter><PrivacyPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(9)
    expect(screen.getByRole('heading', { name: '7. Your rights' })).toBeInTheDocument()
  })
})
