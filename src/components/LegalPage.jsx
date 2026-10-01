import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import LEGAL_INFO from '../config/legal.js'
import { useLocalizedPath } from '../hooks/useLocalizedPath.js'

const relatedDocs = {
  privacy: { to: '/terms', labelKey: 'footer.links.Terms of Service' },
  terms: { to: '/privacy', labelKey: 'footer.links.Privacy Policy' },
}

export default function LegalPage({ doc, sections }) {
  const { t, i18n } = useTranslation()
  const { hash } = useLocation()
  const localize = useLocalizedPath()

  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1))
    if (target) {
      target.scrollIntoView?.()
    } else {
      window.scrollTo(0, 0)
    }
  }, [doc, hash])

  const lastUpdated = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' })
    .format(new Date(LEGAL_INFO.lastUpdated))
  const related = relatedDocs[doc]

  return (
    <div style={{ minHeight: '100vh', padding: '3rem 1rem', background: 'var(--color-bg)' }}>
      <article className="glass-card" style={{ maxWidth: 760, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <Link
          to={localize('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.target.style.color = 'var(--color-text-primary)' }}
          onMouseLeave={e => { e.target.style.color = 'var(--color-text-secondary)' }}
        >
          <ChevronLeft size={16} />
          {t('portal.backToHome')}
        </Link>

        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          {t(`legal.${doc}.title`)}
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {t('legal.lastUpdated', { date: lastUpdated })}
        </p>
        <p style={{ color: 'var(--color-text-primary)', lineHeight: 1.7, marginBottom: '2rem' }}>
          {t(`legal.${doc}.intro`, LEGAL_INFO)}
        </p>

        {sections.map(id => (
          <section key={id} id={id} style={{ marginBottom: '2rem', scrollMarginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.75rem' }}>
              {t(`legal.${doc}.sections.${id}.title`)}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {t(`legal.${doc}.sections.${id}.body`, LEGAL_INFO)}
            </p>
          </section>
        ))}

        <div style={{ borderTop: '1px solid var(--color-divider)', paddingTop: '1.5rem' }}>
          <Link to={localize(related.to)} style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            {t(related.labelKey)}
          </Link>
        </div>
      </article>
    </div>
  )
}
