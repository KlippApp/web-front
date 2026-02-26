const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        <path d="M11 8a3 3 0 100 6"/>
      </svg>
    ),
    title: 'AI-Powered Search',
    description: 'Describe your dream home in plain language. Our AI understands what you want and surfaces the best matches instantly.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.899L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
      </svg>
    ),
    title: 'Virtual Tours',
    description: 'Walk through any property from your couch. Immersive 3D tours let you explore every room in stunning detail.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Market Insights',
    description: 'Real-time price trends, neighborhood scores, and investment forecasts help you make confident decisions.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    title: 'Instant Alerts',
    description: 'Never miss a listing. Get push notifications the moment a home matching your criteria hits the market.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Agent Connect',
    description: 'Message verified local agents directly in-app. Schedule viewings and negotiate offers without leaving Klipp.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Neighborhood Guide',
    description: 'Schools, transit, restaurants, safety scores — everything you need to evaluate a location at a glance.',
  },
]

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-6 py-24">
      {/* Section header */}
      <div className="text-center mb-16">
        <p style={{ color: '#2B7FFF', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Features
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Everything you need to find home
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
          Powerful tools designed to make your property search faster, smarter, and less stressful.
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
