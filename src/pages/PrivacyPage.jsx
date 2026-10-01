import LegalPage from '../components/LegalPage.jsx'

const SECTIONS = ['controller', 'data', 'purposes', 'retention', 'recipients', 'cookies', 'rights', 'security', 'changes']

export default function PrivacyPage() {
  return <LegalPage doc="privacy" sections={SECTIONS} />
}
