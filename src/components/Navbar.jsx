import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageToggle from './LanguageToggle.jsx'
import Logo from './Logo.jsx'
import { useLocalizedPath } from '../hooks/useLocalizedPath.js'

const linkClass = 'text-(--color-nav-link) no-underline font-medium transition-colors hover:text-(--color-nav-link-hover)'
const portalClass = 'inline-flex items-center gap-2 rounded-xl border border-(--color-portal-border) bg-(--color-portal-bg) px-4 py-2 text-sm font-semibold text-(--color-text-primary) no-underline transition-colors hover:bg-(--color-portal-hover-bg)'

function NavLink({ link, ...props }) {
  return link.to
    ? <Link to={link.to} {...props}>{link.label}</Link>
    : <a href={link.href} {...props}>{link.label}</a>
}

export default function Navbar({ theme, toggleTheme }) {
  const { t } = useTranslation()
  const localize = useLocalizedPath()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: t('nav.how'), href: `${localize('/')}#how` },
    { label: t('nav.agencies'), to: localize('/agences') },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="on-ink fixed inset-x-0 top-0 z-50 transition-colors"
      style={{
        background: scrolled || menuOpen ? 'var(--color-header-glass)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--color-divider)' : 'transparent'}`,
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to={localize('/')} className="flex items-center gap-2 no-underline">
          <Logo size={26} />
          <span className="text-lg font-bold text-(--color-logo-text)">Klipp</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[0.95rem]">
          {navLinks.map(link => <NavLink key={link.label} link={link} className={linkClass} />)}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <Link to="/login" className={portalClass}>
            <User size={16} />
            {t('nav.clientPortal')}
          </Link>
        </div>

        <button
          className="md:hidden p-1 text-(--color-hamburger) bg-transparent border-0 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-(--color-divider) px-6 pt-4 pb-6 flex flex-col gap-4">
          <div className="flex justify-end gap-3">
            <LanguageToggle />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          {navLinks.map(link => (
            <NavLink key={link.label} link={link} onClick={() => setMenuOpen(false)} className={`${linkClass} text-base`} />
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} className={`${portalClass} self-start`}>
            <User size={16} />
            {t('nav.clientPortal')}
          </Link>
        </div>
      )}
    </header>
  )
}
