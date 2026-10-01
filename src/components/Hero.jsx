import { useTranslation } from 'react-i18next'
import StoreButton from './StoreButton.jsx'
import Feed from './Feed.jsx'

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section id="hero" className="on-ink">
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-36 md:pb-28 grid md:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        <div>
          <h1 className="font-extrabold text-[clamp(3.25rem,9vw,6.75rem)] leading-[0.92] tracking-[-0.045em]">
            {t('hero.title')}<span className="brand-dot">.</span>
          </h1>
          <p className="mt-7 max-w-[30rem] text-lg leading-relaxed text-(--color-text-secondary)">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <StoreButton store="apple" />
            <StoreButton store="google" />
          </div>
          <p className="mt-5 text-sm text-(--color-text-secondary)">{t('hero.note')}</p>
        </div>

        <div className="flex justify-center md:justify-end">
          <Feed />
        </div>
      </div>
    </section>
  )
}
