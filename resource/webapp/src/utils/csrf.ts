// Simple CSRF helper: prefer reading an accessible cookie named 'XSRF-TOKEN'
// or a JS-accessible storage. In production it is recommended to use
// SameSite cookies + Origin checks. This helper will be used to attach
// a header for mutating requests when available.

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function getCsrfToken(): string | null {
  // 1) Check for cookie (often set by backend as XSRF-TOKEN)
  const fromCookie = readCookie('XSRF-TOKEN')
  if (fromCookie) return fromCookie

  // 2) Optional: check localStorage fallback (not recommended for prod)
  try {
    const fromStorage = localStorage.getItem('XSRF-TOKEN')
    return fromStorage || null
  } catch {
    return null
  }
}

export function attachCsrfHeader(headers: Record<string, any> = {}) {
  const token = getCsrfToken()
  if (token && headers) {
    headers['X-CSRF-Token'] = token
  }
  return headers
}
