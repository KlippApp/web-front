import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Building2, LogOut, ChevronLeft, Menu } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useTheme } from '../hooks/useTheme.js'
import { useCookieConsent } from '../hooks/useCookieConsent.js'
import ThemeToggle from './ThemeToggle.jsx'
import LanguageToggle from './LanguageToggle.jsx'

export default function DashboardLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { agency, logout } = useAuth()
  const { consented } = useCookieConsent()
  const { theme, toggleTheme } = useTheme(consented)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('portal.dashboard.nav.dashboard'), end: true },
    { to: '/dashboard/profile', icon: Building2, label: t('portal.dashboard.nav.profile') },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 0,
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'width 0.25s ease',
        borderRight: sidebarOpen ? '1px solid var(--color-card-border)' : 'none',
        background: 'var(--color-nav-bg)',
      }}>
        {/* Inner wrapper — fixed width so content doesn't reflow during animation */}
        <div style={{ width: 240, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Logo + close button */}
          <div style={{
            padding: '1.5rem 1.25rem',
            borderBottom: '1px solid var(--color-card-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '0.375rem',
                background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>Klipp</span>
            </div>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: '0.375rem', border: 'none',
                  background: 'transparent', color: 'var(--color-text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.875rem', borderRadius: '0.5rem',
                  textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500,
                  transition: 'all 0.15s', whiteSpace: 'nowrap',
                  color: isActive ? 'var(--color-blue-primary)' : 'var(--color-text-secondary)',
                  background: isActive ? 'rgba(43, 127, 255, 0.08)' : 'transparent',
                })}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-card-border)' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.875rem', borderRadius: '0.5rem', border: 'none',
                background: 'transparent', color: 'var(--color-text-secondary)',
                fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
            >
              <LogOut size={18} />
              {t('portal.dashboard.logout')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-card-border)',
          background: 'var(--color-nav-bg)', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: '0.5rem', border: 'none',
                  background: 'transparent', color: 'var(--color-text-secondary)',
                  cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                }}
              >
                <Menu size={20} />
              </button>
            )}
            <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>
              {t('portal.dashboard.greeting', { agency })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LanguageToggle />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
