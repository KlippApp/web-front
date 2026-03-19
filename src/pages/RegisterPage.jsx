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
  boxSizing: 'border-box',
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    agencyName: '',
    managerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    streetNumber: '',
    street: '',
    postalCode: '',
    city: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const focusStyle = (e) => { e.target.style.borderColor = 'var(--color-input-focus-border)' }
  const blurStyle = (e) => { e.target.style.borderColor = 'var(--color-input-border)' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError(t('portal.register.errorPasswordMismatch'))
      return
    }

    setLoading(true)
    try {
      if (DEV_BYPASS) {
        login('dev-token', form.agencyName, form.managerName)
        navigate('/dashboard')
        return
      }
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_name: form.agencyName,
          manager_name: form.managerName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          street_number: form.streetNumber,
          street: form.street,
          postal_code: form.postalCode,
          city: form.city,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = Array.isArray(data.detail)
          ? data.detail.map(e => e.msg).join(', ')
          : data.detail || t('portal.register.errorGeneric')
        setError(msg)
      } else {
        login(data.token, data.agency, data.managerName)
        navigate('/dashboard')
      }
    } catch {
      setError(t('portal.register.errorGeneric'))
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
        style={{ width: '100%', maxWidth: 480, padding: '2.5rem 2rem' }}
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
          {t('portal.register.title')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
          {t('portal.register.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label={t('portal.register.agencyNameLabel')} htmlFor="reg-agencyName">
              <input id="reg-agencyName" type="text" required value={form.agencyName} onChange={set('agencyName')}
                placeholder={t('portal.register.agencyNamePlaceholder')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.register.managerNameLabel')} htmlFor="reg-managerName">
              <input id="reg-managerName" type="text" required value={form.managerName} onChange={set('managerName')}
                placeholder={t('portal.register.managerNamePlaceholder')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>

          <Field label={t('portal.register.emailLabel')} htmlFor="reg-email">
            <input id="reg-email" type="email" required value={form.email} onChange={set('email')}
              placeholder={t('portal.register.emailPlaceholder')}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label={t('portal.register.passwordLabel')} htmlFor="reg-password">
              <input id="reg-password" type="password" required value={form.password} onChange={set('password')}
                placeholder="••••••••"
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.register.confirmPasswordLabel')} htmlFor="reg-confirmPassword">
              <input id="reg-confirmPassword" type="password" required value={form.confirmPassword} onChange={set('confirmPassword')}
                placeholder="••••••••"
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>

          <Field label={t('portal.register.phoneLabel')} htmlFor="reg-phone">
            <input id="reg-phone" type="tel" required value={form.phone} onChange={set('phone')}
              placeholder={t('portal.register.phonePlaceholder')}
              style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <Field label={t('portal.register.streetNumberLabel')} htmlFor="reg-streetNumber">
              <input id="reg-streetNumber" type="text" required value={form.streetNumber} onChange={set('streetNumber')}
                placeholder="12"
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.register.streetLabel')} htmlFor="reg-street">
              <input id="reg-street" type="text" required value={form.street} onChange={set('street')}
                placeholder={t('portal.register.streetPlaceholder')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <Field label={t('portal.register.postalCodeLabel')} htmlFor="reg-postalCode">
              <input id="reg-postalCode" type="text" required value={form.postalCode} onChange={set('postalCode')}
                placeholder="75001"
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.register.cityLabel')} htmlFor="reg-city">
              <input id="reg-city" type="text" required value={form.city} onChange={set('city')}
                placeholder={t('portal.register.cityPlaceholder')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
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
            {loading ? t('portal.register.loading') : t('portal.register.submit')}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
          {t('portal.register.hasAccount')}{' '}
          <Link to="/login" style={{ color: '#2B7FFF', fontWeight: 600, textDecoration: 'none' }}>
            {t('portal.register.loginLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
