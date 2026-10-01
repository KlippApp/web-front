import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoginPage from '../../pages/LoginPage'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<div>Register page</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  it('renders the login form', () => {
    renderLogin()
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders a link to register', () => {
    renderLogin()
    expect(screen.getByText('Create one')).toBeInTheDocument()
  })

  it('navigates to register when link is clicked', () => {
    renderLogin()
    fireEvent.click(screen.getByText('Create one'))
    expect(screen.getByText('Register page')).toBeInTheDocument()
  })

  it('navigates to dashboard and stores token on successful login', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'api-token', token_type: 'bearer' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ agency_name: 'Test Agency', manager_name: 'Jean Dupont' }) })
    renderLogin()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'hugo@agency.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pw' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument())
    expect(localStorage.getItem('klipp_token')).toBe('api-token')
    expect(localStorage.getItem('klipp_agency')).toBe('Test Agency')
    expect(localStorage.getItem('klipp_manager')).toBe('Jean Dupont')
  })

  it('shows the API error message on failed login', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Wrong email or password.' }),
    })
    renderLogin()
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'hugo@agency.com' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'bad' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByText('Wrong email or password.')).toBeInTheDocument())
    expect(localStorage.getItem('klipp_token')).toBeNull()
  })
})
