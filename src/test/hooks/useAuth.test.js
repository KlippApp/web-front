import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useAuth } from '../../hooks/useAuth'

beforeEach(() => {
  localStorage.clear()
})

describe('useAuth', () => {
  it('starts unauthenticated when localStorage is empty', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.token).toBeNull()
    expect(result.current.agency).toBeNull()
    expect(result.current.managerName).toBeNull()
  })

  it('reads token, agency, and managerName from localStorage on init', () => {
    localStorage.setItem('klipp_token', 'test-token')
    localStorage.setItem('klipp_agency', 'Test Agency')
    localStorage.setItem('klipp_manager', 'Jean Dupont')
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.token).toBe('test-token')
    expect(result.current.agency).toBe('Test Agency')
    expect(result.current.managerName).toBe('Jean Dupont')
  })

  it('login stores token, agency, and managerName in localStorage and state', () => {
    const { result } = renderHook(() => useAuth())
    act(() => { result.current.login('my-jwt', 'My Agency', 'Jean Dupont') })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.token).toBe('my-jwt')
    expect(result.current.agency).toBe('My Agency')
    expect(result.current.managerName).toBe('Jean Dupont')
    expect(localStorage.getItem('klipp_token')).toBe('my-jwt')
    expect(localStorage.getItem('klipp_agency')).toBe('My Agency')
    expect(localStorage.getItem('klipp_manager')).toBe('Jean Dupont')
  })

  it('login falls back to agencyName when manager is not provided', () => {
    const { result } = renderHook(() => useAuth())
    act(() => { result.current.login('my-jwt', 'My Agency') })
    expect(result.current.managerName).toBe('My Agency')
    expect(localStorage.getItem('klipp_manager')).toBe('My Agency')
  })

  it('logout clears token, agency, and managerName from localStorage and state', () => {
    localStorage.setItem('klipp_token', 'my-jwt')
    localStorage.setItem('klipp_agency', 'My Agency')
    localStorage.setItem('klipp_manager', 'Jean Dupont')
    const { result } = renderHook(() => useAuth())
    act(() => { result.current.logout() })
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.token).toBeNull()
    expect(result.current.agency).toBeNull()
    expect(result.current.managerName).toBeNull()
    expect(localStorage.getItem('klipp_token')).toBeNull()
    expect(localStorage.getItem('klipp_agency')).toBeNull()
    expect(localStorage.getItem('klipp_manager')).toBeNull()
  })

  it('updateProfile updates agency and managerName in localStorage and state', () => {
    localStorage.setItem('klipp_token', 'my-jwt')
    localStorage.setItem('klipp_agency', 'Old Agency')
    localStorage.setItem('klipp_manager', 'Old Name')
    const { result } = renderHook(() => useAuth())
    act(() => { result.current.updateProfile('New Agency', 'New Name') })
    expect(result.current.agency).toBe('New Agency')
    expect(result.current.managerName).toBe('New Name')
    expect(localStorage.getItem('klipp_agency')).toBe('New Agency')
    expect(localStorage.getItem('klipp_manager')).toBe('New Name')
  })
})
