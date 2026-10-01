import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Heart, Bookmark, Share2, MapPin, BedDouble, Bath, Ruler, Play } from 'lucide-react'
import IPhoneMockup from './IPhoneMockup.jsx'

const LISTINGS = [
  { type: 'sale', price: 450000, location: 'Paris 15e', bedrooms: 3, bathrooms: 2, surface: 85 },
  { type: 'rent', price: 1250, location: 'Lyon 6e', bedrooms: 2, bathrooms: 1, surface: 64 },
  { type: 'sale', price: 329000, location: 'Nantes', bedrooms: 4, bathrooms: 2, surface: 120 },
  { type: 'rent', price: 890, location: 'Bordeaux', bedrooms: 1, bathrooms: 1, surface: 38 },
]

const SWIPE_EVERY_MS = 3200

export default function Feed() {
  const { t, i18n } = useTranslation()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex(i => (i + 1) % LISTINGS.length), SWIPE_EVERY_MS)
    return () => clearInterval(id)
  }, [paused])

  const price = new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

  return (
    <div
      role="img"
      aria-label={t('feed.label')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <IPhoneMockup>
        <div className="feed-track" style={{ transform: `translateY(-${index * 100}%)` }}>
          {LISTINGS.map((listing, i) => (
            <div key={i} className="feed-item" aria-hidden="true">
              <span className="absolute top-[13%] left-5 rounded-full bg-white text-black text-xs font-semibold px-3 py-1">
                {t(`feed.${listing.type}`)}
              </span>

              <div className="absolute inset-0 flex items-center justify-center">
                <Play size={44} fill="currentColor" strokeWidth={0} style={{ opacity: 0.85 }} />
              </div>

              <div className="absolute right-3 top-[28%] flex flex-col items-center gap-3 text-[0.65rem]">
                {[['like', Heart], ['collections', Bookmark], ['share', Share2]].map(([key, Icon]) => (
                  <div key={key} className="flex flex-col items-center gap-1">
                    <span className="feed-action"><Icon size={20} /></span>
                    {t(`feed.${key}`)}
                  </div>
                ))}
              </div>

              <div className="absolute left-5 right-5 bottom-6">
                <p className="text-[1.65rem] font-extrabold leading-none tracking-tight whitespace-nowrap">
                  {price.format(listing.price)}
                  {listing.type === 'rent' && <span className="text-base font-semibold">{t('feed.perMonth')}</span>}
                </p>
                <p className="mt-2 text-[1.05rem] font-semibold leading-snug">{t(`feed.items.${i}.title`)}</p>
                <p className="mt-2 flex items-center gap-1 text-sm opacity-90"><MapPin size={14} />{listing.location}</p>
                <p className="mt-2 flex items-center gap-3 text-xs opacity-90">
                  <span className="flex items-center gap-1"><BedDouble size={14} />{t('feed.bedrooms', { count: listing.bedrooms })}</span>
                  <span className="flex items-center gap-1"><Bath size={14} />{t('feed.bathrooms', { count: listing.bathrooms })}</span>
                  <span className="flex items-center gap-1"><Ruler size={14} />{listing.surface} m²</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </IPhoneMockup>
    </div>
  )
}
