import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Screenshots', href: '#screenshots' },
  { label: 'Reviews', href: '#testimonials' },
]

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled ? 'var(--color-nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-divider)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 no-underline">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-logo-text)' }}>Klipp</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--color-nav-link)',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--color-nav-link-hover)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-nav-link)'}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <a
            href="#client-portal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '0.5rem 1.25rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--color-portal-border)',
              background: 'var(--color-portal-bg)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--color-portal-hover-bg)'
              e.currentTarget.style.borderColor = 'var(--color-portal-hover-border)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--color-portal-bg)'
              e.currentTarget.style.borderColor = 'var(--color-portal-border)'
            }}
          >
            <User size={18} />
            Espace Client
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-hamburger)',
            cursor: 'pointer',
            padding: '0.25rem',
          }}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: 'var(--color-mobile-menu-bg)',
            borderTop: '1px solid var(--color-divider)',
            padding: '1rem 1.5rem 1.5rem',
          }}
        >
          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: 'var(--color-nav-link)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#client-portal"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--color-mobile-portal)',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                padding: '0.5rem 0',
              }}
            >
              <User size={20} />
              Espace Client
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
