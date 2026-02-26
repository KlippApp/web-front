import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.25rem',
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
        e.currentTarget.style.background = 'var(--color-portal-bg)'
        e.currentTarget.style.borderColor = 'var(--color-portal-border)'
      }}
    >
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
