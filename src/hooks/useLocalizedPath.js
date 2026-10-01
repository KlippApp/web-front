import { useTranslation } from 'react-i18next'
import { localizedPath } from '../config/site.js'

export function useLocalizedPath() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr'
  return path => localizedPath(path, lang)
}
