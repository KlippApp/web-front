export const SITE_URL = 'https://klippapps.com'

export const LANGS = ['fr', 'en']
export const DEFAULT_LANG = 'fr'

export const PUBLIC_PAGES = {
  '/': 'home',
  '/privacy': 'privacy',
  '/terms': 'terms',
}

export function langFromPath(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : DEFAULT_LANG
}

export function basePath(pathname) {
  const path = pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/+$/, '')
  return path || '/'
}

export function isPublicPath(pathname) {
  return basePath(pathname) in PUBLIC_PAGES
}

export function localizedPath(path, lang) {
  if (lang !== 'en') return path
  return path === '/' ? '/en' : `/en${path}`
}

const escapeAttr = s => String(s)
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function headTags({ path, lang, title, description }) {
  const url = SITE_URL + localizedPath(path, lang)
  const alternates = LANGS.map(l =>
    `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${localizedPath(path, l)}" />`)
  const tags = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Klipp" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.png" />`,
    `<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'fr_FR'}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
  if (path === '/') {
    const app = {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: 'Klipp',
      url,
      description,
      operatingSystem: 'iOS, Android',
      applicationCategory: 'LifestyleApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    }
    tags.push(`<script type="application/ld+json">${JSON.stringify(app).replace(/</g, '\\u003c')}</script>`)
  }
  return tags.join('\n    ')
}
