import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import API_URL, { DEV_BYPASS } from '../config/api.js'

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: '0.625rem',
  border: '1px solid var(--color-input-border)',
  background: 'var(--color-input-bg)',
  color: 'var(--color-input-text)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (DEV_BYPASS) {
        login('dev-token', email.split('@')[0])
        navigate('/dashboard')
        return
      }
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = Array.isArray(data.detail)
          ? data.detail.map(e => e.msg).join(', ')
          : data.detail || t('portal.login.errorGeneric')
        setError(msg)
      } else {
        login(data.token, data.agency, data.managerName)
        navigate('/dashboard')
      }
    } catch {
      setError(t('portal.login.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

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
      <div
        className="glass-card"
        style={{ width: '100%', maxWidth: 420, padding: '2.5rem 2rem' }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.target.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={e => { e.target.style.color = 'var(--color-text-secondary)' }}
        >
          <ChevronLeft size={16} />
          {t('portal.backToHome')}
        </Link>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-logo-text)' }}>Klipp</span>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
          {t('portal.login.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          {t('portal.login.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="login-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
              {t('portal.login.emailLabel')}
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('portal.login.emailPlaceholder')}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--color-input-focus-border)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-input-border)' }}
            />
          </div>

          <div>
            <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
              {t('portal.login.passwordLabel')}
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t('portal.login.passwordPlaceholder')}
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--color-input-focus-border)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--color-input-border)' }}
            />
          </div>

          {error && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-input-error)', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? t('portal.login.loading') : t('portal.login.submit')}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          {t('portal.login.noAccount')}{' '}
          <Link to="/register" style={{ color: '#2B7FFF', fontWeight: 600, textDecoration: 'none' }}>
            {t('portal.login.registerLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
