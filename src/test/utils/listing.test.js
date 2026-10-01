import { describe, it, expect } from 'vitest'
import { formatPrice, listingCover, listingStatus, muxStream } from '../../utils/listing.js'

const photo = { uuid: 'p1', url: 'https://cdn/p1.jpg', position: 0 }

describe('listing utils', () => {
  it('derives the status from the video, or from the photos when there is none', () => {
    expect(listingStatus({ video: { status: 'READY' }, photos: [] })).toBe('online')
    expect(listingStatus({ video: { status: 'PROCESSING' }, photos: [photo] })).toBe('processing')
    expect(listingStatus({ video: { status: 'ERRORED' }, photos: [] })).toBe('error')
    expect(listingStatus({ video: null, photos: [photo] })).toBe('online')
    expect(listingStatus({ video: null, photos: [] })).toBe('processing')
  })

  it('uses the Mux thumbnail of a ready video, else the first photo', () => {
    expect(listingCover({ video: { status: 'READY', mux_playback_id: 'abc' }, photos: [photo] }))
      .toContain('https://image.mux.com/abc/thumbnail')
    expect(listingCover({ video: { status: 'PROCESSING', mux_playback_id: null }, photos: [photo] })).toBe(photo.url)
    expect(listingCover({ video: null, photos: [] })).toBeNull()
  })

  it('formats prices in euros from cents', () => {
    expect(formatPrice({ price_cents: 45000000 }, 'en')).toBe('€450,000')
    expect(muxStream('abc')).toBe('https://stream.mux.com/abc.m3u8')
  })
})
