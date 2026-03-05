import { useTranslation } from 'react-i18next'

export default function ProfilePage() {
  const { t } = useTranslation()
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--color-text-primary)', margin: '0 0 0.5rem' }}>{t('portal.profile.title')}</h2>
      <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{t('portal.profile.comingSoon')}</p>
    </div>
  )
}
