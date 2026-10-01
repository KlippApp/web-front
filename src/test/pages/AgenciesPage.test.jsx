import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AgenciesPage from '../../pages/AgenciesPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <AgenciesPage />
    </MemoryRouter>
  )
}

describe('AgenciesPage', () => {
  it('renders the pitch with the brand dot and the dashboard preview', () => {
    renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your listings on video, in front of buyers in your area.')
    expect(screen.getByText('Preview of the agency portal')).toBeInTheDocument()
  })

  it('lists the four onboarding steps in order', () => {
    renderPage()
    const steps = screen.getAllByRole('list')[0].querySelectorAll('h3')
    expect([...steps].map(h => h.textContent)).toEqual([
      'Create your agency account', 'Add your offices', 'Invite your agents', 'Post on video',
    ])
  })

  it('describes the four areas of the agency portal', () => {
    renderPage()
    ;['Dashboard', 'Agents', 'Offices', 'Profile']
      .forEach(title => expect(screen.getByRole('heading', { level: 3, name: title })).toBeInTheDocument())
  })

  it('answers frequently asked questions in expandable items', () => {
    const { container } = renderPage()
    expect(container.querySelectorAll('details')).toHaveLength(4)
    fireEvent.click(screen.getByText('Do my agents need to install the app?'))
    expect(screen.getByText(/They film and post their listings from the app/)).toBeInTheDocument()
  })

  it('links to registration and login at the top and the bottom', () => {
    renderPage()
    expect(screen.getAllByRole('link', { name: 'Create an agency account' }).map(a => a.getAttribute('href'))).toEqual(['/register', '/register'])
    expect(screen.getAllByRole('link', { name: 'Sign in' }).map(a => a.getAttribute('href'))).toEqual(['/login', '/login'])
  })
})
