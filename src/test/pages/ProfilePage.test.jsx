import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ProfilePage from '../../pages/ProfilePage'

function renderProfilePage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>
  )
}

describe('ProfilePage', () => {
  it('renders page title', () => {
    renderProfilePage()
    expect(screen.getByText('Agency profile')).toBeInTheDocument()
  })

  it('renders coming soon message', () => {
    renderProfilePage()
    expect(screen.getByText('This section is under development.')).toBeInTheDocument()
  })
})
