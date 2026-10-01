import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from './hooks/useTheme.js'
import { useCookieConsent } from './hooks/useCookieConsent.js'
import { PUBLIC_PAGES, basePath, langFromPath } from './config/site.js'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Screenshots from './components/Screenshots.jsx'
import Testimonials from './components/Testimonials.jsx'
import DownloadCTA from './components/DownloadCTA.jsx'
import Footer from './components/Footer.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const ProtectedRoute = lazy(() => import('./components/ProtectedRoute.jsx'))
const DashboardLayout = lazy(() => import('./components/DashboardLayout.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const AgentsPage = lazy(() => import('./pages/AgentsPage.jsx'))
const OfficesPage = lazy(() => import('./pages/OfficesPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const SetPasswordPage = lazy(() => import('./pages/SetPasswordPage.jsx'))

function PublicPage() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const page = PUBLIC_PAGES[basePath(pathname)] ?? 'notFound'
  const lang = langFromPath(pathname)

  useEffect(() => {
    if (!i18n.language?.startsWith(lang)) i18n.changeLanguage(lang)
  }, [i18n, lang])

  useEffect(() => {
    document.title = t(`seo.${page}.title`)
  }, [t, page, i18n.language])

  return <Outlet />
}

function LandingLayout() {
  const { i18n } = useTranslation()
  const { consented, accept, decline } = useCookieConsent()
  const { theme, toggleTheme } = useTheme(consented)

  useEffect(() => {
    if (consented === 'accepted') {
      const expires = new Date(Date.now() + 365 * 864e5).toUTCString()
      document.cookie = `i18next=${i18n.language}; expires=${expires}; path=/; sameSite=strict`
    }
  }, [i18n.language, consented])

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Features />
        <Screenshots />
        <Testimonials />
        <DownloadCTA />
      </main>
      <Footer />
      {consented === null && (
        <CookieConsent onAccept={accept} onDecline={decline} />
      )}
    </>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<PublicPage />}>
          {['', '/en'].map(prefix => [
            <Route key={`${prefix}/`} path={prefix || '/'} element={<LandingLayout />} />,
            <Route key={`${prefix}/privacy`} path={`${prefix}/privacy`} element={<PrivacyPage />} />,
            <Route key={`${prefix}/terms`} path={`${prefix}/terms`} element={<TermsPage />} />,
          ])}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/agents" element={<AgentsPage />} />
            <Route path="/dashboard/offices" element={<OfficesPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
