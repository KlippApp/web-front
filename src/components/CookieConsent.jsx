import { useState } from 'react'

const ANIMATION_DURATION = 350

export default function CookieConsent({ onAccept, onDecline }) {
  const [leaving, setLeaving] = useState(false)

  function dismiss(callback) {
    setLeaving(true)
    setTimeout(callback, ANIMATION_DURATION)
  }

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className={leaving ? 'cookie-consent-out' : 'cookie-consent'}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: 'min(360px, calc(100% - 3rem))',
        zIndex: 100,
        background: 'var(--color-nav-bg)',
        border: '1px solid var(--color-card-border)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Icon + text */}
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
        <div
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            borderRadius: '0.625rem',
            background: 'var(--color-icon-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-icon-color)',
            marginTop: '0.1rem',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/>
            <path d="M8.5 8.5v.01"/>
            <path d="M16 15.5v.01"/>
            <path d="M12 12v.01"/>
          </svg>
        </div>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
            Cookies &amp; préférences
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Nous utilisons des cookies pour mémoriser votre préférence de thème (clair/sombre). Aucune donnée personnelle n'est collectée.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem' }}>
        <button
          onClick={() => dismiss(onDecline)}
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: '0.625rem',
            border: '1px solid var(--color-card-border)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-portal-hover-border)'
            e.currentTarget.style.color = 'var(--color-text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-card-border)'
            e.currentTarget.style.color = 'var(--color-text-secondary)'
          }}
        >
          Refuser
        </button>
        <button
          onClick={() => dismiss(onAccept)}
          style={{
            padding: '0.5rem 1.1rem',
            borderRadius: '0.625rem',
            border: '1px solid transparent',
            background: '#2B7FFF',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#1a6eee'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#2B7FFF'
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  )
}
