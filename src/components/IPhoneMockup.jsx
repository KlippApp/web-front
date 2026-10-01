import { Signal, Wifi, BatteryFull } from 'lucide-react'

// Side buttons of an iPhone 15 Pro, as fractions of the body height
const BUTTONS = [
  { side: 'left', top: '18%', height: '4.5%' },
  { side: 'left', top: '25.5%', height: '7.5%' },
  { side: 'left', top: '35%', height: '7.5%' },
  { side: 'right', top: '27%', height: '12%' },
]

export default function IPhoneMockup({ width = 'min(272px, 72vw)', children }) {
  return (
    <div className="iphone" style={{ '--w': width }}>
      {BUTTONS.map(({ side, top, height }) => (
        <span key={`${side}-${top}`} className="iphone-button" style={{ [side]: -6, top, height }} />
      ))}
      <div className="iphone-screen">
        {children}
        <div className="iphone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Signal size="1.1em" strokeWidth={2.5} />
            <Wifi size="1.1em" strokeWidth={2.5} />
            <BatteryFull size="1.35em" strokeWidth={2} />
          </span>
        </div>
        <div className="iphone-island" />
      </div>
    </div>
  )
}
