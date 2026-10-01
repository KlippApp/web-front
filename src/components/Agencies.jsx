import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, Clapperboard, ChartColumn, Home, Heart } from 'lucide-react'

const POINTS = [
  { key: 'team', Icon: Users },
  { key: 'video', Icon: Clapperboard },
  { key: 'stats', Icon: ChartColumn },
]

const PREVIEW_STATS = [
  { key: 'activeListings', Icon: Home, value: 24 },
  { key: 'likes', Icon: Heart, value: 1284 },
  { key: 'agents', Icon: Users, value: 6 },
]

// Illustrative daily likes for the preview chart, 30 days
const PREVIEW_LIKES = [18, 22, 15, 30, 26, 34, 28, 20, 25, 38, 41, 33, 29, 45, 52, 40, 36, 48, 55, 47, 43, 58, 61, 50, 46, 63, 70, 57, 66, 74]

function DashboardPreview() {
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

export default function Agencies() {
  const { t } = useTranslation()

  return (
    <section id="agencies" className="bg-(--color-surface-alt)">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <h2 className="font-extrabold text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] tracking-[-0.035em]">
            {t('agencies.title')}
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-(--color-text-secondary)">{t('agencies.subtitle')}</p>

          <ul className="mt-10 space-y-6 list-none p-0">
            {POINTS.map(({ key, Icon }) => (
              <li key={key} className="flex gap-4">
                <Icon size={22} strokeWidth={1.75} className="mt-0.5 shrink-0 text-(--color-accent)" />
                <div>
                  <h3 className="font-semibold">{t(`agencies.points.${key}.title`)}</h3>
                  <p className="mt-1 leading-relaxed text-(--color-text-secondary)">{t(`agencies.points.${key}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              to="/register"
              className="rounded-xl bg-(--color-accent) px-6 py-3 font-semibold text-white no-underline transition-colors hover:bg-(--color-accent-strong)"
            >
              {t('agencies.register')}
            </Link>
            <Link to="/login" className="font-semibold text-(--color-text-primary) underline-offset-4 hover:underline">
              {t('agencies.login')}
            </Link>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}
