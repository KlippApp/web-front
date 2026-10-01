import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Users, X, Trash2, Camera } from 'lucide-react'
import API_URL, { DEV_BYPASS, authFetch, apiErrorMessage } from '../config/api.js'
import Dropdown from '../components/Dropdown.jsx'
import PhoneInput from '../components/PhoneInput.jsx'
import { formatPhone, parsePhone } from '../utils/phone.js'

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

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', photo: null, officeUuid: '' }

export default function AgentsPage() {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [agents, setAgents] = useState([])
  const [offices, setOffices] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')
  const [confirmLink, setConfirmLink] = useState(false)

  useEffect(() => {
    if (DEV_BYPASS || !API_URL) return
    // ponytail: single page of 100, add pagination if an agency outgrows it
    Promise.all([
      authFetch('/agents?items_per_page=100').then(r => r.json()),
      authFetch('/agents/pending-links').then(r => r.json()),
    ])
      .then(([agentsPage, pendingLinks]) => setAgents([...(agentsPage.items ?? []), ...(Array.isArray(pendingLinks) ? pendingLinks : [])]))
      .catch(() => {})
    authFetch('/offices?items_per_page=100')
      .then(r => r.json())
      .then(data => setOffices(data.items ?? []))
      .catch(() => {})
  }, [])

  const closeForm = useCallback(() => {
    setForm(emptyForm)
    setError('')
    setConfirmLink(false)
    setShowForm(false)
  }, [])

  const submitAgent = useCallback(async (linkExisting) => {
    setConfirmLink(false)
    setLoading(true)
    try {
      if (DEV_BYPASS || !API_URL) {
        setAgents(prev => [...prev, {
          uuid: Date.now().toString(),
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          profile_image_url: form.photo,
          office_uuid: form.officeUuid,
          has_set_password: false,
        }])
        closeForm()
        return
      }
      const res = await authFetch('/agents', {
        method: 'POST',
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          country_code: parsePhone(form.phone).countryCode,
          photo: form.photo,
          office_uuid: form.officeUuid,
          link_existing: linkExisting,
        }),
      })
      const data = await res.json()
      if (res.status === 409) {
        setConfirmLink(true)
        return
      }
      if (!res.ok) {
        setError(apiErrorMessage(data, t('portal.profile.errorGeneric')))
        return
      }
      setAgents(prev => [...prev, data])
      closeForm()
    } catch {
      setError(t('portal.profile.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }, [form, closeForm, t])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (form.officeUuid) submitAgent(false)
  }

  const handleDelete = useCallback(async () => {
    const agent = confirmDelete
    setConfirmDelete(null)
    if (DEV_BYPASS || !API_URL) {
      setAgents(prev => prev.filter(a => a.uuid !== agent.uuid))
      return
    }
    await authFetch(`/agents/${agent.uuid}`, { method: 'DELETE' })
    setAgents(prev => prev.filter(a => a.uuid !== agent.uuid))
  }, [confirmDelete])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setForm(prev => ({ ...prev, photo: reader.result }))
      reader.readAsDataURL(file)
    }
  }

  const officeName = (agent) => offices.find(o => o.uuid === agent.office_uuid)?.name ?? '—'

  return (
    <div className="dash-page-content">
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
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1rem', borderRadius: '0.75rem', border: 'none',
            background: 'linear-gradient(135deg, #695CF6 0%, #B7AFFB 100%)',
            color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'opacity 0.2s',
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
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
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
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.agents.form.office')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  Statut
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', textAlign: 'right' }}>
                  {t('portal.agents.list.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.uuid} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                      background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid var(--color-accent)',
                    }}>
                      {agent.profile_image_url && agent.profile_image_url !== 'https://profileimageurl.com' ? (
                        <img src={agent.profile_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Users size={20} color="var(--color-text-secondary)" />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {agent.name}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {agent.email}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {formatPhone(agent.phone)}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {officeName(agent)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {(agent.link_pending || !agent.has_set_password) && (
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '9999px',
                        fontSize: '0.75rem', fontWeight: 600,
                        background: 'rgba(251,191,36,0.12)', color: '#f59e0b',
                        border: '1px solid rgba(251,191,36,0.3)',
                      }}>
                        {t(agent.link_pending ? 'portal.agents.list.linkPending' : 'portal.agents.list.pending')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setConfirmDelete(agent)}
                      style={{
                        padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-input-error)',
                        background: 'transparent', color: 'var(--color-input-error)', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      }}
                    >
                      <Trash2 size={14} />
                      {t('portal.agents.list.delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          role="dialog" aria-modal="true"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '1rem', zIndex: 200,
          }}
        >
          <div style={{
            width: '100%', maxWidth: 400, padding: '2rem',
            background: 'var(--color-nav-bg)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--color-card-border)',
            borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {t('portal.agents.deleteModal.title')}
            </h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {t('portal.agents.deleteModal.message', { name: confirmDelete.name })}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                  border: '1px solid var(--color-card-border)',
                  background: 'transparent', color: 'var(--color-text-secondary)',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                }}
              >
                {t('portal.agents.deleteModal.cancel')}
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                }}
              >
                {t('portal.agents.deleteModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Agent Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1rem', zIndex: 100,
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: '1.5rem', position: 'relative', background: 'var(--color-bg)' }}>
            <button
              onClick={closeForm}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>
              {t('portal.agents.addAgent')}
            </h2>
            <form onSubmit={handleSubmit}>

              {/* Photo upload */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <label style={{ cursor: 'pointer', display: 'block', position: 'relative', borderRadius: '50%' }}>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
                    background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--color-accent)', transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    {form.photo ? (
                      <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Users size={32} color="var(--color-text-secondary)" />
                    )}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--color-accent)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--color-bg)', pointerEvents: 'none',
                  }}>
                    <Camera size={14} />
                  </div>
                </label>
              </div>

              <div className="dash-grid-2">
                <Field label={t('portal.agents.form.firstName')} id="agent-firstName">
                  <input
                    id="agent-firstName" required style={inputStyle} value={form.firstName}
                    onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </Field>
                <Field label={t('portal.agents.form.lastName')} id="agent-lastName">
                  <input
                    id="agent-lastName" required style={inputStyle} value={form.lastName}
                    onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </Field>
              </div>

              <Field label={t('portal.agents.form.email')} id="agent-email">
                <input
                  id="agent-email" type="email" required style={inputStyle} value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </Field>

              <Field label={t('portal.agents.form.phone')} id="agent-phone">
                <PhoneInput
                  id="agent-phone" inputStyle={inputStyle} value={form.phone}
                  onChange={phone => setForm(prev => ({ ...prev, phone }))}
                />
              </Field>

              <Field label={t('portal.agents.form.office')} id="agent-office">
                <Dropdown
                  options={offices.map(o => ({ value: o.uuid, label: o.name }))}
                  value={form.officeUuid}
                  onChange={v => setForm(prev => ({ ...prev, officeUuid: v }))}
                  placeholder={t('portal.agents.form.officeNone')}
                />
              </Field>

              {error && (
                <p role="alert" style={{ color: 'var(--color-input-error)', fontSize: '0.85rem', margin: 0 }}>{error}</p>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button" onClick={closeForm}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: '1px solid var(--color-card-border)',
                    background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {t('portal.agents.form.cancel')}
                </button>
                <button
                  type="submit" disabled={loading || !form.officeUuid}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: 'none',
                    background: 'linear-gradient(135deg, #695CF6 0%, #B7AFFB 100%)',
                    color: '#fff', fontWeight: 600,
                    cursor: loading || !form.officeUuid ? 'not-allowed' : 'pointer',
                    opacity: loading || !form.officeUuid ? 0.5 : 1,
                  }}
                >
                  {t('portal.agents.form.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmLink && (
        <div
          role="alertdialog" aria-modal="true" aria-labelledby="link-modal-title"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '1rem', zIndex: 300,
          }}
        >
          <div style={{
            width: '100%', maxWidth: 420, padding: '2rem',
            background: 'var(--color-nav-bg)', backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--color-card-border)',
            borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }}>
            <h2 id="link-modal-title" style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {t('portal.agents.linkModal.title')}
            </h2>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              {t('portal.agents.linkModal.message', { email: form.email })}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmLink(false)}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '0.75rem',
                  border: '1px solid var(--color-card-border)',
                  background: 'transparent', color: 'var(--color-text-secondary)',
                  fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                }}
              >
                {t('portal.agents.linkModal.cancel')}
              </button>
              <button
                onClick={() => submitAgent(true)}
                style={{
                  padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: 'none',
                  background: 'linear-gradient(135deg, #695CF6 0%, #B7AFFB 100%)',
                  color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                }}
              >
                {t('portal.agents.linkModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
