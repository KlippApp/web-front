import { useState } from 'react'

const TOKEN_KEY = 'klipp_token'
const AGENCY_KEY = 'klipp_agency'

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [agency, setAgency] = useState(() => localStorage.getItem(AGENCY_KEY))

  const login = (newToken, agencyName) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(AGENCY_KEY, agencyName)
    setToken(newToken)
    setAgency(agencyName)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(AGENCY_KEY)
    setToken(null)
    setAgency(null)
  }

  return {
    token,
    agency,
    isAuthenticated: !!token,
    login,
    logout,
  }
}
