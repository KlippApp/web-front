import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { render, i18n } from '../dist-ssr/entry-server.js'
import { LANGS, PUBLIC_PAGES, SITE_URL, headTags, localizedPath } from '../src/config/site.js'

// ponytail: keep in sync with the non-public routes in src/App.jsx
const APP_ROUTES = ['/login', '/register', '/set-password', '/dashboard', '/dashboard/listings', '/dashboard/agents', '/dashboard/offices', '/dashboard/profile']

const template = readFileSync('dist/index.html', 'utf8')

function write(file, html) {
  const out = join('dist', file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

function page({ lang, head, body = '' }) {
  return template
    .replace('<html lang="fr">', `<html lang="${lang}">`)
    .replace('<title>Klipp</title>', head)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

for (const [path, key] of Object.entries(PUBLIC_PAGES)) {
  for (const lang of LANGS) {
    const url = localizedPath(path, lang)
    const t = i18n.getFixedT(lang)
    const head = headTags({ path, lang, title: t(`seo.${key}.title`), description: t(`seo.${key}.description`) })
    const file = url === '/' ? 'index.html' : url === '/en' ? 'en/index.html' : `${url.slice(1)}.html`
    write(file, page({ lang, head, body: await render(url, lang) }))
  }
}

const noindex = '<title>Klipp</title>\n    <meta name="robots" content="noindex" />'
for (const route of APP_ROUTES) write(`${route.slice(1)}.html`, page({ lang: 'fr', head: noindex }))
for (const lang of LANGS) {
  const head = `<title>${i18n.getFixedT(lang)('seo.notFound.title')}</title>\n    <meta name="robots" content="noindex" />`
  write(localizedPath('/404', lang).slice(1) + '.html', page({ lang, head, body: await render(localizedPath('/404', lang), lang) }))
}

const urls = Object.keys(PUBLIC_PAGES).map(path => {
  const alternates = LANGS.map(l =>
    `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localizedPath(path, l)}"/>`).join('\n')
  return LANGS.map(lang => `  <url>\n    <loc>${SITE_URL}${localizedPath(path, lang)}</loc>\n${alternates}\n  </url>`).join('\n')
}).join('\n')
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`)

rmSync('dist-ssr', { recursive: true, force: true })
