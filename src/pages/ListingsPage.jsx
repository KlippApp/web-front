import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clapperboard, Eye, Heart } from 'lucide-react'
import API_URL, { DEV_BYPASS, authFetch } from '../config/api.js'
import Dropdown from '../components/Dropdown.jsx'
import ListingPreview from '../components/ListingPreview.jsx'
import ListingStatus from '../components/ListingStatus.jsx'
import { formatPrice, listingCover, listingStatus } from '../utils/listing.js'

const PAGE_SIZE = 24

function ListingCard({ listing, onOpen }) {
  const { t, i18n } = useTranslation()
  const cover = listingCover(listing)
  return (
    <button
      onClick={() => onOpen(listing)}
      aria-label={t('portal.listings.card.open', { title: listing.title })}
      className="listing-card"
    >
      <div className="listing-card-cover">
        {cover && <img src={cover} alt="" loading="lazy" />}
        <ListingStatus status={listingStatus(listing)} style={{ position: 'absolute', top: '0.625rem', left: '0.625rem' }} />
        <span className="listing-card-likes">
          <span><Heart size={14} aria-hidden="true" />{t('portal.listings.card.likes', { count: listing.like_count })}</span>
          {listing.view_count != null && (
            <span><Eye size={14} aria-hidden="true" />{t('portal.listings.card.views', { count: listing.view_count })}</span>
          )}
        </span>
      </div>
      <div style={{ padding: '0.75rem 0.25rem 0' }}>
        <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {formatPrice(listing, i18n.language)}
          {listing.listing_type === 'rent' && (
            <span style={{ fontWeight: 500, fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{t('portal.listings.perMonth')}</span>
          )}
        </p>
        <p style={{ margin: '0.125rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </p>
        <p style={{ margin: '0.125rem 0 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.location}{listing.owner && ` · ${listing.owner.name}`}
        </p>
      </div>
    </button>
  )
}

export default function ListingsPage() {
  const { t } = useTranslation()
  const [listings, setListings] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [agents, setAgents] = useState([])
  const [agentUuid, setAgentUuid] = useState('')
  const [listingType, setListingType] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (DEV_BYPASS || !API_URL) return
    // ponytail: single page of 100 agents, same as AgentsPage
    authFetch('/agents?items_per_page=100')
      .then(r => r.json())
      .then(data => setAgents(data.items ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (DEV_BYPASS || !API_URL) return
    const params = new URLSearchParams({ page, items_per_page: PAGE_SIZE })
    if (agentUuid) params.set('agent_uuid', agentUuid)
    if (listingType) params.set('listing_type', listingType)
    authFetch(`/agencies/listings?${params}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data) return
        setListings(prev => (page === 1 ? data.items : [...prev, ...data.items]))
        setHasMore(data.has_more)
      })
      .catch(() => {})
  }, [page, agentUuid, listingType])

  const changeFilter = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const closePreview = useCallback(() => setSelected(null), [])
  const filtered = agentUuid || listingType

  return (
    <div className="dash-page-content">
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 0.25rem' }}>
            {t('portal.listings.title')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {t('portal.listings.subtitle')}
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Dropdown
            options={[{ value: '', label: t('portal.listings.filters.allAgents') }, ...agents.map(a => ({ value: a.uuid, label: a.name }))]}
            value={agentUuid}
            onChange={changeFilter(setAgentUuid)}
            style={{ width: 200 }}
          />
          <Dropdown
            options={[
              { value: '', label: t('portal.listings.filters.allTypes') },
              { value: 'sale', label: t('portal.listings.filters.sale') },
              { value: 'rent', label: t('portal.listings.filters.rent') },
            ]}
            value={listingType}
            onChange={changeFilter(setListingType)}
            style={{ width: 180 }}
          />
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '1rem',
            background: 'var(--color-nav-bg)', color: 'var(--color-text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem',
          }}>
            <Clapperboard size={24} />
          </div>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
            {t(filtered ? 'portal.listings.emptyFiltered' : 'portal.listings.empty')}
          </p>
        </div>
      ) : (
        <div className="listing-grid">
          {listings.map(listing => <ListingCard key={listing.uuid} listing={listing} onOpen={setSelected} />)}
        </div>
      )}

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '0.625rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--color-card-border)',
              background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >
            {t('portal.listings.loadMore')}
          </button>
        </div>
      )}

      {selected && <ListingPreview listing={selected} onClose={closePreview} />}
    </div>
  )
}
