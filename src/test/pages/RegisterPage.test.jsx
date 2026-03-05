import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import RegisterPage from '../../pages/RegisterPage'

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )
}

function fillForm(overrides = {}) {
  const defaults = {
    agencyName: 'Test Agency',
    managerName: 'Jean Dupont',
    email: 'test@agency.com',
    password: 'password123',
    confirmPassword: 'password123',
    phone: '+33600000000',
    streetNumber: '12',
    street: 'Rue de la Paix',
    postalCode: '75001',
    city: 'Paris',
  }
  const values = { ...defaults, ...overrides }

  fireEvent.change(screen.getByLabelText('Agency name'), { target: { value: values.agencyName } })
  fireEvent.change(screen.getByLabelText('Manager name'), { target: { value: values.managerName } })
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: values.email } })
  // password fields — select by id to avoid ambiguity between Password and Confirm password
  fireEvent.change(document.getElementById('reg-password'), { target: { value: values.password } })
  fireEvent.change(document.getElementById('reg-confirmPassword'), { target: { value: values.confirmPassword } })
  fireEvent.change(screen.getByLabelText('Phone'), { target: { value: values.phone } })
  fireEvent.change(screen.getByLabelText('No.'), { target: { value: values.streetNumber } })
  fireEvent.change(screen.getByLabelText('Street'), { target: { value: values.street } })
  fireEvent.change(screen.getByLabelText('Postal code'), { target: { value: values.postalCode } })
  fireEvent.change(screen.getByLabelText('City'), { target: { value: values.city } })
}

describe('RegisterPage', () => {
  it('renders the registration form', () => {
    renderRegister()
    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Agency name')).toBeInTheDocument()
    expect(screen.getByLabelText('Manager name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders a link to login', () => {
    renderRegister()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('navigates to login when link is clicked', () => {
    renderRegister()
    fireEvent.click(screen.getByText('Sign in'))
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    renderRegister()
    fillForm({ confirmPassword: 'different' })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText('Passwords do not match.')).toBeInTheDocument())
  })

  it('shows generic error on API failure', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email already in use' }),
    })
    renderRegister()
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText('Email already in use')).toBeInTheDocument())
  })

  it('navigates to dashboard on successful registration', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'reg-token', agencyName: 'Test Agency', managerName: 'Jean Dupont' }),
    })
    renderRegister()
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => expect(screen.getByText('Dashboard')).toBeInTheDocument())
    expect(localStorage.getItem('klipp_token')).toBe('reg-token')
    expect(localStorage.getItem('klipp_manager')).toBe('Jean Dupont')
  })
})
