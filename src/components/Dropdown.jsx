import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Generic dropdown component.
 *
 * @param {Array<{value: string, label: string}>} options
 * @param {string} value        - currently selected value
 * @param {function} onChange   - called with the new value
 * @param {string} placeholder  - shown when value is empty / not found
 * @param {object} style        - optional override for the container (controls width/flex)
 * @param {boolean} disabled
 */
export default function Dropdown({ options = [], value, onChange, placeholder = '—', style = {}, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optValue) => {
    onChange(optValue)
    setIsOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', ...style }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(o => !o)}
        style={{
          width: '100%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          padding: '0.625rem 0.875rem',
          borderRadius: '0.625rem',
          border: '1px solid var(--color-input-border)',
          background: 'var(--color-input-bg)',
          color: selected ? 'var(--color-input-text)' : 'var(--color-text-secondary)',
          fontSize: '0.9rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color 0.2s',
          textAlign: 'left',
          boxSizing: 'border-box',
        }}
        onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = 'var(--color-input-focus-border)' }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--color-input-border)' }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          style={{
            flexShrink: 0,
            opacity: 0.5,
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'none',
          }}
        />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.375rem)',
          left: 0,
          right: 0,
          background: 'var(--color-mobile-menu-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-divider)',
          borderRadius: '0.75rem',
          padding: '0.375rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
          zIndex: 200,
          maxHeight: '220px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: opt.value === value ? 'rgba(43,127,255,0.1)' : 'transparent',
                color: opt.value === value ? 'var(--color-blue-primary)' : 'var(--color-text-primary)',
                fontSize: '0.875rem',
                fontWeight: opt.value === value ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = opt.value === value ? 'rgba(43,127,255,0.15)' : 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.background = opt.value === value ? 'rgba(43,127,255,0.1)' : 'transparent' }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
