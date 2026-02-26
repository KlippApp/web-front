import { useState } from 'react'

const CONSENT_KEY = 'cookie_consent'

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

function setCookie(name, value) {
  const expires = new Date(Date.now() + 365 * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export function useCookieConsent() {
  const [consented, setConsented] = useState(() => getCookie(CONSENT_KEY))

  const accept = () => {
    setCookie(CONSENT_KEY, 'accepted')
    setConsented('accepted')
  }

  const decline = () => {
    setCookie(CONSENT_KEY, 'declined')
    setConsented('declined')
  }

  return { consented, accept, decline }
}
