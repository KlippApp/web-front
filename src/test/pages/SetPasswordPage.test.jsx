import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SetPasswordPage from '../../pages/SetPasswordPage'

vi.mock('../../config/api.js', async () => ({
  ...(await vi.importActual('../../config/api.js')),
  default: 'http://api',
  DEV_BYPASS: false,
}))

const ok = (data) => ({ ok: true, json: async () => data })

function renderWithToken(token) {
  window.history.pushState({}, '', token ? `/set-password?token=${token}` : '/set-password')
  return render(<SetPasswordPage />)
}

function submit(password, confirm = password) {
  fireEvent.change(document.getElementById('set-password'), { target: { value: password } })
  fireEvent.change(document.getElementById('set-password-confirm'), { target: { value: confirm } })
  fireEvent.click(screen.getByRole('button', { name: 'Create password' }))
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('SetPasswordPage', () => {
  it('shows the invalid state without a token', () => {
    globalThis.fetch = vi.fn()
    renderWithToken('')
    expect(screen.getByText('Invalid or expired link')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('shows the invalid state when the backend rejects the token', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'Invitation token has expired' }) })
    renderWithToken('expired')
    await waitFor(() => expect(screen.getByText('Invalid or expired link')).toBeInTheDocument())
    expect(fetch).toHaveBeenCalledWith('http://api/agents/invitation/verify?token=expired')
  })

  it('sets the password for a valid invitation', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(ok({ valid: true, name: 'John Doe', email: 'john@doe.fr' }))
      .mockResolvedValueOnce(ok({ message: 'Password set successfully' }))
    renderWithToken('abc')
    await waitFor(() => expect(screen.getByText('Create your password')).toBeInTheDocument())

    submit('secret123')

    await waitFor(() => expect(screen.getByText('Password created!')).toBeInTheDocument())
    const [url, init] = fetch.mock.calls[1]
    expect(url).toBe('http://api/agents/invitation/set-password')
    expect(JSON.parse(init.body)).toEqual({ token: 'abc', password: 'secret123' })
  })

  it('shows a mismatch error without calling the API', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce(ok({ valid: true, name: 'John Doe', email: 'john@doe.fr' }))
    renderWithToken('abc')
    await waitFor(() => expect(screen.getByText('Create your password')).toBeInTheDocument())

    submit('secret123', 'other123')

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('renders Pydantic validation errors as text', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(ok({ valid: true, name: 'John Doe', email: 'john@doe.fr' }))
      .mockResolvedValueOnce({ ok: false, json: async () => ({ detail: [{ msg: 'String should have at least 8 characters' }] }) })
    renderWithToken('abc')
    await waitFor(() => expect(screen.getByText('Create your password')).toBeInTheDocument())

    submit('short')

    await waitFor(() => expect(screen.getByText('String should have at least 8 characters')).toBeInTheDocument())
  })

  it('lets an existing account accept a link invitation without touching its password', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(ok({ valid: true, name: 'App User', email: 'app@user.fr', link: true, agency_name: 'Agence Test' }))
      .mockResolvedValueOnce(ok({ message: 'Invitation accepted' }))
    renderWithToken('link')
    await waitFor(() => expect(screen.getByText('Join {{agency}}')).toBeInTheDocument())
    expect(document.getElementById('set-password')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Accept and become an agent' }))

    await waitFor(() => expect(screen.getByText('You are now an agent!')).toBeInTheDocument())
    const [url, init] = fetch.mock.calls[1]
    expect(url).toBe('http://api/agents/invitation/accept')
    expect(JSON.parse(init.body)).toEqual({ token: 'link' })
  })

  it('shows the backend error when accepting fails', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(ok({ valid: true, name: 'App User', email: 'app@user.fr', link: true, agency_name: 'Agence Test' }))
      .mockResolvedValueOnce({ ok: false, json: async () => ({ detail: 'The office of this invitation no longer exists' }) })
    renderWithToken('link')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Accept and become an agent' })).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: 'Accept and become an agent' }))

    await waitFor(() => expect(screen.getByText('The office of this invitation no longer exists')).toBeInTheDocument())
  })
})
