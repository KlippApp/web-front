import { useTranslation } from 'react-i18next'
import StoreButton from './StoreButton.jsx'

export default function DownloadCTA() {
  const { t } = useTranslation()

  return (
    <section id="download" className="max-w-6xl mx-auto px-6 py-24">
      <div
        className="glass-card text-center"
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 4rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blue gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, var(--color-overlay-gradient) 0%, rgba(183,175,251,0.05) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <img
            src="/favicon.svg"
            alt=""
            width={64}
            height={64}
            style={{ display: 'block', margin: '0 auto 1.5rem' }}
          />

          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            {t('download.title')}
          </h2>

          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '400px',
              margin: '0 auto 2rem',
            }}
          >
            {t('download.subtitle')}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <StoreButton store="apple" />
            <StoreButton store="google" />
          </div>

          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>
            {t('download.disclaimer')}
          </p>
        </div>
      </div>
    </section>
  )
}
