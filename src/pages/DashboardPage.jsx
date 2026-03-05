import { useTranslation } from 'react-i18next'
import { MessageCircle, Home, TrendingUp } from 'lucide-react'
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

const STATS = [
  { key: 'messages', icon: MessageCircle },
  { key: 'activeListings', icon: Home },
  { key: 'monthlySales', icon: TrendingUp },
]

const FIXED_VALUES = [0,1,0,2,1,0,3,1,2,0,1,4,2,1,0,3,2,1,5,2,1,0,3,2,4,1,0,2,1,3]

const CHART_DATA = (() => {
  const today = new Date()
  return FIXED_VALUES.map((value, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (29 - i))
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return { date: `${day}/${month}`, value }
  })
})()

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {STATS.map(({ key, icon: Icon }) => (
          <div key={key} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{
              width: 40, height: 40, borderRadius: '0.625rem',
              background: 'rgba(43, 127, 255, 0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color="var(--color-blue-primary)" />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)', margin: '0 0 0.25rem' }}>
                {t(`portal.dashboard.stats.${key}.label`)}
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                {t(`portal.dashboard.stats.${key}.value`)}
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
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={CHART_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2B7FFF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2B7FFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-card-border)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)',
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#2B7FFF" strokeWidth={2} fill="url(#salesGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
