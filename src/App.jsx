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

export default function App() {
  const { consented, accept, decline } = useCookieConsent()
  const { theme, toggleTheme } = useTheme(consented)

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
