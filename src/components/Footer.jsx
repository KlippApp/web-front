import StoreButton from './StoreButton.jsx'
import appleBadge from '../assets/app-store-badge.svg'
import googleBadge from '../assets/google-play-badge.svg'

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Screenshots', href: '#screenshots' },
    { label: 'Pricing', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '2rem' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #2B7FFF 0%, #8EC5FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="9 22 9 12 15 12 15 22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Klipp</span>
            </div>
            <p style={{ color: '#D1D5DC', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '220px' }}>
              Find your perfect home with AI-powered search and real-time market insights.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', color: '#fff' }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        color: '#D1D5DC',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={e => e.target.style.color = '#fff'}
                      onMouseLeave={e => e.target.style.color = '#D1D5DC'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
            © {year} Klipp. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#app-store"
              style={{ display: 'inline-block', opacity: 0.6, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
              <img src={appleBadge} alt="Download on the App Store" height="28" style={{ display: 'block' }} />
            </a>
            <a
              href="#play-store"
              style={{ display: 'inline-block', opacity: 0.6, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
              <img src={googleBadge} alt="Get it on Google Play" height="28" style={{ display: 'block' }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
