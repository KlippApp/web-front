const API_URL = import.meta.env.VITE_API_URL || ''

// Bypass is active in dev/preview when no API URL is configured.
// Always disabled in test environment so mocks work normally.
export const DEV_BYPASS = !API_URL && import.meta.env.MODE !== 'test'

export default API_URL
