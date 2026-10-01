import { useTranslation } from 'react-i18next'
import StoreButton from './StoreButton.jsx'

export default function DownloadCTA() {
  const { t } = useTranslation()

  return (
    <section id="download" className="on-ink">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row md:items-end md:justify-between gap-12">
        <div className="max-w-2xl">
          <img src="/favicon.svg" alt="" width={56} height={56} className="mb-8" />
          <h2 className="font-extrabold text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.04em]">
            {t('download.title')}<span className="brand-dot">.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-(--color-text-secondary)">{t('download.subtitle')}</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-4">
            <StoreButton store="apple" />
            <StoreButton store="google" />
          </div>
          <p className="mt-4 text-sm text-(--color-text-secondary)">{t('download.disclaimer')}</p>
        </div>
      </div>
    </section>
  )
}
