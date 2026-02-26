const sizes = {
  sm: { width: 180, height: 360 },
  md: { width: 240, height: 480 },
  lg: { width: 280, height: 560 },
}

export default function IPhoneMockup({ src, alt = 'App screenshot', size = 'md' }) {
  const { width, height } = sizes[size] || sizes.md

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: '2.8rem',
        background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%)',
        border: '3px solid rgba(255,255,255,0.25)',
        boxShadow: [
          'inset 0 0 0 1px rgba(255,255,255,0.08)',
          '0 0 0 1px var(--color-iphone-ring)',
          '0 32px 64px var(--color-iphone-drop)',
          '0 0 80px rgba(43,127,255,0.12)',
        ].join(', '),
        flexShrink: 0,
      }}
    >
      {/* Screen area */}
      <div
        style={{
          position: 'absolute',
          inset: '6px',
          borderRadius: '2.3rem',
          overflow: 'hidden',
          background: '#0a0a0a',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(160deg, rgba(43,127,255,0.3) 0%, rgba(142,197,255,0.1) 50%, rgba(43,127,255,0.05) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="rgba(43,127,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="rgba(43,127,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              SCREENSHOT
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 90,
          height: 28,
          background: '#000',
          borderRadius: '1rem',
          zIndex: 10,
        }}
      />

      {/* Power button (right side) */}
      <div
        style={{
          position: 'absolute',
          right: -5,
          top: '28%',
          width: 3,
          height: 56,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '0 2px 2px 0',
        }}
      />

      {/* Volume buttons (left side) */}
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: '22%',
          width: 3,
          height: 28,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: '34%',
          width: 3,
          height: 28,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '2px 0 0 2px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: '46%',
          width: 3,
          height: 28,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '2px 0 0 2px',
        }}
      />
    </div>
  )
}
