import { useTranslation } from 'react-i18next'
import { ArrowUp, Heart, Bookmark, Phone, MessageSquare, Mail, Search, Upload } from 'lucide-react'

function Vignette({ children }) {
  return (
    <div className="h-52 rounded-3xl bg-(--color-ink) border border-(--color-line) text-white flex items-center justify-center p-6" aria-hidden="true">
      {children}
    </div>
  )
}

function SwipeVignette() {
  return (
    <div className="relative w-28 h-40">
      <div className="absolute inset-x-2 -top-3 h-full rounded-2xl bg-white/10" />
      <div className="absolute inset-0 rounded-2xl bg-white/20 flex items-end p-3">
        <div className="w-full space-y-1.5">
          <div className="h-2.5 w-3/4 rounded bg-white/80" />
          <div className="h-2 w-1/2 rounded bg-white/40" />
        </div>
      </div>
      <ArrowUp className="absolute -right-9 top-1/2 -translate-y-1/2 text-(--color-accent-light)" size={26} />
    </div>
  )
}

function KeepVignette({ t }) {
  return (
    <div className="flex items-center gap-5">
      <span className="w-14 h-14 rounded-full bg-(--color-accent) flex items-center justify-center">
        <Heart size={26} fill="currentColor" />
      </span>
      <div className="space-y-2 text-sm">
        {[t('how.collectionA'), t('how.collectionB')].map(name => (
          <div key={name} className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <Bookmark size={14} />{name}
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactVignette({ t }) {
  return (
    <div className="flex gap-3">
      {[['call', Phone], ['message', MessageSquare], ['email', Mail]].map(([key, Icon]) => (
        <div key={key} className="flex flex-col items-center gap-2 text-xs">
          <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center"><Icon size={20} /></span>
          {t(`how.${key}`)}
        </div>
      ))}
    </div>
  )
}

const STEPS = [
  { key: 'swipe', Vignette: SwipeVignette },
  { key: 'keep', Vignette: KeepVignette },
  { key: 'contact', Vignette: ContactVignette },
]

export default function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section id="how" className="bg-(--color-surface)">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h2 className="font-extrabold text-[clamp(2.25rem,5vw,3.75rem)] leading-[1] tracking-[-0.035em] max-w-3xl">
          {t('how.title')}<span className="brand-dot">.</span>
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-(--color-text-secondary)">{t('how.subtitle')}</p>

        <ol className="mt-16 grid md:grid-cols-3 gap-10 list-none p-0">
          {STEPS.map(({ key, Vignette: Content }, i) => (
            <li key={key}>
              <Vignette><Content t={t} /></Vignette>
              <h3 className="mt-6 flex items-baseline gap-3 text-2xl font-bold tracking-tight">
                <span className="text-base font-semibold text-(--color-accent)">{i + 1}</span>
                {t(`how.steps.${key}.title`)}
              </h3>
              <p className="mt-2 leading-relaxed text-(--color-text-secondary)">{t(`how.steps.${key}.description`)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 border-t border-(--color-line) pt-8 grid md:grid-cols-[12rem_1fr_1fr] gap-8">
          <h3 className="font-semibold">{t('how.alsoTitle')}</h3>
          {[['searches', Search], ['publish', Upload]].map(([key, Icon]) => (
            <div key={key} className="flex gap-3">
              <Icon size={20} className="mt-0.5 shrink-0 text-(--color-accent)" />
              <div>
                <p className="font-semibold">{t(`how.also.${key}.title`)}</p>
                <p className="mt-1 text-sm leading-relaxed text-(--color-text-secondary)">{t(`how.also.${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
