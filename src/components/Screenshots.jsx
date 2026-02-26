import { useTranslation } from 'react-i18next'
import IPhoneMockup from './IPhoneMockup.jsx'
import screen1 from '../assets/screenshots/screen1.png'
import screen2 from '../assets/screenshots/screen2.png'
import screen3 from '../assets/screenshots/screen3.png'

export default function Screenshots() {
  const { t } = useTranslation()

  return (
    <section id="screenshots" className="py-24 overflow-hidden" style={{ background: 'var(--color-section-stripe)' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <p style={{ color: '#2B7FFF', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            {t('nav.screenshots')}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            {t('screenshots.title')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            {t('screenshots.subtitle')}
          </p>
        </div>

        {/* Three iPhones */}
        <div className="flex items-end justify-center gap-4 md:gap-8">
          {/* Left phone — hidden on mobile */}
          <div
            className="hidden md:block"
            style={{
              transform: 'translateY(2rem) scale(0.9)',
              opacity: 0.8,
              transition: 'all 0.3s ease',
            }}
          >
            <IPhoneMockup src={screen2} alt="Klipp search screen" size="md" />
          </div>

          {/* Center phone */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Glow beneath center phone */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '260px',
                height: '120px',
                background: 'radial-gradient(ellipse, var(--color-screenshots-glow) 0%, transparent 70%)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
            <IPhoneMockup src={screen1} alt="Klipp home screen" size="lg" />
          </div>

          {/* Right phone — hidden on mobile */}
          <div
            className="hidden md:block"
            style={{
              transform: 'translateY(2rem) scale(0.9)',
              opacity: 0.8,
              transition: 'all 0.3s ease',
            }}
          >
            <IPhoneMockup src={screen3} alt="Klipp property detail screen" size="md" />
          </div>
        </div>
      </div>
    </section>
  )
}
