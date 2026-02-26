import { useTranslation } from 'react-i18next'

export default function Testimonials() {
  const { t } = useTranslation()

  const testimonials = [
    {
      stars: 5,
      quote: t('testimonials.list.0.quote'),
      name: 'Sarah K.',
      role: t('testimonials.list.0.role'),
      initials: 'SK',
      color: '#2B7FFF',
    },
    {
      stars: 5,
      quote: t('testimonials.list.1.quote'),
      name: 'Marcus T.',
      role: t('testimonials.list.1.role'),
      initials: 'MT',
      color: '#7C3AED',
    },
    {
      stars: 5,
      quote: t('testimonials.list.2.quote'),
      name: 'Priya M.',
      role: t('testimonials.list.2.role'),
      initials: 'PM',
      color: '#059669',
    },
  ]

  return (
    <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="text-center mb-16">
        <p style={{ color: '#2B7FFF', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          {t('nav.reviews')}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          {t('testimonials.title')}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
          {t('testimonials.subtitle')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4">
            {/* Stars */}
            <div style={{ color: '#F59E0B', fontSize: '1rem', letterSpacing: '0.1em' }}>
              {'★'.repeat(t.stars)}
            </div>

            {/* Quote */}
            <blockquote
              style={{
                color: 'var(--color-text-quote)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                fontStyle: 'italic',
                margin: 0,
                flex: 1,
              }}
            >
              "{t.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid var(--color-divider)' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: t.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  flexShrink: 0,
                  color: 'var(--color-avatar-initials)',
                }}
              >
                {t.initials}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
