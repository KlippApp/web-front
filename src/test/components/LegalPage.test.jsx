import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LegalPage from '../../components/LegalPage'

beforeEach(() => {
  vi.restoreAllMocks()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

function renderLegal(entry = '/privacy', props = { doc: 'privacy', sections: ['controller', 'cookies'] }) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/" element={<div>Home page</div>} />
        <Route path="/privacy" element={<LegalPage {...props} />} />
        <Route path="/terms" element={<div>Terms page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('LegalPage', () => {
  it('renders the document title, intro and requested sections', () => {
    renderLegal()
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    expect(screen.getByText(/This policy explains what personal data/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '1. Data controller' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '6. Cookies and local storage' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '7. Your rights' })).not.toBeInTheDocument()
  })

  it('gives each section an anchor id', () => {
    const { container } = renderLegal()
    expect(container.querySelector('section#cookies')).toBeInTheDocument()
  })

  it('renders the last updated line', () => {
    renderLegal()
    expect(screen.getByText(/Last updated/)).toBeInTheDocument()
  })

  it('scrolls to top when there is no hash', () => {
    renderLegal()
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('scrolls to the section matching the hash', () => {
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView
    renderLegal('/privacy#cookies')
    expect(scrollIntoView).toHaveBeenCalled()
    expect(window.scrollTo).not.toHaveBeenCalled()
    delete Element.prototype.scrollIntoView
  })

  it('navigates back to home', () => {
    renderLegal()
    fireEvent.click(screen.getByText('Back to home'))
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('links to the related legal document', () => {
    renderLegal()
    fireEvent.click(screen.getByRole('link', { name: 'Terms of Service' }))
    expect(screen.getByText('Terms page')).toBeInTheDocument()
  })
})
