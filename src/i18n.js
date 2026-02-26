import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import fr from './locales/fr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    supportedLngs: ['en', 'fr'],
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    detection: {
      order: ['cookie', 'navigator', 'htmlTag'],
      caches: ['cookie'],
      lookupCookie: 'i18next',
      cookieMinutes: 1440 * 365, // 1 year
      cookieOptions: { path: '/', sameSite: 'strict' }
    },
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
