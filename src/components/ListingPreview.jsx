import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Heart, MapPin } from 'lucide-react'
import { authFetch } from '../config/api.js'
import { formatDate, formatPrice, listingStatus } from '../utils/listing.js'
import ListingVideo from './ListingVideo.jsx'
import ListingStatus from './ListingStatus.jsx'
import LikesChart from './LikesChart.jsx'

const sectionTitle = { margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }

export default function ListingPreview({ listing, onClose }) {
  const { t, i18n } = useTranslation()
  const [likesPerDay, setLikesPerDay] = useState([])
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    authFetch(`/agencies/listings/${listing.uuid}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => data && setLikesPerDay(data.likes_per_day))
      .catch(() => {})
  }, [listing.uuid])

  const playbackId = listing.video?.status === 'READY' && listing.video.mux_playback_id
  const specs = [
    ['rooms', listing.rooms],
    ['bathrooms', listing.bathrooms],
    ['surface', listing.surface_sqm && `${listing.surface_sqm} m²`],
  ].filter(([, value]) => value)

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 200,
      }}
    >
      <div
        role="dialog" aria-modal="true" aria-labelledby="listing-preview-title"
        className="listing-preview"
        style={{
          background: 'var(--color-nav-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--color-card-border)', borderRadius: '1.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
      >
        <div className="listing-preview-media">
          {playbackId ? (
            <ListingVideo playbackId={playbackId} />
          ) : listing.photos[0] ? (
            <img src={listing.photos[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <p style={{ margin: 'auto', padding: '1rem', textAlign: 'center', color: 'var(--color-paper)', fontSize: '0.875rem' }}>
              {t('portal.listings.preview.noVideo')}
            </p>
          )}
        </div>

        <div className="listing-preview-body">
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={t('portal.listings.preview.close')}
            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'transparent', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>

          <ListingStatus status={listingStatus(listing)} />
          <h2 id="listing-preview-title" style={{ margin: '0.75rem 2rem 0.25rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {listing.title}
          </h2>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            {formatPrice(listing, i18n.language)}
            {listing.listing_type === 'rent' && (
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>{t('portal.listings.perMonth')}</span>
            )}
          </p>
          <p style={{ margin: '0.5rem 0 0', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            <MapPin size={14} aria-hidden="true" />
            {listing.location}
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            {t(`portal.listings.filters.${listing.listing_type}`)}
            {listing.owner && ` · ${listing.owner.name}`}
            {listing.created_at && ` · ${t('portal.listings.preview.publishedOn', { date: formatDate(listing.created_at, i18n.language) })}`}
          </p>

          {specs.length > 0 && (
            <dl style={{ display: 'flex', gap: '1.5rem', margin: '1.25rem 0 0' }}>
              {specs.map(([key, value]) => (
                <div key={key}>
                  <dt style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{t(`portal.listings.preview.${key}`)}</dt>
                  <dd style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-primary)' }}>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {listing.description && (
            <section style={{ marginTop: '1.25rem' }}>
              <h3 style={sectionTitle}>{t('portal.listings.preview.description')}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-primary)', whiteSpace: 'pre-line' }}>
                {listing.description}
              </p>
            </section>
          )}

          {listing.photos.length > 0 && (
            <section style={{ marginTop: '1.25rem' }}>
              <h3 style={sectionTitle}>{t('portal.listings.preview.photos')}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                {listing.photos.map((photo, index) => (
                  <img
                    key={photo.uuid}
                    src={photo.url}
                    alt={t('portal.listings.preview.photoAlt', { index: index + 1 })}
                    loading="lazy"
                    style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: '0.625rem', flexShrink: 0 }}
                  />
                ))}
              </div>
            </section>
          )}

          <section style={{ marginTop: '1.5rem' }}>
            <p style={{ margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-primary)' }}>
              <Heart size={18} color="var(--color-accent)" aria-hidden="true" />
              <strong style={{ fontSize: '1.25rem' }}>{listing.like_count}</strong>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{t('portal.listings.preview.likesTotal')}</span>
            </p>
            <h3 style={sectionTitle}>{t('portal.listings.preview.chartTitle')}</h3>
            <LikesChart likesPerDay={likesPerDay} height={160} />
          </section>
        </div>
      </div>
    </div>
  )
}
