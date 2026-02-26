import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LanguageToggle from '../../components/LanguageToggle'
import { useTranslation } from 'react-i18next'

describe('LanguageToggle', () => {
  it('renders the current language flag', () => {
    render(<LanguageToggle />)
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
  })

  it('opens the dropdown when clicked', () => {
    render(<LanguageToggle />)
    const button = screen.getByRole('button', { name: /select language/i })
    
    fireEvent.click(button)
    
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Français')).toBeInTheDocument()
  })

  it('calls changeLanguage when a language is selected', () => {
    const { i18n } = useTranslation()
    render(<LanguageToggle />)
    
    fireEvent.click(screen.getByRole('button', { name: /select language/i }))
    fireEvent.click(screen.getByText('Français'))
    
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr')
  })

  it('closes the dropdown after selecting a language', () => {
    render(<LanguageToggle />)
    
    fireEvent.click(screen.getByRole('button', { name: /select language/i }))
    fireEvent.click(screen.getByText('Français'))
    
    expect(screen.queryByText('English')).not.toBeInTheDocument()
  })
})
