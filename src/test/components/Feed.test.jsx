import { render, screen, act, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Feed from '../../components/Feed'

function track() {
  return document.querySelector('.feed-track')
}

describe('Feed', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.matchMedia = vi.fn(() => ({ matches: false }))
  })
  afterEach(() => vi.useRealTimers())

  it('renders four listings', () => {
    render(<Feed />)
    expect(document.querySelectorAll('.feed-item')).toHaveLength(4)
    expect(screen.getByRole('img', { name: 'Preview of the Klipp listing feed' })).toBeInTheDocument()
  })

  it('swipes to the next listing and loops back to the first', () => {
    render(<Feed />)
    expect(track().style.transform).toBe('translateY(-0%)')
    act(() => { vi.advanceTimersByTime(3200) })
    expect(track().style.transform).toBe('translateY(-100%)')
    act(() => { vi.advanceTimersByTime(3200 * 3) })
    expect(track().style.transform).toBe('translateY(-0%)')
  })

  it('pauses while hovered', () => {
    render(<Feed />)
    fireEvent.mouseEnter(screen.getByRole('img'))
    act(() => { vi.advanceTimersByTime(10000) })
    expect(track().style.transform).toBe('translateY(-0%)')
  })

  it('stays still when the user prefers reduced motion', () => {
    window.matchMedia = vi.fn(() => ({ matches: true }))
    render(<Feed />)
    act(() => { vi.advanceTimersByTime(10000) })
    expect(track().style.transform).toBe('translateY(-0%)')
  })
})
