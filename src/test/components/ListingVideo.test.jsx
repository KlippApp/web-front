import { render } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ListingVideo from '../../components/ListingVideo'

afterEach(() => vi.restoreAllMocks())

describe('ListingVideo', () => {
  it('plays the Mux HLS stream natively when the browser supports it', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockReturnValue('maybe')
    const { container } = render(<ListingVideo playbackId="abc" />)
    const video = container.querySelector('video')
    expect(video).toHaveAttribute('src', 'https://stream.mux.com/abc.m3u8')
    expect(video.getAttribute('poster')).toContain('https://image.mux.com/abc/thumbnail')
    expect(video).toHaveAttribute('controls')
  })
})
