const API_URL = import.meta.env.VITE_API_URL || ''

// Bypass is active in dev/preview when no API URL is configured.
// Always disabled in test environment so mocks work normally.
export const DEV_BYPASS = !API_URL && import.meta.env.MODE !== 'test'

export class ApiError extends Error {}

export function apiErrorMessage(data, fallback) {
  if (Array.isArray(data?.detail)) return data.detail.map(e => e.msg).join(', ')
  return data?.detail || fallback
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
