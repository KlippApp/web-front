import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
]

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const currentLang = languages.find(l => i18n.language.startsWith(l.code)) || languages[0]

  const changeLanguage = (code) => {
    i18n.changeLanguage(code)
    setIsOpen(false)
  }

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0 0.75rem',
          height: '2.25rem',
          borderRadius: '0.75rem',
          border: '1px solid var(--color-portal-border)',
          background: 'var(--color-portal-bg)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--color-portal-hover-bg)'
          e.currentTarget.style.borderColor = 'var(--color-portal-hover-border)'
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            e.currentTarget.style.background = 'var(--color-portal-bg)'
            e.currentTarget.style.borderColor = 'var(--color-portal-border)'
          }
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>{currentLang.flag}</span>
        <ChevronDown 
          size={14} 
          style={{ 
            transition: 'transform 0.2s', 
            transform: isOpen ? 'rotate(180deg)' : 'none',
            opacity: 0.6
          }} 
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            right: 0,
            width: '140px',
            background: 'var(--color-mobile-menu-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--color-divider)',
            borderRadius: '0.75rem',
            padding: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: i18n.language.startsWith(lang.code) ? 'rgba(43, 127, 255, 0.1)' : 'transparent',
                color: i18n.language.startsWith(lang.code) ? 'var(--color-blue-primary)' : 'var(--color-text-primary)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = i18n.language.startsWith(lang.code) ? 'rgba(43, 127, 255, 0.1)' : 'transparent'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
