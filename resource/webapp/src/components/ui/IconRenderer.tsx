import React from 'react'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'

// Icon prop can be either a React component or a descriptor { provider, name }
export type IconProp = React.ComponentType<any> | { provider: string; name: string }

type Props = {
  icon?: IconProp | null
  className?: string
}

/**
 * Minimal pluggable icon renderer.
 * - If `icon` is a React component, render it directly.
 * - If `icon` is an object with provider/name you can extend provider handling here
 *   (e.g., lazy-load from an external paid icon service). For now, use a fallback.
 */
export function IconRenderer({ icon, className = '' }: Props) {
  if (!icon) return null

  if (typeof icon === 'function') {
    const C = icon as React.ComponentType<any>
    return <C className={className} />
  }

  if (typeof icon === 'object' && icon.provider) {
    // Example: support 'hero' provider names in the future.
    // For now we return a generic fallback so the UI remains consistent.
    // TODO: implement provider-specific lazy loaders (react-icons, third-party API)
    return <QuestionMarkCircleIcon className={className} />
  }

  return <QuestionMarkCircleIcon className={className} />
}

export default IconRenderer
