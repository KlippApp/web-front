import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import i18n from './i18n'
import App from './App.jsx'
import { isPublicPath, langFromPath } from './config/site.js'

if (isPublicPath(location.pathname)) i18n.changeLanguage(langFromPath(location.pathname))

// ponytail: createRoot replaces the prerendered HTML instead of hydrating it; switch to hydrateRoot once theme/consent render identically on server and client
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
