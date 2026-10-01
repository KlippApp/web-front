import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import i18n from './i18n'
import { AppRoutes } from './App.jsx'

export { i18n }

export async function render(url, lang) {
  await i18n.changeLanguage(lang)
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
}
