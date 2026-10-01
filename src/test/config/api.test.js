import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ApiError, apiErrorMessage, authFetch, loginAgency, registerAgency } from '../../config/api.js'

const ok = (data) => ({ ok: true, json: async () => data })
const fail = (data) => ({ ok: false, json: async () => data })

beforeEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('apiErrorMessage', () => {
  it('joins Pydantic validation errors', () => {
    expect(apiErrorMessage({ detail: [{ msg: 'too short' }, { msg: 'invalid email' }] }, 'x')).toBe('too short, invalid email')
  })

  it('returns a string detail', () => {
    expect(apiErrorMessage({ detail: 'Agency not found' }, 'x')).toBe('Agency not found')
  })

  it('falls back when there is no detail', () => {
    expect(apiErrorMessage({}, 'fallback')).toBe('fallback')
  })
})

describe('loginAgency', () => {
  it('posts form-encoded credentials to the agency login, then reads the profile', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(ok({ access_token: 'tok', token_type: 'bearer' }))
      .mockResolvedValueOnce(ok({ agency_name: 'Agence Dupont', manager_name: 'Jean Dupont' }))

    const session = await loginAgency('a@b.fr', 'secret123')

    expect(session).toEqual({ token: 'tok', agency: 'Agence Dupont', manager: 'Jean Dupont' })
    const [loginUrl, loginInit] = fetch.mock.calls[0]
    expect(loginUrl).toBe('/auth/agency/login')
    expect(loginInit.body.toString()).toBe('username=a%40b.fr&password=secret123')
    expect(loginInit.credentials).toBe('include')
    const [profileUrl, profileInit] = fetch.mock.calls[1]
    expect(profileUrl).toBe('/agencies/profile')
    expect(profileInit.headers.Authorization).toBe('Bearer tok')
  })

  it('throws an ApiError with the backend message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce(fail({ detail: 'Wrong email or password.' }))
    await expect(loginAgency('a@b.fr', 'bad')).rejects.toThrow(new ApiError('Wrong email or password.'))
  })
})

describe('registerAgency', () => {
  it('registers then logs in', async () => {
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce(ok({ agency_name: 'Agence Dupont' }))
      .mockResolvedValueOnce(ok({ access_token: 'tok', token_type: 'bearer' }))
      .mockResolvedValueOnce(ok({ agency_name: 'Agence Dupont', manager_name: 'Jean Dupont' }))

    const session = await registerAgency({ agency_name: 'Agence Dupont', email: 'a@b.fr', password: 'secret123' })

    expect(fetch.mock.calls[0][0]).toBe('/agencies/register')
    expect(JSON.parse(fetch.mock.calls[0][1].body).agency_name).toBe('Agence Dupont')
    expect(session.token).toBe('tok')
  })

  it('does not log in when registration fails', async () => {
    globalThis.fetch = vi.fn().mockResolvedValueOnce(fail({ detail: 'Email is already registered' }))
    await expect(registerAgency({ email: 'a@b.fr', password: 'x' })).rejects.toThrow('Email is already registered')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('authFetch', () => {
  it('sends the stored token', async () => {
    localStorage.setItem('klipp_token', 'tok')
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ status: 200 })

    await authFetch('/offices', { method: 'DELETE' })

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('/offices')
    expect(init.method).toBe('DELETE')
    expect(init.headers.Authorization).toBe('Bearer tok')
  })

  it('refreshes the token on 401 and retries once', async () => {
    localStorage.setItem('klipp_token', 'expired')
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce(ok({ access_token: 'fresh' }))
      .mockResolvedValueOnce({ status: 200 })

    const res = await authFetch('/offices')

    expect(res.status).toBe(200)
    expect(fetch.mock.calls[1]).toEqual(['/auth/agency/refresh', { method: 'POST', credentials: 'include' }])
    expect(fetch.mock.calls[2][1].headers.Authorization).toBe('Bearer fresh')
    expect(localStorage.getItem('klipp_token')).toBe('fresh')
  })

  it('returns the retried response even if it is still a 401', async () => {
    localStorage.setItem('klipp_token', 'tok')
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce(ok({ access_token: 'fresh' }))
      .mockResolvedValueOnce({ status: 401, json: async () => ({ detail: 'Current password is incorrect.' }) })

    const res = await authFetch('/auth/agency/change-password', { method: 'POST' })

    expect(res.status).toBe(401)
    expect(localStorage.getItem('klipp_token')).toBe('fresh')
  })

  it('clears the session when the refresh fails', async () => {
    localStorage.setItem('klipp_token', 'expired')
    localStorage.setItem('klipp_agency', 'Agence')
    localStorage.setItem('klipp_manager', 'Jean')
    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({ status: 401 })
      .mockResolvedValueOnce({ ok: false, status: 401 })
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const res = await authFetch('/offices')

    expect(res.status).toBe(401)
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(localStorage.getItem('klipp_token')).toBeNull()
    expect(localStorage.getItem('klipp_agency')).toBeNull()
    expect(localStorage.getItem('klipp_manager')).toBeNull()
  })
})

describe('logoutAgency', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('revokes the session on the backend with the refresh cookie', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api')
    vi.resetModules()
    const { logoutAgency } = await import('../../config/api.js')
    localStorage.setItem('klipp_token', 'tok')
    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true })

    logoutAgency()

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('http://api/auth/agency/logout')
    expect(init).toMatchObject({ method: 'POST', credentials: 'include' })
    expect(init.headers.Authorization).toBe('Bearer tok')
  })

  it('does nothing without a token', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api')
    vi.resetModules()
    const { logoutAgency } = await import('../../config/api.js')
    globalThis.fetch = vi.fn()

    logoutAgency()

    expect(fetch).not.toHaveBeenCalled()
  })
})
