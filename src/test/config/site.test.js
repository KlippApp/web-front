import { describe, it, expect } from 'vitest'
import { basePath, headTags, isPublicPath, langFromPath, localizedPath } from '../../config/site.js'

describe('site config', () => {
  it('reads the language from the URL prefix, French by default', () => {
    expect(langFromPath('/')).toBe('fr')
    expect(langFromPath('/privacy')).toBe('fr')
    expect(langFromPath('/en')).toBe('en')
    expect(langFromPath('/en/terms')).toBe('en')
    expect(langFromPath('/english')).toBe('fr')
  })

  it('strips the language prefix and trailing slashes', () => {
    expect(basePath('/en')).toBe('/')
    expect(basePath('/en/')).toBe('/')
    expect(basePath('/en/privacy')).toBe('/privacy')
    expect(basePath('/terms/')).toBe('/terms')
  })

  it('recognises public pages only', () => {
    expect(isPublicPath('/')).toBe(true)
    expect(isPublicPath('/en/terms')).toBe(true)
    expect(isPublicPath('/login')).toBe(false)
    expect(isPublicPath('/dashboard/agents')).toBe(false)
  })

  it('prefixes English paths only', () => {
    expect(localizedPath('/', 'fr')).toBe('/')
    expect(localizedPath('/', 'en')).toBe('/en')
    expect(localizedPath('/privacy', 'en')).toBe('/en/privacy')
  })

  it('builds canonical, hreflang and escaped meta tags', () => {
    const head = headTags({ path: '/privacy', lang: 'en', title: 'A "quoted" <title>', description: 'd & e' })
    expect(head).toContain('<link rel="canonical" href="https://klippapps.com/en/privacy" />')
    expect(head).toContain('hreflang="fr" href="https://klippapps.com/privacy"')
    expect(head).toContain('hreflang="x-default" href="https://klippapps.com/privacy"')
    expect(head).toContain('<title>A &quot;quoted&quot; &lt;title&gt;</title>')
    expect(head).toContain('content="d &amp; e"')
    expect(head).not.toContain('application/ld+json')
  })

  it('adds the app structured data on the home page', () => {
    const head = headTags({ path: '/', lang: 'fr', title: 't', description: 'd' })
    expect(head).toContain('"@type":"MobileApplication"')
    expect(head).toContain('<meta property="og:locale" content="fr_FR" />')
  })
})
