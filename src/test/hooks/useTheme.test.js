import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '../../hooks/useTheme'

beforeEach(() => {
  document.cookie = 'theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  document.documentElement.removeAttribute('data-theme')
})

describe('useTheme — sans consentement', () => {
  it('defaults to light', () => {
    const { result } = renderHook(() => useTheme(null))
    expect(result.current.theme).toBe('light')
  })

  it('ignores existing theme cookie when not consented', () => {
    document.cookie = 'theme=dark; path=/'
    const { result } = renderHook(() => useTheme(null))
    expect(result.current.theme).toBe('light')
  })

  it('sets data-theme attribute even without consent', () => {
    renderHook(() => useTheme(null))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggleTheme changes the theme in memory', () => {
    const { result } = renderHook(() => useTheme(null))
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('does not write cookie when not consented', () => {
    const { result } = renderHook(() => useTheme(null))
    act(() => { result.current.toggleTheme() })
    expect(document.cookie).not.toContain('theme=')
  })
})

describe('useTheme — avec consentement accepté', () => {
  it('reads theme from cookie when consented', () => {
    document.cookie = 'theme=dark; path=/'
    const { result } = renderHook(() => useTheme('accepted'))
    expect(result.current.theme).toBe('dark')
  })

  it('defaults to light when consented but no cookie', () => {
    const { result } = renderHook(() => useTheme('accepted'))
    expect(result.current.theme).toBe('light')
  })

  it('sets data-theme attribute after mount', () => {
    renderHook(() => useTheme('accepted'))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('toggleTheme switches light to dark and persists cookie', () => {
    const { result } = renderHook(() => useTheme('accepted'))
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('dark')
    expect(document.cookie).toContain('theme=dark')
  })

  it('toggleTheme switches dark to light', () => {
    document.cookie = 'theme=dark; path=/'
    const { result } = renderHook(() => useTheme('accepted'))
    act(() => { result.current.toggleTheme() })
    expect(result.current.theme).toBe('light')
  })

  it('persists cookie when consent is granted after toggling', () => {
    const { result, rerender } = renderHook(({ c }) => useTheme(c), { initialProps: { c: null } })
    act(() => { result.current.toggleTheme() })  // theme = dark, no cookie yet
    expect(document.cookie).not.toContain('theme=')

    rerender({ c: 'accepted' })  // consent granted → effect re-runs
    expect(document.cookie).toContain('theme=dark')
  })
})
