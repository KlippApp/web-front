import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Plus, Megaphone, X, Pencil, Trash2, BarChart2, Camera, Eye, MessageCircle, Heart, Calendar } from 'lucide-react'

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

const STATS_FIXED = { views: 847, contacts: 32, favorites: 56, daysOnline: 14 }

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

function TypeBadge({ type }) {
  const isVente = type === 'vente'
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: isVente ? 'rgba(43, 127, 255, 0.12)' : 'rgba(16, 185, 129, 0.12)',
      color: isVente ? 'var(--color-blue-primary)' : '#10b981',
    }}>
      {type}
    </span>
  )
}

function StatusBadge({ status }) {
  const colors = {
    active: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981' },
    draft: { bg: 'rgba(156, 163, 175, 0.15)', text: 'var(--color-text-secondary)' },
    archived: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444' },
  }
  const c = colors[status] || colors.draft
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      background: c.bg,
      color: c.text,
    }}>
      {status}
    </span>
  )
}

export default function AnnouncesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingAnnounce, setEditingAnnounce] = useState(null)
  const [statsAnnounce, setStatsAnnounce] = useState(null)
  const [announces, setAnnounces] = useState([])
  const [form, setForm] = useState({
    photo: null, title: '', type: 'vente', price: '', address: '', surface: '', rooms: '', status: 'active',
  })

  const closeForm = useCallback(() => {
    setEditingAnnounce(null)
    setForm({ photo: null, title: '', type: 'vente', price: '', address: '', surface: '', rooms: '', status: 'active' })
    setShowForm(false)
  }, [])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if ('PLACEHOLDER_API_URL' === 'PLACEHOLDER_API_URL') {
      if (editingAnnounce) {
        setAnnounces(prev => prev.map(a => a.id === editingAnnounce.id ? { ...form, id: a.id, createdAt: a.createdAt } : a))
      } else {
        setAnnounces(prev => [...prev, { ...form, id: Date.now(), createdAt: new Date().toLocaleDateString('fr-FR') }])
      }
      closeForm()
    }
  }, [editingAnnounce, form, closeForm])

  const openEdit = (announce) => {
    setEditingAnnounce(announce)
    setForm({
      photo: announce.photo || null,
      title: announce.title,
      type: announce.type,
      price: announce.price,
      address: announce.address,
      surface: announce.surface,
      rooms: announce.rooms,
      status: announce.status,
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm(t('portal.announces.list.delete') + ' ?')) {
      if ('PLACEHOLDER_API_URL' === 'PLACEHOLDER_API_URL') {
        setAnnounces(prev => prev.filter(a => a.id !== id))
      }
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setForm(prev => ({ ...prev, photo: reader.result }))
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="dash-page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.25rem' }}>
            {t('portal.announces.title')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('portal.announces.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1rem', borderRadius: '0.75rem', border: 'none',
            background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
            color: '#fff', fontWeight: 600, fontSize: '0.875rem',
            cursor: 'pointer', transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          <Plus size={18} />
          {t('portal.announces.add')}
        </button>
      </div>

      {announces.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '1rem',
            background: 'var(--color-nav-bg)', color: 'var(--color-text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
          }}>
            <Megaphone size={24} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{t('portal.announces.list.empty')}</p>
        </div>
      ) : (
        <div className="glass-card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', width: 48 }}>
                  {t('portal.announces.form.photo')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.announces.form.title')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.announces.form.type')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.announces.form.price')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.announces.form.surface')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  {t('portal.announces.form.status')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem' }}>
                  Date
                </th>
                <th style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.8rem', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {announces.map((announce, idx) => (
                <tr key={announce.id} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '0.5rem', overflow: 'hidden',
                      background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid var(--color-blue-primary)',
                    }}>
                      {announce.photo ? (
                        <img src={announce.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Megaphone size={18} color="var(--color-text-secondary)" />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {announce.title}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <TypeBadge type={announce.type} />
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {Number(announce.price).toLocaleString('fr-FR')} €
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {announce.surface} m²
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={announce.status} />
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    {announce.createdAt}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openEdit(announce)}
                        aria-label={t('portal.announces.list.edit')}
                        title={t('portal.announces.list.edit')}
                        style={{
                          padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid var(--color-card-border)',
                          background: 'transparent', color: 'var(--color-text-primary)', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600,
                        }}
                      >
                        <Pencil size={13} />
                        {t('portal.announces.list.edit')}
                      </button>
                      <button
                        onClick={() => setStatsAnnounce({ ...announce, idx })}
                        aria-label={t('portal.announces.list.stats')}
                        title={t('portal.announces.list.stats')}
                        style={{
                          padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid var(--color-card-border)',
                          background: 'transparent', color: 'var(--color-blue-primary)', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600,
                        }}
                      >
                        <BarChart2 size={13} />
                        {t('portal.announces.list.stats')}
                      </button>
                      <button
                        onClick={() => handleDelete(announce.id)}
                        aria-label={t('portal.announces.list.delete')}
                        title={t('portal.announces.list.delete')}
                        style={{
                          padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.3)',
                          background: 'transparent', color: '#ef4444', cursor: 'pointer',
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: 600,
                        }}
                      >
                        <Trash2 size={13} />
                        {t('portal.announces.list.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1rem', zIndex: 100,
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 480, padding: '1.5rem', position: 'relative', background: 'var(--color-bg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <button
              onClick={closeForm}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 1.5rem' }}>
              {editingAnnounce ? t('portal.announces.edit') : t('portal.announces.add')}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Photo */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <label style={{ cursor: 'pointer', display: 'block', position: 'relative', borderRadius: '0.5rem' }}>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                  <div style={{
                    width: 80, height: 80, borderRadius: '0.5rem', overflow: 'hidden',
                    background: 'var(--color-nav-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--color-blue-primary)', transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.8' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    {form.photo ? (
                      <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Megaphone size={28} color="var(--color-text-secondary)" />
                    )}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--color-blue-primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--color-bg)', pointerEvents: 'none',
                  }}>
                    <Camera size={12} />
                  </div>
                </label>
              </div>

              <Field label={t('portal.announces.form.title')} id="ann-title">
                <input
                  id="ann-title"
                  required style={inputStyle} value={form.title}
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Appartement 3 pièces Paris 11e"
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label={t('portal.announces.form.type')} id="ann-type">
                  <select
                    id="ann-type"
                    required style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.type}
                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
                  >
                    <option value="vente">{t('portal.announces.form.typeSale')}</option>
                    <option value="location">{t('portal.announces.form.typeRent')}</option>
                  </select>
                </Field>

                <Field label={t('portal.announces.form.status')} id="ann-status">
                  <select
                    id="ann-status"
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="active">{t('portal.announces.form.statusActive')}</option>
                    <option value="draft">{t('portal.announces.form.statusDraft')}</option>
                    <option value="archived">{t('portal.announces.form.statusArchived')}</option>
                  </select>
                </Field>
              </div>

              <Field label={t('portal.announces.form.price')} id="ann-price">
                <input
                  id="ann-price"
                  type="number" required min="0" style={inputStyle} value={form.price}
                  onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="350000"
                />
              </Field>

              <Field label={t('portal.announces.form.address')} id="ann-address">
                <input
                  id="ann-address"
                  required style={inputStyle} value={form.address}
                  onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="12 rue de Rivoli, 75001 Paris"
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <Field label={t('portal.announces.form.surface')} id="ann-surface">
                  <input
                    id="ann-surface"
                    type="number" min="0" style={inputStyle} value={form.surface}
                    onChange={e => setForm(prev => ({ ...prev, surface: e.target.value }))}
                    placeholder="65"
                  />
                </Field>
                <Field label={t('portal.announces.form.rooms')} id="ann-rooms">
                  <input
                    id="ann-rooms"
                    type="number" min="0" style={inputStyle} value={form.rooms}
                    onChange={e => setForm(prev => ({ ...prev, rooms: e.target.value }))}
                    placeholder="3"
                  />
                </Field>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button" onClick={closeForm}
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: '1px solid var(--color-card-border)',
                    background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {t('portal.announces.form.cancel')}
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '0.625rem', borderRadius: '0.625rem', border: 'none',
                    background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                    color: '#fff', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  {editingAnnounce ? t('portal.announces.form.submitEdit') : t('portal.announces.form.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats popup modal */}
      {statsAnnounce && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '1rem', zIndex: 100,
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: 420, padding: '1.5rem', position: 'relative', background: 'var(--color-bg)' }}>
            <button
              onClick={() => setStatsAnnounce(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.25rem' }}>
              {t('portal.announces.stats.title')}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '0 0 1.5rem' }}>
              {statsAnnounce.title}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                { icon: Eye, label: t('portal.announces.stats.views'), value: STATS_FIXED.views },
                { icon: MessageCircle, label: t('portal.announces.stats.contacts'), value: STATS_FIXED.contacts },
                { icon: Heart, label: t('portal.announces.stats.favorites'), value: STATS_FIXED.favorites },
                { icon: Calendar, label: t('portal.announces.stats.daysOnline'), value: STATS_FIXED.daysOnline },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  padding: '1rem', borderRadius: '0.75rem',
                  background: 'rgba(43, 127, 255, 0.05)',
                  border: '1px solid var(--color-card-border)',
                  display: 'flex', gap: '0.75rem', alignItems: 'center',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '0.5rem',
                    background: 'rgba(43, 127, 255, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={18} color="var(--color-blue-primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0 0 0.1rem', fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setStatsAnnounce(null)
                navigate(`/dashboard/announces/${statsAnnounce.id}/stats`, { state: { announce: statsAnnounce } })
              }}
              style={{
                width: '100%', padding: '0.625rem', borderRadius: '0.625rem', border: 'none',
                background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem',
              }}
            >
              {t('portal.announces.stats.viewFull')} →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
