import LegalPage from '../components/LegalPage.jsx'

const SECTIONS = ['publisher', 'service', 'account', 'obligations', 'ip', 'liability', 'termination', 'data', 'changes', 'law']

export default function TermsPage() {
  return <LegalPage doc="terms" sections={SECTIONS} />
}
