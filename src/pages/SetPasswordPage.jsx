import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
  boxSizing: 'border-box',
}

export default function SetPasswordPage() {
  const { t } = useTranslation()
  const [status, setStatus] = useState('loading')
  const [agentInfo, setAgentInfo] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const token = new URLSearchParams(window.location.search).get('token') ?? ''

  useEffect(() => {
    if (!token) {
      setStatus('invalid')
      return
    }
    if (DEV_BYPASS || !API_URL) {
      setAgentInfo({ name: 'Demo Agent', email: 'agent@demo.com' })
      setStatus('valid')
      return
    }
    fetch(`${API_URL}/agents/invitation/verify?token=${encodeURIComponent(token)}`)
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.valid) {
          setAgentInfo({ name: data.name, email: data.email })
          setStatus('valid')
        } else {
          setStatus('invalid')
        }
      })
      .catch(() => setStatus('invalid'))
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError(t('setPassword.errorMismatch'))
      return
    }
    setStatus('submitting')
    try {
      if (DEV_BYPASS || !API_URL) {
        setStatus('done')
        return
      }
      const res = await fetch(`${API_URL}/agents/invitation/set-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        const data = await res.json()
        setError(data.detail || t('setPassword.errorGeneric'))
        setStatus('valid')
      }
    } catch {
      setError(t('setPassword.errorGeneric'))
      setStatus('valid')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'var(--color-bg)',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '2.5rem 2rem' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-logo-text)' }}>Klipp</span>
        </div>

        {status === 'loading' && (
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            {t('setPassword.loading')}
          </p>
        )}

        {status === 'invalid' && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
              {t('setPassword.invalidTitle')}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {t('setPassword.invalidMessage')}
            </p>
          </>
        )}

        {(status === 'valid' || status === 'submitting') && agentInfo && (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              {t('setPassword.title')}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
              {t('setPassword.subtitle', { name: agentInfo.name })}
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  {t('setPassword.emailLabel')}
                </label>
                <input
                  type="email"
                  readOnly
                  value={agentInfo.email}
                  style={{ ...inputStyle, opacity: 0.6, cursor: 'default' }}
                />
              </div>
              <div>
                <label htmlFor="set-password" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  {t('setPassword.passwordLabel')}
                </label>
                <input
                  id="set-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--color-input-focus-border)' }}
                  onBlur={e => { e.target.style.borderColor = 'var(--color-input-border)' }}
                />
              </div>
              <div>
                <label htmlFor="set-password-confirm" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  {t('setPassword.confirmLabel')}
                </label>
                <input
                  id="set-password-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
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
                disabled={status === 'submitting'}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: status === 'submitting' ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {status === 'submitting' ? t('setPassword.submitting') : t('setPassword.submit')}
              </button>
            </form>
          </>
        )}

        {status === 'done' && (
          <>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
              {t('setPassword.successTitle')}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              {t('setPassword.successMessage')}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
