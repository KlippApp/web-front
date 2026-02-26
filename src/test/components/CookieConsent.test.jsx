import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CookieConsent from '../../components/CookieConsent'

function renderConsent(props = {}) {
  return render(<CookieConsent onAccept={vi.fn()} onDecline={vi.fn()} {...props} />)
}

describe('CookieConsent', () => {
  it('renders the dialog with title and description', () => {
    renderConsent()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Cookies & préférences/i)).toBeInTheDocument()
    expect(screen.getByText(/préférence de thème/i)).toBeInTheDocument()
  })

  it('renders Accepter and Refuser buttons', () => {
    renderConsent()
    expect(screen.getByRole('button', { name: /accepter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refuser/i })).toBeInTheDocument()
  })

  describe('exit animation', () => {
    beforeEach(() => { vi.useFakeTimers() })
    afterEach(() => { vi.useRealTimers() })

    it('switches to cookie-consent-out class immediately on Accepter click', () => {
      const { container } = renderConsent()
      const dialog = container.firstChild
      expect(dialog.className).toBe('cookie-consent')
      fireEvent.click(screen.getByRole('button', { name: /accepter/i }))
      expect(dialog.className).toBe('cookie-consent-out')
    })

    it('switches to cookie-consent-out class immediately on Refuser click', () => {
      const { container } = renderConsent()
      const dialog = container.firstChild
      fireEvent.click(screen.getByRole('button', { name: /refuser/i }))
      expect(dialog.className).toBe('cookie-consent-out')
    })

    it('calls onAccept only after the animation delay', () => {
      const onAccept = vi.fn()
      renderConsent({ onAccept })
      fireEvent.click(screen.getByRole('button', { name: /accepter/i }))
      expect(onAccept).not.toHaveBeenCalled()
      act(() => { vi.runAllTimers() })
      expect(onAccept).toHaveBeenCalledOnce()
    })

    it('calls onDecline only after the animation delay', () => {
      const onDecline = vi.fn()
      renderConsent({ onDecline })
      fireEvent.click(screen.getByRole('button', { name: /refuser/i }))
      expect(onDecline).not.toHaveBeenCalled()
      act(() => { vi.runAllTimers() })
      expect(onDecline).toHaveBeenCalledOnce()
    })
  })
})
