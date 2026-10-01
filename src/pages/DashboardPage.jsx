import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Home, Heart, Users } from 'lucide-react'
import API_URL, { DEV_BYPASS, authFetch } from '../config/api.js'
import LikesChart from '../components/LikesChart.jsx'

const STATS = [
  { key: 'activeListings', field: 'active_listings', icon: Home },
  { key: 'likes', field: 'likes_last_30_days', icon: Heart },
  { key: 'agents', field: 'agents', icon: Users },
]

const EMPTY_STATS = { active_listings: 0, agents: 0, likes_last_30_days: 0, likes_per_day: [] }

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(() => (DEV_BYPASS || !API_URL ? EMPTY_STATS : null))

  useEffect(() => {
    if (DEV_BYPASS || !API_URL) return
    authFetch('/agencies/stats')
      .then(r => (r.ok ? r.json() : null))
      .then(data => data && setStats(data))
      .catch(() => {})
  }, [])

  return (
    <div className="dash-page-content">
      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {STATS.map(({ key, field, icon: Icon }) => (
          <div key={key} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '0.625rem',
              background: 'rgba(105,92,246, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', margin: '0 0 0.25rem' }}>
                {t(`portal.dashboard.stats.${key}.label`)}
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                {stats ? stats[field] : '—'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <p style={{ margin: '0 0 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>
          {t('portal.dashboard.chart.title')}
        </p>
        <LikesChart likesPerDay={stats?.likes_per_day ?? []} />
      </div>
    </div>
  )
}
