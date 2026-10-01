import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import NotFoundPage from '../../pages/NotFoundPage'

function renderNotFound() {
  return render(
    <MemoryRouter initialEntries={['/en/nope']}>
      <Routes>
        <Route path="/en" element={<div>Home page</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('NotFoundPage', () => {
  it('explains the page does not exist', () => {
    renderNotFound()
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })

  it('links back to the home page', () => {
    renderNotFound()
    fireEvent.click(screen.getByRole('link', { name: 'Back to home' }))
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })
})
