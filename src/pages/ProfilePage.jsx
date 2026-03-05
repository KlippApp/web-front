import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.js'

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

const submitStyle = (loading) => ({
  marginTop: '0.25rem',
  padding: '0.625rem',
  borderRadius: '0.75rem',
  border: 'none',
  background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.875rem',
  cursor: loading ? 'not-allowed' : 'pointer',
  opacity: loading ? 0.7 : 1,
  transition: 'opacity 0.2s',
})

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

export default function ProfilePage() {
  const { t } = useTranslation()
  const { agency, managerName, token, updateProfile } = useAuth()

  const [infoForm, setInfoForm] = useState({
    managerName: managerName || '',
    agencyName: agency || '',
    email: '',
    phone: '',
    streetNumber: '',
    street: '',
    postalCode: '',
    city: '',
  })
  const [infoError, setInfoError] = useState('')
  const [infoSuccess, setInfoSuccess] = useState('')
  const [infoLoading, setInfoLoading] = useState(false)

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const setInfo = (field) => (e) => setInfoForm(prev => ({ ...prev, [field]: e.target.value }))
  const setPw = (field) => (e) => setPwForm(prev => ({ ...prev, [field]: e.target.value }))

  const focusStyle = (e) => { e.target.style.borderColor = 'var(--color-input-focus-border)' }
  const blurStyle = (e) => { e.target.style.borderColor = 'var(--color-input-border)' }

  const handleInfoSubmit = async (e) => {
    e.preventDefault()
    setInfoError('')
    setInfoSuccess('')
    setInfoLoading(true)
    try {
      const res = await fetch('PLACEHOLDER_API_URL/agency/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(infoForm),
      })
      const data = await res.json()
      if (!res.ok) {
        setInfoError(data.message || t('portal.profile.errorGeneric'))
      } else {
        updateProfile(infoForm.agencyName, infoForm.managerName)
        setInfoSuccess(t('portal.profile.successInfo'))
      }
    } catch {
      setInfoError(t('portal.profile.errorGeneric'))
    } finally {
      setInfoLoading(false)
    }
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError(t('portal.profile.errorPasswordMismatch'))
      return
    }
    setPwLoading(true)
    try {
      const res = await fetch('PLACEHOLDER_API_URL/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwError(data.message || t('portal.profile.errorGeneric'))
      } else {
        setPwSuccess(t('portal.profile.successPassword'))
        setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      }
    } catch {
      setPwError(t('portal.profile.errorGeneric'))
    } finally {
      setPwLoading(false)
    }
  }

  const sectionTitle = { margin: '0 0 1.25rem', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: 640, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
        {t('portal.profile.title')}
      </h1>

      {/* Agency information */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={sectionTitle}>{t('portal.profile.agencyInfoSection')}</h2>
        <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label={t('portal.profile.managerNameLabel')} htmlFor="prof-managerName">
              <input id="prof-managerName" type="text" required value={infoForm.managerName} onChange={setInfo('managerName')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.profile.agencyNameLabel')} htmlFor="prof-agencyName">
              <input id="prof-agencyName" type="text" required value={infoForm.agencyName} onChange={setInfo('agencyName')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label={t('portal.profile.emailLabel')} htmlFor="prof-email">
              <input id="prof-email" type="email" required value={infoForm.email} onChange={setInfo('email')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.profile.phoneLabel')} htmlFor="prof-phone">
              <input id="prof-phone" type="tel" required value={infoForm.phone} onChange={setInfo('phone')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <Field label={t('portal.profile.streetNumberLabel')} htmlFor="prof-streetNumber">
              <input id="prof-streetNumber" type="text" required value={infoForm.streetNumber} onChange={setInfo('streetNumber')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.profile.streetLabel')} htmlFor="prof-street">
              <input id="prof-street" type="text" required value={infoForm.street} onChange={setInfo('street')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
            <Field label={t('portal.profile.postalCodeLabel')} htmlFor="prof-postalCode">
              <input id="prof-postalCode" type="text" required value={infoForm.postalCode} onChange={setInfo('postalCode')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.profile.cityLabel')} htmlFor="prof-city">
              <input id="prof-city" type="text" required value={infoForm.city} onChange={setInfo('city')}
                style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
          {infoError && <p style={{ fontSize: '0.8rem', color: 'var(--color-input-error)', margin: 0 }}>{infoError}</p>}
          {infoSuccess && <p style={{ fontSize: '0.8rem', color: 'var(--color-input-success)', margin: 0 }}>{infoSuccess}</p>}
          <button type="submit" disabled={infoLoading} style={submitStyle(infoLoading)}>
            {infoLoading ? t('portal.profile.loading') : t('portal.profile.saveInfo')}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h2 style={sectionTitle}>{t('portal.profile.passwordSection')}</h2>
        <form onSubmit={handlePwSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <Field label={t('portal.profile.currentPasswordLabel')} htmlFor="prof-currentPassword">
            <input id="prof-currentPassword" type="password" required value={pwForm.currentPassword} onChange={setPw('currentPassword')}
              placeholder="••••••••" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label={t('portal.profile.newPasswordLabel')} htmlFor="prof-newPassword">
              <input id="prof-newPassword" type="password" required value={pwForm.newPassword} onChange={setPw('newPassword')}
                placeholder="••••••••" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
            <Field label={t('portal.profile.confirmNewPasswordLabel')} htmlFor="prof-confirmNewPassword">
              <input id="prof-confirmNewPassword" type="password" required value={pwForm.confirmNewPassword} onChange={setPw('confirmNewPassword')}
                placeholder="••••••••" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
            </Field>
          </div>
          {pwError && <p style={{ fontSize: '0.8rem', color: 'var(--color-input-error)', margin: 0 }}>{pwError}</p>}
          {pwSuccess && <p style={{ fontSize: '0.8rem', color: 'var(--color-input-success)', margin: 0 }}>{pwSuccess}</p>}
          <button type="submit" disabled={pwLoading} style={submitStyle(pwLoading)}>
            {pwLoading ? t('portal.profile.loading') : t('portal.profile.savePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}
