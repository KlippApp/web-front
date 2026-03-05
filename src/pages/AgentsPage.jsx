import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Users, X, Pencil, Camera } from 'lucide-react'

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
    if (i > 0 && i % 2 === 1) formatted += ' ' // First group is 1 digit, then 2 digits groups
    formatted += digits[i]
  }
  return formatted.substring(0, 13) // Max 9 digits + spaces
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

export default function AgentsPage() {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [agents, setAgents] = useState([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+33', photo: null })

  const closeForm = useCallback(() => {
    setEditingAgent(null)
    setForm({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+33', photo: null })
    setShowForm(false)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (editingAgent) {
      setAgents(prev => prev.map(a => a.id === editingAgent.id ? { ...form, id: a.id } : a))
    } else {
      const newAgent = { ...form, id: Date.now() }
      setAgents(prev => [...prev, newAgent])
    }
    closeForm()
  }, [editingAgent, form, closeForm])

  const openEdit = (agent) => {
    setEditingAgent(agent)
    setForm({ 
      firstName: agent.firstName, 
      lastName: agent.lastName, 
      email: agent.email, 
      phone: agent.phone,
      countryCode: agent.countryCode || '+33',
      photo: agent.photo || null
    })
    setShowForm(true)
  }

  const handlePhoneChange = (e) => {
    setForm({ ...form, phone: formatPhone(e.target.value) })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm({ ...form, photo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.25rem' }}>
            {t('portal.agents.title')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('portal.agents.subtitle')}
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
          {t('portal.agents.addAgent')}
        </button>
      </div>

      {agents.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: '1rem', 
            background: 'var(--color-nav-bg)', color: 'var(--color-text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Users size={24} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{t('portal.agents.list.empty')}</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', width: '48px' }}>
                  {t('portal.agents.form.photo')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.agents.form.firstName')} / {t('portal.agents.form.lastName')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.agents.form.email')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.agents.form.phone')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', textAlign: 'right' }}>
                  {t('portal.agents.list.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                      background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid var(--color-blue-primary)'
                    }}>
                      {agent.photo ? (
                        <img src={agent.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Users size={20} color="var(--color-text-secondary)" />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {agent.firstName} {agent.lastName}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {agent.email}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {agent.countryCode} {agent.phone}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => openEdit(agent)}
                      style={{
                        padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-card-border)',
                        background: 'transparent', color: 'var(--color-text-primary)', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
                      }}
                    >
                      <Pencil size={14} />
                      {t('portal.agents.list.edit')}
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
          <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: '1.5rem', position: 'relative', background: 'var(--color-bg)' }}>
            <button 
              onClick={closeForm}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>
              {editingAgent ? t('portal.agents.editAgent') : t('portal.agents.addAgent')}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                    background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--color-blue-primary)'
                  }}>
                    {form.photo ? (
                      <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Users size={32} color="var(--color-text-secondary)" />
                    )}
                  </div>
                  <label style={{
                    position: 'absolute', bottom: 0, right: 0, 
                    width: 28, height: 28, borderRadius: '50%', 
                    background: 'var(--color-blue-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: '2px solid var(--color-bg)'
                  }}>
                    <Camera size={14} />
                    <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label={t('portal.agents.form.firstName')} id="agent-firstName">
                  <input 
                    id="agent-firstName"
                    required style={inputStyle} value={form.firstName} 
                    onChange={e => setForm({...form, firstName: e.target.value})}
                  />
                </Field>
                <Field label={t('portal.agents.form.lastName')} id="agent-lastName">
                  <input 
                    id="agent-lastName"
                    required style={inputStyle} value={form.lastName} 
                    onChange={e => setForm({...form, lastName: e.target.value})}
                  />
                </Field>
              </div>
              <Field label={t('portal.agents.form.email')} id="agent-email">
                <input 
                  id="agent-email"
                  type="email" required style={inputStyle} value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </Field>
              <Field label={t('portal.agents.form.phone')} id="agent-phone">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    value={form.countryCode}
                    onChange={e => setForm({ ...form, countryCode: e.target.value })}
                    style={{
                      ...inputStyle,
                      width: 'auto',
                      paddingRight: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    {countries.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    id="agent-phone"
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
                  {t('portal.agents.form.cancel')}
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: 'none',
                    background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                    color: '#fff', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  {editingAgent ? t('portal.agents.form.submitEdit') : t('portal.agents.form.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
