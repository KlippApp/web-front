import '@testing-library/jest-dom'
import { vi } from 'vitest'

const { mockChangeLanguage, mockT } = vi.hoisted(() => ({
  mockChangeLanguage: vi.fn(() => new Promise(() => {})),
  mockT: (key) => {
    const translations = {
      'nav.features': 'Features',
      'nav.screenshots': 'Screenshots',
      'nav.reviews': 'Reviews',
      'nav.clientPortal': 'Espace Client',
      'hero.badge': 'Now available on iOS & Android',
      'hero.headline': 'Find Your Perfect Home with AI',
      'hero.subtitle': 'AI-powered property search, immersive virtual tours, and real-time market insights — all in one beautifully simple app.',
      'hero.stats.rating': 'App Store Rating',
      'hero.stats.users': 'Happy Users',
      'hero.stats.market': 'Real Estate App',
      'features.tag': 'Features',
      'features.title': 'Everything you need to find home',
      'features.subtitle': 'Powerful tools designed to make your property search faster, smarter, and less stressful.',
      'features.list.search.title': 'AI-Powered Search',
      'features.list.tours.title': 'Virtual Tours',
      'features.list.insights.title': 'Market Insights',
      'features.list.alerts.title': 'Instant Alerts',
      'features.list.connect.title': 'Agent Connect',
      'features.list.guide.title': 'Neighborhood Guide',
      'screenshots.title': 'Beautiful by design',
      'screenshots.subtitle': 'Every screen crafted for clarity. Powerful features delivered through a clean, intuitive interface.',
      'testimonials.title': 'Loved by home seekers',
      'testimonials.subtitle': 'Join 50,000+ people who found their perfect home with Klipp.',
      'testimonials.list.0.quote': "Klipp made finding our first home feel effortless. The AI search understood exactly what we wanted — we found our place in two weeks instead of six months.",
      'testimonials.list.0.role': 'First-time homebuyer, Austin TX',
      'testimonials.list.1.quote': "As a real estate agent, I recommend Klipp to all my clients. The virtual tours alone save us dozens of hours per deal. The market data is genuinely best-in-class.",
      'testimonials.list.1.role': 'Licensed Real Estate Agent, NYC',
      'testimonials.list.2.quote': "Relocated from Seattle to Miami for work. Used Klipp to scope out neighborhoods remotely — the neighborhood guides and virtual tours were absolutely invaluable.",
      'testimonials.list.2.role': 'Remote buyer, Miami FL',
      'download.title': 'Start your search today',
      'download.subtitle': 'Download Klipp free and find your perfect property. No subscription required.',
      'download.appStore': 'Download on the App Store',
      'download.googlePlay': 'Get it on Google Play',
      'download.disclaimer': 'Free to download · Available on iOS 16+ & Android 8+',
      'footer.description': 'Find your perfect home with AI-powered search and real-time market insights.',
      'footer.sections.Product': 'Product',
      'footer.sections.Company': 'Company',
      'footer.sections.Legal': 'Legal',
      'footer.links.Features': 'Features',
      'footer.links.Screenshots': 'Screenshots',
      'footer.links.Pricing': 'Pricing',
      'footer.links.Changelog': 'Changelog',
      'footer.links.About': 'About',
      'footer.links.Blog': 'Blog',
      'footer.links.Careers': 'Careers',
      'footer.links.Press': 'Press',
      'footer.links.Privacy Policy': 'Privacy Policy',
      'footer.links.Terms of Service': 'Terms of Service',
      'footer.links.Cookie Policy': 'Cookie Policy',
      'footer.copyright': '© 2026 Klipp. All rights reserved.',
      'cookies.title': 'Cookies & préférences',
      'cookies.description': 'Nous utilisons des cookies pour mémoriser votre préférence de thème (clair/sombre). Aucune donnée personnelle n\'est collectée.',
      'cookies.accept': 'Accepter',
      'cookies.decline': 'Refuser'
    }
    return translations[key] || key
  }
}))

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
  Trans: ({ i18nKey, children }) => {
    if (children) return children
    const translations = {
      'hero.headline': 'Find Your Perfect Home with AI',
    }
    return translations[i18nKey] || i18nKey
  },
}))
