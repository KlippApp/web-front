import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useLocalizedPath } from '../../hooks/useLocalizedPath.js'

describe('useLocalizedPath', () => {
  it('prefixes paths with the current language', () => {
    const { result } = renderHook(() => useLocalizedPath())
    expect(result.current('/terms')).toBe('/en/terms')
  })
})
