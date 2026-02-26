import { useTranslation, Trans } from 'react-i18next'
import IPhoneMockup from './IPhoneMockup.jsx'
import StoreButton from './StoreButton.jsx'
import screen1 from '../assets/screenshots/screen1.png'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        paddingTop: '5rem',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, var(--color-hero-radial) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16 w-full">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">

          {/* Left column: text */}
          <div className="flex-1 text-center md:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6"
              style={{
                background: 'var(--color-badge-bg)',
                border: '1px solid var(--color-badge-border)',
                borderRadius: '2rem',
                padding: '0.375rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--color-badge-text)',
                letterSpacing: '0.05em',
              }}
            >
              <span style={{ fontSize: '0.65rem' }}>●</span>
              {t('hero.badge')}
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '1.5rem',
              }}
            >
              <Trans
                i18nKey="hero.headline"
                components={{
                  highlight: <span
                    style={{
                      background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  />,
                  br: <br />
                }}
              />
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                marginBottom: '2.5rem',
                maxWidth: '480px',
              }}
              className="mx-auto md:mx-0"
            >
              {t('hero.subtitle')}
            </p>

            {/* Store buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-10">
              <StoreButton store="apple" href="#app-store" />
              <StoreButton store="google" href="#play-store" />
            </div>

            {/* Stats row */}
            <div className="flex gap-8 justify-center md:justify-start">
              {[
                { value: '4.9★', label: t('hero.stats.rating') },
                { value: '50K+', label: t('hero.stats.users') },
                { value: '#1', label: t('hero.stats.market') },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: phone mockup */}
          <div
            className="flex-shrink-0 flex justify-center"
            style={{ position: 'relative' }}
          >
            {/* Ambient glow */}
            <div
              style={{
                position: 'absolute',
                bottom: '-40px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '320px',
                height: '200px',
                background: 'radial-gradient(ellipse, var(--color-hero-glow) 0%, transparent 70%)',
                filter: 'blur(24px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <IPhoneMockup src={screen1} alt={t('hero.mockupAlt')} size="lg" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
