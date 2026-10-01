import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, Clapperboard, ChartColumn } from 'lucide-react'

const POINTS = [
  { key: 'team', Icon: Users },
  { key: 'video', Icon: Clapperboard },
  { key: 'stats', Icon: ChartColumn },
]

export default function Agencies() {
  const { t } = useTranslation()

  return (
    <section id="agencies" className="max-w-6xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          {t('agencies.tag')}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          {t('agencies.title')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('agencies.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {POINTS.map(({ key, Icon }) => (
          <article key={key} className="glass-card p-6">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '0.75rem',
                background: 'var(--color-icon-bg)',
                color: 'var(--color-icon-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              {t(`agencies.points.${key}.title`)}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {t(`agencies.points.${key}.description`)}
            </p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/register"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, #695CF6 0%, #B7AFFB 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            textDecoration: 'none',
          }}
        >
          {t('agencies.register')}
        </Link>
        <Link
          to="/login"
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--color-portal-border)',
            background: 'var(--color-portal-bg)',
            color: 'var(--color-text-primary)',
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
          }}
        >
          {t('agencies.login')}
        </Link>
      </div>
    </section>
  )
}
