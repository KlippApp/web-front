import { useState } from 'react'

const TOKEN_KEY = 'klipp_token'
const AGENCY_KEY = 'klipp_agency'
const MANAGER_KEY = 'klipp_manager'

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [agency, setAgency] = useState(() => localStorage.getItem(AGENCY_KEY))
  const [managerName, setManagerName] = useState(() => localStorage.getItem(MANAGER_KEY))

  const login = (newToken, agencyName, manager) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(AGENCY_KEY, agencyName)
    localStorage.setItem(MANAGER_KEY, manager ?? agencyName)
    setToken(newToken)
    setAgency(agencyName)
    setManagerName(manager ?? agencyName)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(AGENCY_KEY)
    localStorage.removeItem(MANAGER_KEY)
    setToken(null)
    setAgency(null)
    setManagerName(null)
  }

  const updateProfile = (agencyName, manager) => {
    localStorage.setItem(AGENCY_KEY, agencyName)
    localStorage.setItem(MANAGER_KEY, manager)
    setAgency(agencyName)
    setManagerName(manager)
  }

  return {
    token,
    agency,
    managerName,
    isAuthenticated: !!token,
    login,
    logout,
    updateProfile,
  }
}
