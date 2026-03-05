import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Eye, MessageCircle, Heart, Calendar, TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

const VIEWS_VALUES = [12,8,15,20,18,25,30,22,14,19,28,35,30,24,18,22,28,32,20,15,25,30,28,22,18,24,30,26,20,16]
const CONTACTS_VALUES = [0,1,0,2,1,0,3,1,2,0,1,4,2,1,0,3,2,1,5,2,1,0,3,2,4,1,0,2,1,3]

const CHART_DATA = (() => {
  const today = new Date()
  return VIEWS_VALUES.map((value, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (29 - i))
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return { date: `${day}/${month}`, views: value, contacts: CONTACTS_VALUES[i] }
  })
})()

const TOTAL_VIEWS = VIEWS_VALUES.reduce((a, b) => a + b, 0)
const TOTAL_CONTACTS = CONTACTS_VALUES.reduce((a, b) => a + b, 0)
const DAYS_ONLINE = 14
const FAVORITES = 56
const CONVERSION_RATE = ((TOTAL_CONTACTS / TOTAL_VIEWS) * 100).toFixed(1)

const SOURCES = [
  { label: 'App mobile', percent: 62 },
  { label: 'Web', percent: 28 },
  { label: 'Partage direct', percent: 10 },
]

export default function AnnounceStatsPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const announce = state?.announce

  const STAT_CARDS = [
    { icon: Eye, label: t('portal.announces.stats.views'), value: TOTAL_VIEWS },
    { icon: MessageCircle, label: t('portal.announces.stats.contacts'), value: TOTAL_CONTACTS },
    { icon: Heart, label: t('portal.announces.stats.favorites'), value: FAVORITES },
    { icon: Calendar, label: t('portal.announces.stats.daysOnline'), value: DAYS_ONLINE },
    { icon: TrendingUp, label: t('portal.announces.stats.conversionRate'), value: `${CONVERSION_RATE}%` },
  ]

  const chartStyle = {
    contentStyle: {
      background: 'var(--color-card-bg)',
      border: '1px solid var(--color-card-border)',
      borderRadius: '0.5rem',
      color: 'var(--color-text-primary)',
    },
  }

  return (
    <div className="dash-page-content">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/dashboard/announces')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.875rem', borderRadius: '0.625rem',
            border: '1px solid var(--color-card-border)', background: 'transparent',
            color: 'var(--color-text-secondary)', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.25rem',
          }}
        >
          <ArrowLeft size={16} />
          {t('portal.announces.stats.backToList')}
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.25rem' }}>
          {t('portal.announces.stats.title')}
        </h1>
        {announce && (
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {announce.title}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        {STAT_CARDS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '0.625rem',
              background: 'rgba(43, 127, 255, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={18} color="var(--color-blue-primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', margin: '0 0 0.2rem' }}>
                {label}
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {/* Views chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ margin: '0 0 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>
            {t('portal.announces.stats.viewsChart')}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2B7FFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2B7FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-card-border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip {...chartStyle} formatter={(value) => [value, t('portal.announces.stats.views')]} />
              <Area type="monotone" dataKey="views" stroke="#2B7FFF" strokeWidth={2} fill="url(#viewsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Contacts chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <p style={{ margin: '0 0 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>
            {t('portal.announces.stats.contactsChart')}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="contactsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-card-border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip {...chartStyle} formatter={(value) => [value, t('portal.announces.stats.contacts')]} />
              <Area type="monotone" dataKey="contacts" stroke="#10b981" strokeWidth={2} fill="url(#contactsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Traffic sources */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <p style={{ margin: '0 0 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>
          {t('portal.announces.stats.sources')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {SOURCES.map(({ label, percent }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{percent}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--color-card-border)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${percent}%`,
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #2B7FFF 0%, #8EC5FF 100%)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
