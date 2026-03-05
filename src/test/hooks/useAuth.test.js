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
  })

  it('reads token and agency from localStorage on init', () => {
    localStorage.setItem('klipp_token', 'test-token')
    localStorage.setItem('klipp_agency', 'Test Agency')
    const { result } = renderHook(() => useAuth())
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.token).toBe('test-token')
    expect(result.current.agency).toBe('Test Agency')
  })

  it('login stores token and agency in localStorage and state', () => {
    const { result } = renderHook(() => useAuth())
    act(() => { result.current.login('my-jwt', 'My Agency') })
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.token).toBe('my-jwt')
    expect(result.current.agency).toBe('My Agency')
    expect(localStorage.getItem('klipp_token')).toBe('my-jwt')
    expect(localStorage.getItem('klipp_agency')).toBe('My Agency')
  })

  it('logout clears token and agency from localStorage and state', () => {
    localStorage.setItem('klipp_token', 'my-jwt')
    localStorage.setItem('klipp_agency', 'My Agency')
    const { result } = renderHook(() => useAuth())
    act(() => { result.current.logout() })
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.token).toBeNull()
    expect(result.current.agency).toBeNull()
    expect(localStorage.getItem('klipp_token')).toBeNull()
    expect(localStorage.getItem('klipp_agency')).toBeNull()
  })
})
