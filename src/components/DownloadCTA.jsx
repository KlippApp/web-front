import StoreButton from './StoreButton.jsx'

export default function DownloadCTA() {
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
            background: 'linear-gradient(135deg, var(--color-overlay-gradient) 0%, rgba(142,197,255,0.05) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '1.25rem',
              background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '1rem',
            }}
          >
            Start your search today
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
            Download Klipp free and find your perfect property. No subscription required.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <StoreButton store="apple" href="#app-store" />
            <StoreButton store="google" href="#play-store" />
          </div>

          <p style={{ color: 'var(--color-text-dim)', fontSize: '0.78rem' }}>
            Free to download · Available on iOS 16+ & Android 8+
          </p>
        </div>
      </div>
    </section>
  )
}
