export const muxThumbnail = (playbackId) => `https://image.mux.com/${playbackId}/thumbnail.webp?width=480&time=1`
export const muxStream = (playbackId) => `https://stream.mux.com/${playbackId}.m3u8`

export function listingStatus(listing) {
  const status = listing.video?.status
  if (status === 'ERRORED') return 'error'
  if (status === 'READY' || (!listing.video && listing.photos.length > 0)) return 'online'
  return 'processing'
}

export function listingCover(listing) {
  const playbackId = listing.video?.status === 'READY' && listing.video.mux_playback_id
  return playbackId ? muxThumbnail(playbackId) : listing.photos[0]?.url ?? null
}

export function formatPrice(listing, lang) {
  return new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    .format(listing.price_cents / 100)
}

export const formatDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
