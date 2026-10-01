const API_URL = import.meta.env.VITE_API_URL || ''

// Bypass is active in dev/preview when no API URL is configured.
// Always disabled in test environment so mocks work normally.
export const DEV_BYPASS = !API_URL && import.meta.env.MODE !== 'test'

export const authHeaders = (token) => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` })

export class ApiError extends Error {}

export function apiErrorMessage(data, fallback) {
  if (Array.isArray(data?.detail)) return data.detail.map(e => e.msg).join(', ')
  return data?.detail || fallback
}

// Mirrors the keys in useAuth: authFetch runs outside React and must see the latest refreshed token.
const TOKEN_KEY = 'klipp_token'
const SESSION_KEYS = [TOKEN_KEY, 'klipp_agency', 'klipp_manager']

async function refreshToken() {
  const res = await fetch(`${API_URL}/auth/agency/refresh`, { method: 'POST', credentials: 'include' })
  if (!res.ok) return null
  const { access_token } = await res.json()
  localStorage.setItem(TOKEN_KEY, access_token)
  return access_token
}

export async function authFetch(path, init = {}) {
  const send = (token) => fetch(`${API_URL}${path}`, { ...init, headers: { ...authHeaders(token), ...init.headers } })
  const res = await send(localStorage.getItem(TOKEN_KEY))
  if (res.status !== 401) return res
  const token = await refreshToken().catch(() => null)
  if (token) return send(token)
  SESSION_KEYS.forEach(key => localStorage.removeItem(key))
  window.location.assign(`${import.meta.env.BASE_URL}login`)
  return res
}

export function logoutAgency() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!API_URL || !token) return
  fetch(`${API_URL}/auth/agency/logout`, { method: 'POST', credentials: 'include', headers: authHeaders(token) }).catch(() => {})
}

async function parse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(apiErrorMessage(data, ''))
  return data
}

// The agency token only carries the agency name as subject, so the profile is fetched to get display names.
export async function loginAgency(email, password) {
  const { access_token } = await parse(await fetch(`${API_URL}/auth/agency/login`, {
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams({ username: email, password }),
  }))
  const profile = await parse(await fetch(`${API_URL}/agencies/profile`, {
    headers: { Authorization: `Bearer ${access_token}` },
  }))
  return { token: access_token, agency: profile.agency_name, manager: profile.manager_name }
}

export async function registerAgency(payload) {
  await parse(await fetch(`${API_URL}/agencies/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }))
  return loginAgency(payload.email, payload.password)
}

export default API_URL
