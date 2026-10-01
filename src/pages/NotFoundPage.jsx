import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../components/Logo.jsx'
import { useLocalizedPath } from '../hooks/useLocalizedPath.js'

export default function NotFoundPage() {
  const { t } = useTranslation()
  const localize = useLocalizedPath()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'var(--color-bg)',
      }}
    >
      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Logo size={40} />
        </div>
        <p style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-accent)', lineHeight: 1, marginBottom: '0.75rem' }}>
          404
        </p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          {t('notFound.title')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          {t('notFound.text')}
        </p>
        <Link
          to={localize('/')}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #695CF6 0%, #B7AFFB 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
          }}
        >
          {t('portal.backToHome')}
        </Link>
      </div>
    </div>
  )
}
