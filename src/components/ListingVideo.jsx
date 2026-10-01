import { useEffect, useRef } from 'react'
import { muxStream, muxThumbnail } from '../utils/listing.js'

export default function ListingVideo({ playbackId, style }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    const src = muxStream(playbackId)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      return
    }
    let hls
    let cancelled = false
    import('hls.js/light').then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
    })
    return () => {
      cancelled = true
      hls?.destroy()
    }
  }, [playbackId])

  return (
    <video
      ref={ref}
      poster={muxThumbnail(playbackId)}
      controls
      playsInline
      loop
      style={{ width: '100%', height: '100%', objectFit: 'cover', background: 'var(--color-ink)', ...style }}
    />
  )
}
