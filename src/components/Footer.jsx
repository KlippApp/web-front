import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import appleBadge from '../assets/app-store-badge.svg'
import googleBadge from '../assets/google-play-badge.svg'
import Logo from './Logo.jsx'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const footerLinks = {
    [t('footer.sections.Product')]: [
      { label: t('footer.links.Features'), href: '#features' },
      { label: t('footer.links.Screenshots'), href: '#screenshots' },
      { label: t('footer.links.Pricing'), href: '#' },
      { label: t('footer.links.Changelog'), href: '#' },
    ],
    [t('footer.sections.Company')]: [
      { label: t('footer.links.About'), href: '#' },
      { label: t('footer.links.Blog'), href: '#' },
      { label: t('footer.links.Careers'), href: '#' },
      { label: t('footer.links.Press'), href: '#' },
    ],
    [t('footer.sections.Legal')]: [
      { label: t('footer.links.Privacy Policy'), to: '/privacy' },
      { label: t('footer.links.Terms of Service'), to: '/terms' },
      { label: t('footer.links.Cookie Policy'), to: '/privacy#cookies' },
    ],
  }

  return (
    <footer style={{ borderTop: '1px solid var(--color-divider)', marginTop: '2rem' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-logo-text)' }}>Klipp</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '220px' }}>
              {t('footer.description')}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-footer-heading)' }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {links.map(link => {
                  const LinkTag = link.to ? Link : 'a'
                  return (
                    <li key={link.label}>
                      <LinkTag
                        {...(link.to ? { to: link.to } : { href: link.href })}
                        style={{
                          color: 'var(--color-footer-link)',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.color = 'var(--color-footer-link-hover)'}
                        onMouseLeave={e => e.target.style.color = 'var(--color-footer-link)'}
                      >
                        {link.label}
                      </LinkTag>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-divider)',
            paddingTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p style={{ color: 'var(--color-copyright)', fontSize: '0.8rem' }}>
            {t('footer.copyright', { year })}
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#app-store"
              style={{ display: 'inline-block', opacity: 0.6, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
              <img src={appleBadge} alt={t('download.appStore')} style={{ display: 'block', height: 28, width: 'auto' }} />
            </a>
            <a
              href="#play-store"
              style={{ display: 'inline-block', opacity: 0.6, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
            >
              <img src={googleBadge} alt={t('download.googlePlay')} style={{ display: 'block', height: 28, width: 'auto' }} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
