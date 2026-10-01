import { useTranslation } from 'react-i18next'

const DOT = {
  online: 'var(--color-input-success)',
  processing: 'var(--color-accent-light)',
  error: 'var(--color-input-error)',
}

export default function ListingStatus({ status, style }) {
  const { t } = useTranslation()
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
      padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600,
      background: 'color-mix(in srgb, var(--color-ink) 70%, transparent)', color: 'var(--color-paper)',
      ...style,
    }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: DOT[status] }} />
      {t(`portal.listings.status.${status}`)}
    </span>
  )
}
