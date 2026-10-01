import { useTranslation } from 'react-i18next'
import appleBadge from '../assets/app-store-badge.svg'
import googleBadge from '../assets/google-play-badge.svg'

export default function StoreButton({ store = 'apple', href }) {
  const { t } = useTranslation()
  const isApple = store === 'apple'
  const badge = (
    <img
      src={isApple ? appleBadge : googleBadge}
      alt={isApple ? t('download.appStore') : t('download.googlePlay')}
      style={{ display: 'block', height: 40, width: 'auto' }}
    />
  )

  if (!href) {
    return (
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span style={{ display: 'block', opacity: 0.45, filter: 'grayscale(1)' }}>{badge}</span>
        <span
          style={{
            position: 'absolute',
            top: -14,
            right: -6,
            padding: '0.1rem 0.45rem',
            borderRadius: '1rem',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          {t('download.comingSoon')}
        </span>
      </span>
    )
  }

  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        transition: 'transform 0.2s ease, filter 0.2s ease',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(105,92,246,0.3))'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.filter = ''
      }}
    >
      {badge}
    </a>
  )
}
