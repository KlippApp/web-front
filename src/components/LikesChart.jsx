import { useTranslation } from 'react-i18next'
import {
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

const toChartData = (likesPerDay) =>
  likesPerDay.map(({ date, count }) => ({ date: `${date.slice(8, 10)}/${date.slice(5, 7)}`, value: count }))

export default function LikesChart({ likesPerDay, height = 240 }) {
  const { t } = useTranslation()
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={toChartData(likesPerDay)} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#695CF6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#695CF6" stopOpacity={0} />
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
          formatter={(value) => [value, t('portal.dashboard.chart.likes', { count: value })]}
          contentStyle={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-card-border)',
            borderRadius: '0.5rem',
            color: 'var(--color-text-primary)',
          }}
        />
        <Area type="monotone" dataKey="value" stroke="#695CF6" strokeWidth={2} fill="url(#likesGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
