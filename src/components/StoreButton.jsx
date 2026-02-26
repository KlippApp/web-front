import { useTranslation } from 'react-i18next'
import appleBadge from '../assets/app-store-badge.svg'
import googleBadge from '../assets/google-play-badge.svg'

export default function StoreButton({ store = 'apple', href = '#' }) {
  const { t } = useTranslation()
  const isApple = store === 'apple'

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
        e.currentTarget.style.filter = 'drop-shadow(0 8px 20px rgba(43,127,255,0.3))'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.filter = ''
      }}
    >
      <img
        src={isApple ? appleBadge : googleBadge}
        alt={isApple ? t('download.appStore') : t('download.googlePlay')}
        style={{ display: 'block', height: 40, width: 'auto' }}
      />
    </a>
  )
}
