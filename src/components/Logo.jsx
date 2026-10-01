export default function Logo({ size = 28 }) {
  return (
    <svg width={size * 92 / 95} height={size} viewBox="0 0 92 95" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-logo-text)' }}>
      <path d="M0,0L17,0L17,52L42,27L63,27L30.75,59.25L64.5,93L44.5,93L17,65.5L17,93L0,93Z" fill="currentColor" />
      <circle cx="80" cy="83" r="12" fill="var(--color-accent)" />
    </svg>
  )
}
