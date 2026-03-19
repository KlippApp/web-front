import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from './hooks/useTheme.js'
import { useCookieConsent } from './hooks/useCookieConsent.js'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Screenshots from './components/Screenshots.jsx'
import Testimonials from './components/Testimonials.jsx'
import DownloadCTA from './components/DownloadCTA.jsx'
import Footer from './components/Footer.jsx'
import CookieConsent from './components/CookieConsent.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import AgentsPage from './pages/AgentsPage.jsx'
import OfficesPage from './pages/OfficesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SetPasswordPage from './pages/SetPasswordPage.jsx'

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingLayout />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
