import { useTranslation } from 'react-i18next'
import { Clapperboard, MapPin, Phone, Heart, Search, Upload } from 'lucide-react'

export default function Features() {
  const { t } = useTranslation()

  const features = [
    { key: 'video', Icon: Clapperboard },
    { key: 'nearby', Icon: MapPin },
    { key: 'contact', Icon: Phone },
    { key: 'favorites', Icon: Heart },
    { key: 'searches', Icon: Search },
    { key: 'publish', Icon: Upload },
  ].map(({ key, Icon }) => ({
    icon: <Icon size={24} strokeWidth={1.5} />,
    title: t(`features.list.${key}.title`),
    description: t(`features.list.${key}.description`),
  }))

  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="text-center mb-16">
        <p style={{ color: '#695CF6', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          {t('features.tag')}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          {t('features.title')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('features.subtitle')}
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <article
            key={i}
            className="glass-card p-6"
            style={{
              transition: 'border-color 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-card-hover-border)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-card-border)'}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '0.75rem',
                background: 'var(--color-icon-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: 'var(--color-icon-color)',
              }}
            >
              {feature.icon}
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              {feature.title}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
