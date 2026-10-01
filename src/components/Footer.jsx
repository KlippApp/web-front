import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo.jsx'
import { useLocalizedPath } from '../hooks/useLocalizedPath.js'

export default function Footer() {
  const { t } = useTranslation()
  const localize = useLocalizedPath()
  const year = new Date().getFullYear()

  const links = [
    { label: t('footer.links.How it works'), href: '#how' },
    { label: t('footer.links.Agency portal'), to: '/login' },
    { label: t('footer.links.Privacy Policy'), to: localize('/privacy') },
    { label: t('footer.links.Terms of Service'), to: localize('/terms') },
    { label: t('footer.links.Cookie Policy'), to: `${localize('/privacy')}#cookies` },
  ]

  return (
    <footer className="bg-(--color-surface) border-t border-(--color-line)">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <div className="flex items-center gap-2">
            <Logo size={24} />
            <span className="font-bold text-(--color-logo-text)">Klipp</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-(--color-text-secondary)">{t('footer.description')}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map(link => {
            const className = 'text-(--color-text-secondary) no-underline hover:text-(--color-text-primary)'
            return link.to
              ? <Link key={link.label} to={link.to} className={className}>{link.label}</Link>
              : <a key={link.label} href={link.href} className={className}>{link.label}</a>
          })}
        </nav>
      </div>
      <p className="max-w-6xl mx-auto px-6 pb-10 text-xs text-(--color-copyright)">{t('footer.copyright', { year })}</p>
    </footer>
  )
}
