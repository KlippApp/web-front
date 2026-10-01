import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, Clapperboard, ChartColumn } from 'lucide-react'
import DashboardPreview from './DashboardPreview.jsx'
import { useLocalizedPath } from '../hooks/useLocalizedPath.js'

const POINTS = [
  { key: 'team', Icon: Users },
  { key: 'video', Icon: Clapperboard },
  { key: 'stats', Icon: ChartColumn },
]

export default function Agencies() {
  const { t } = useTranslation()
  const localize = useLocalizedPath()

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
            <Link to={localize('/agences')} className="font-semibold text-(--color-text-primary) underline-offset-4 hover:underline">
              {t('agenciesPage.learnMore')}
            </Link>
          </div>
        </div>

        <DashboardPreview />
      </div>
    </section>
  )
}
