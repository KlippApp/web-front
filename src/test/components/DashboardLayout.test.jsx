import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import DashboardLayout from '../../components/DashboardLayout'

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({
    agency: 'Test Agency',
    logout: vi.fn(),
    token: 'valid-token',
    isAuthenticated: true,
  }),
}))

vi.mock('../../hooks/useTheme.js', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
}))

vi.mock('../../hooks/useCookieConsent.js', () => ({
  useCookieConsent: () => ({ consented: null }),
}))

vi.mock('../../components/LanguageToggle.jsx', () => ({
  default: () => <button aria-label="Select language">EN</button>,
}))

function renderLayout({ initialEntry = '/dashboard' } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<div>Dashboard content</div>} />
          <Route path="/dashboard/profile" element={<div>Profile content</div>} />
        </Route>
        <Route path="/" element={<div>Home page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('DashboardLayout', () => {
  it('renders sidebar navigation links', () => {
    renderLayout()
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /agency profile/i })).toBeInTheDocument()
  })

  it('renders logout button', () => {
    renderLayout()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('renders greeting with agency name', () => {
    renderLayout()
    expect(screen.getByText('Hello, Test Agency')).toBeInTheDocument()
  })

  it('marks the active nav link with aria-current', () => {
    renderLayout({ initialEntry: '/dashboard' })
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
    expect(dashboardLink).toHaveAttribute('aria-current', 'page')
  })

  it('renders outlet content', () => {
    renderLayout()
    expect(screen.getByText('Dashboard content')).toBeInTheDocument()
  })

  it('navigates to home on logout click', () => {
    renderLayout()
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('renders Klipp logo text', () => {
    renderLayout()
    expect(screen.getByText('Klipp')).toBeInTheDocument()
  })

  it('renders language toggle in header', () => {
    renderLayout()
    expect(screen.getByRole('button', { name: /select language/i })).toBeInTheDocument()
  })

  it('sidebar is open by default — no burger button visible', () => {
    renderLayout()
    expect(screen.queryByRole('button', { name: /open sidebar/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close sidebar/i })).toBeInTheDocument()
  })

  it('clicking close hides sidebar and shows burger button', () => {
    renderLayout()
    fireEvent.click(screen.getByRole('button', { name: /close sidebar/i }))
    expect(screen.getByRole('button', { name: /open sidebar/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close sidebar/i })).not.toBeInTheDocument()
  })

  it('clicking burger button reopens sidebar', () => {
    renderLayout()
    fireEvent.click(screen.getByRole('button', { name: /close sidebar/i }))
    fireEvent.click(screen.getByRole('button', { name: /open sidebar/i }))
    expect(screen.getByRole('button', { name: /close sidebar/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /open sidebar/i })).not.toBeInTheDocument()
  })
})
