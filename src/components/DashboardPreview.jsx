import { useTranslation } from 'react-i18next'
import { Users, Home, Heart } from 'lucide-react'

const PREVIEW_STATS = [
  { key: 'activeListings', Icon: Home, value: 24 },
  { key: 'likes', Icon: Heart, value: 1284 },
  { key: 'agents', Icon: Users, value: 6 },
]

// Illustrative daily likes for the preview chart, 30 days
const PREVIEW_LIKES = [18, 22, 15, 30, 26, 34, 28, 20, 25, 38, 41, 33, 29, 45, 52, 40, 36, 48, 55, 47, 43, 58, 61, 50, 46, 63, 70, 57, 66, 74]

export default function DashboardPreview() {
  const { t, i18n } = useTranslation()
  const max = Math.max(...PREVIEW_LIKES)
  const number = new Intl.NumberFormat(i18n.language)

  return (
    <figure className="m-0">
      <div className="rounded-3xl bg-(--color-panel) border border-(--color-line) p-6 shadow-(--shadow-panel)" aria-hidden="true">
        <div className="grid grid-cols-3 gap-3">
          {PREVIEW_STATS.map(({ key, Icon, value }) => (
            <div key={key} className="rounded-2xl bg-(--color-surface-alt) p-3">
              <Icon size={16} className="text-(--color-accent)" />
              <p className="mt-3 text-2xl font-extrabold tracking-tight">{number.format(value)}</p>
              <p className="mt-1 text-[0.7rem] leading-tight text-(--color-text-secondary)">{t(`portal.dashboard.stats.${key}.label`)}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm font-semibold">{t('portal.dashboard.chart.title')}</p>
        <div className="mt-3 h-28 flex items-end gap-[3px]">
          {PREVIEW_LIKES.map((value, i) => (
            <span key={i} className="flex-1 rounded-t-sm bg-(--color-accent)" style={{ height: `${(value / max) * 100}%`, opacity: 0.35 + (value / max) * 0.65 }} />
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-(--color-text-secondary)">{t('agencies.previewCaption')}</figcaption>
    </figure>
  )
}
