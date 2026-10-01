import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Users, MapPin, Building2, ChevronDown } from 'lucide-react'
import DashboardPreview from '../components/DashboardPreview.jsx'

const STEPS = ['account', 'offices', 'agents', 'publish']

const PORTAL = [
  { key: 'dashboard', Icon: LayoutDashboard },
  { key: 'agents', Icon: Users },
  { key: 'offices', Icon: MapPin },
  { key: 'profile', Icon: Building2 },
]

const FAQ = ['app', 'existing', 'offices', 'delete']

const headingClass = 'font-extrabold text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] tracking-[-0.035em]'

function AccountLinks() {
  const { t } = useTranslation()
  return (
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
  )
}

export default function AgenciesPage() {
  const { t } = useTranslation()

  return (
    <>
      <section className="on-ink">
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 md:pb-28 grid md:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
          <div>
            <h1 className="font-extrabold text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.98] tracking-[-0.04em]">
              {t('agenciesPage.title')}<span className="brand-dot">.</span>
            </h1>
            <p className="mt-7 max-w-[32rem] text-lg leading-relaxed text-(--color-text-secondary)">{t('agenciesPage.subtitle')}</p>
            <AccountLinks />
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="bg-(--color-surface)">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <h2 className={headingClass}>{t('agenciesPage.stepsTitle')}<span className="brand-dot">.</span></h2>
          <ol className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 list-none p-0">
            {STEPS.map((key, i) => (
              <li key={key} className="border-t-2 border-(--color-accent) pt-5">
                <p className="text-sm font-semibold text-(--color-accent)">{i + 1}</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight">{t(`agenciesPage.steps.${key}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-(--color-text-secondary)">{t(`agenciesPage.steps.${key}.description`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-(--color-surface-alt)">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <h2 className={headingClass}>{t('agenciesPage.portalTitle')}<span className="brand-dot">.</span></h2>
          <ul className="mt-14 grid md:grid-cols-2 gap-x-14 gap-y-10 list-none p-0">
            {PORTAL.map(({ key, Icon }) => (
              <li key={key} className="flex gap-4">
                <Icon size={24} strokeWidth={1.75} className="mt-1 shrink-0 text-(--color-accent)" />
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{t(`agenciesPage.portal.${key}.title`)}</h3>
                  <p className="mt-2 leading-relaxed text-(--color-text-secondary)">{t(`agenciesPage.portal.${key}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-(--color-surface)">
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
          <h2 className={headingClass}>{t('agenciesPage.faqTitle')}</h2>
          <div className="mt-12 border-t border-(--color-line)">
            {FAQ.map(key => (
              <details key={key} className="group border-b border-(--color-line) py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {t(`agenciesPage.faq.${key}.q`)}
                  <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-(--color-text-secondary)">{t(`agenciesPage.faq.${key}.a`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="on-ink">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <h2 className="font-extrabold text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
            {t('agenciesPage.ctaTitle')}<span className="brand-dot">.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-(--color-text-secondary)">{t('agenciesPage.ctaSubtitle')}</p>
          <AccountLinks />
        </div>
      </section>
    </>
  )
}
