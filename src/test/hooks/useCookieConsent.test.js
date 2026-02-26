import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCookieConsent } from '../../hooks/useCookieConsent'

const COOKIE = 'cookie_consent'

beforeEach(() => {
  document.cookie = `${COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
})

describe('useCookieConsent', () => {
  it('returns null when no consent cookie is set', () => {
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.consented).toBeNull()
  })

  it('reads accepted state from existing cookie', () => {
    document.cookie = `${COOKIE}=accepted; path=/`
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.consented).toBe('accepted')
  })

  it('reads declined state from existing cookie', () => {
    document.cookie = `${COOKIE}=declined; path=/`
    const { result } = renderHook(() => useCookieConsent())
    expect(result.current.consented).toBe('declined')
  })

  it('accept() sets consented to "accepted"', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => { result.current.accept() })
    expect(result.current.consented).toBe('accepted')
  })

  it('accept() writes cookie_consent=accepted cookie', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => { result.current.accept() })
    expect(document.cookie).toContain(`${COOKIE}=accepted`)
  })

  it('decline() sets consented to "declined"', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => { result.current.decline() })
    expect(result.current.consented).toBe('declined')
  })

  it('decline() does NOT write cookie_consent cookie', () => {
    const { result } = renderHook(() => useCookieConsent())
    act(() => { result.current.decline() })
    expect(document.cookie).not.toContain(`${COOKIE}=declined`)
  })
})
