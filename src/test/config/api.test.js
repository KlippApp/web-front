import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiError, apiErrorMessage, loginAgency, registerAgency } from '../../config/api.js'

const ok = (data) => ({ ok: true, json: async () => data })
const fail = (data) => ({ ok: false, json: async () => data })

beforeEach(() => {
  vi.restoreAllMocks()
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
