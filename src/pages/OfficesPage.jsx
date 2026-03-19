import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, MapPin, X, Pencil, Camera, Trash2 } from 'lucide-react'
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

const countries = [
  { code: '+33', flag: '🇫🇷', label: 'FR' },
  { code: '+32', flag: '🇧🇪', label: 'BE' },
  { code: '+41', flag: '🇨🇭', label: 'CH' },
  { code: '+352', flag: '🇱🇺', label: 'LU' },
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
]

const formatPhone = (value) => {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = digits.substring(1)
  let formatted = ''
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 2 === 1) formatted += ' '
    formatted += digits[i]
  }
  return formatted.substring(0, 13)
}

function Field({ label, id, children }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default function OfficesPage() {
  const { t } = useTranslation()
  const { token } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingOffice, setEditingOffice] = useState(null)
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', email: '', phone: '', countryCode: '+33', photo: null })

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (DEV_BYPASS || !API_URL) {
      setOffices([])
      return
    }
    fetch(`${API_URL}/offices`, { headers: authHeaders })
      .then(r => r.json())
      .then(data => setOffices(data.items ?? []))
      .catch(() => {})
  }, [])

  const closeForm = useCallback(() => {
    setEditingOffice(null)
    setForm({ name: '', address: '', email: '', phone: '', countryCode: '+33', photo: null })
    setShowForm(false)
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (DEV_BYPASS || !API_URL) {
        if (editingOffice) {
          setOffices(prev => prev.map(o => o.uuid === editingOffice.uuid ? { ...form, uuid: o.uuid } : o))
        } else {
          setOffices(prev => [...prev, { ...form, country_code: form.countryCode, uuid: Date.now().toString() }])
        }
        closeForm()
        return
      }
      if (editingOffice) {
        const res = await fetch(`${API_URL}/offices/${editingOffice.uuid}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({
            name: form.name,
            address: form.address,
            email: form.email,
            phone: `${form.countryCode} ${form.phone}`,
            country_code: form.countryCode,
            photo: form.photo,
          }),
        })
        const data = await res.json()
        if (res.ok) setOffices(prev => prev.map(o => o.uuid === editingOffice.uuid ? data : o))
      } else {
        const res = await fetch(`${API_URL}/offices`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            name: form.name,
            address: form.address,
            email: form.email,
            phone: `${form.countryCode} ${form.phone}`,
            country_code: form.countryCode,
            photo: form.photo,
          }),
        })
        const data = await res.json()
        if (res.ok) setOffices(prev => [...prev, data])
      }
      closeForm()
    } finally {
      setLoading(false)
    }
  }, [editingOffice, form, closeForm])

  const handleDelete = useCallback(async (office) => {
    if (DEV_BYPASS) {
      setOffices(prev => prev.filter(o => o.uuid !== office.uuid))
      return
    }
    await fetch(`${API_URL}/offices/${office.uuid}`, { method: 'DELETE', headers: authHeaders })
    setOffices(prev => prev.filter(o => o.uuid !== office.uuid))
  }, [])

  const openEdit = (office) => {
    setEditingOffice(office)
    setForm({
      name: office.name,
      address: office.address,
      email: office.email,
      phone: office.phone,
      countryCode: office.country_code || '+33',
      photo: office.photo || null,
    })
    setShowForm(true)
  }

  const handlePhoneChange = (e) => {
    setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="dash-page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.25rem' }}>
            {t('portal.offices.title')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('portal.offices.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <Plus size={18} />
          {t('portal.offices.addOffice')}
        </button>
      </div>

      {offices.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: '1rem', 
            background: 'var(--color-nav-bg)', color: 'var(--color-text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <MapPin size={24} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{t('portal.offices.list.empty')}</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', width: '48px' }}>
                  {t('portal.offices.form.photo')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.offices.form.name')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.offices.form.address')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.offices.form.email')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.offices.form.phone')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', textAlign: 'right' }}>
                  {t('portal.offices.list.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {offices.map(office => (
                <tr key={office.uuid} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                      background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid var(--color-blue-primary)'
                    }}>
                      {office.photo ? (
                        <img src={office.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <MapPin size={20} color="var(--color-text-secondary)" />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {office.name}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {office.address}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {office.email}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {office.country_code} {office.phone}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => openEdit(office)}
                      style={{
                        padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-card-border)',
                        background: 'transparent', color: 'var(--color-text-primary)', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                      }}
                    >
                      <Pencil size={14} />
                      {t('portal.offices.list.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(office)}
                      style={{
                        padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-input-error)',
                        background: 'transparent', color: 'var(--color-input-error)', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Overlay */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', padding: '1rem', zIndex: 100
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 450, padding: '1.5rem', position: 'relative', background: 'var(--color-bg)' }}>
            <button 
              onClick={closeForm}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>
              {editingOffice ? t('portal.offices.editOffice') : t('portal.offices.addOffice')}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Photo Upload */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <label style={{ cursor: 'pointer', display: 'block', position: 'relative', borderRadius: '50%' }}>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                    <div style={{
                      width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                      background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--color-blue-primary)',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                      {form.photo ? (
                        <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <MapPin size={32} color="var(--color-text-secondary)" />
                      )}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0, 
                      width: 28, height: 28, borderRadius: '50%', 
                      background: 'var(--color-blue-primary)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid var(--color-bg)',
                      pointerEvents: 'none'
                    }}>
                      <Camera size={14} />
                    </div>
                  </label>
                </div>
              </div>

              <Field label={t('portal.offices.form.name')} id="office-name">
                <input 
                  id="office-name"
                  required style={inputStyle} value={form.name} 
                  onChange={e => setForm(prev => ({...prev, name: e.target.value}))}
                  placeholder="Klipp Paris"
                />
              </Field>

              <Field label={t('portal.offices.form.address')} id="office-address">
                <input 
                  id="office-address"
                  required style={inputStyle} value={form.address} 
                  onChange={e => setForm(prev => ({...prev, address: e.target.value}))}
                  placeholder="123 Avenue des Champs-Élysées, 75008 Paris"
                />
              </Field>

              <Field label={t('portal.offices.form.email')} id="office-email">
                <input 
                  id="office-email"
                  type="email" required style={inputStyle} value={form.email} 
                  onChange={e => setForm(prev => ({...prev, email: e.target.value}))}
                  placeholder="paris@klipp.com"
                />
              </Field>

              <Field label={t('portal.offices.form.phone')} id="office-phone">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={form.countryCode}
                    onChange={e => setForm(prev => ({ ...prev, countryCode: e.target.value }))}
                    style={{ ...inputStyle, width: 'auto', paddingRight: '0.5rem', cursor: 'pointer' }}
                  >
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    id="office-phone"
                    type="tel" required style={inputStyle} value={form.phone} 
                    onChange={handlePhoneChange}
                    placeholder="6 12 34 56 78"
                  />
                </div>
              </Field>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" onClick={closeForm}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: '1px solid var(--color-card-border)',
                    background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  {t('portal.offices.form.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: 'none',
                    background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                    color: '#fff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {editingOffice ? t('portal.offices.form.submitEdit') : t('portal.offices.form.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
