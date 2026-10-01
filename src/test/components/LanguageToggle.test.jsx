import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import LanguageToggle from '../../components/LanguageToggle'
import { useTranslation } from 'react-i18next'

function CurrentPath() {
  const { pathname, hash } = useLocation()
  return <div data-testid="path">{pathname + hash}</div>
}

function renderToggle(entry = '/en') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="*" element={<><LanguageToggle /><CurrentPath /></>} />
      </Routes>
    </MemoryRouter>
  )
}

function pick(label) {
  fireEvent.click(screen.getByRole('button', { name: /select language/i }))
  fireEvent.click(screen.getByText(label))
}

describe('LanguageToggle', () => {
  it('renders the current language flag', () => {
    renderToggle()
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
  })

  it('opens the dropdown when clicked', () => {
    renderToggle()
    fireEvent.click(screen.getByRole('button', { name: /select language/i }))
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
  })

  it('calls changeLanguage when a language is selected', () => {
    const { i18n } = useTranslation()
    renderToggle()
    pick('Français')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr')
  })

  it('closes the dropdown after selecting a language', () => {
    renderToggle()
    pick('Français')
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })

  it('switches a public page to its URL in the other language', () => {
    renderToggle('/en/privacy#cookies')
    pick('Français')
    expect(screen.getByTestId('path')).toHaveTextContent('/privacy#cookies')
  })

  it('moves the French home page to /en', () => {
    renderToggle('/')
    pick('English')
    expect(screen.getByTestId('path')).toHaveTextContent(/^\/en$/)
  })

  it('stays on the same URL outside public pages', () => {
    renderToggle('/dashboard')
    pick('Français')
    expect(screen.getByTestId('path')).toHaveTextContent('/dashboard')
  })
})
