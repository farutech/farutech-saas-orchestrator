/**
 * Componente Avatar - Avatar de usuario con variantes
 */

import clsx from 'clsx'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'circle' | 'square' | 'rounded'
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
}

const sizeStyles = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-24 w-24 text-3xl',
}

const shapeStyles = {
  circle: 'rounded-full',
  square: '',
  rounded: 'rounded-lg',
}

const statusStyles = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
}

export function Avatar({ 
  src, 
  alt, 
  name,
  size = 'md', 
  shape = 'circle',
  status,
  className 
}: AvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={clsx('relative inline-flex', className)}>
      <div
        className={clsx(
          'flex items-center justify-center font-semibold',
          'bg-gradient-to-br from-primary-500 to-primary-600 text-white',
          'overflow-hidden',
          sizeStyles[size],
          shapeStyles[shape]
        )}
      >
        {src ? (
          <img src={src} alt={alt || name} className="h-full w-full object-cover" />
        ) : (
          <span>{name ? getInitials(name) : '?'}</span>
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-gray-900',
            statusStyles[status],
            size === 'xs' && 'h-1.5 w-1.5',
            size === 'sm' && 'h-2 w-2',
            size === 'md' && 'h-2.5 w-2.5',
            size === 'lg' && 'h-3 w-3',
            (size === 'xl' || size === '2xl') && 'h-4 w-4'
          )}
        />
      )}
    </div>
  )
}

// Avatar Group
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string; alt?: string }>
  max?: number
  size?: AvatarProps['size']
  className?: string
}

export function AvatarGroup({ avatars, max = 3, size = 'md', className }: AvatarGroupProps) {
  const displayedAvatars = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className={clsx('flex -space-x-2', className)}>
      {displayedAvatars.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white dark:ring-gray-900 rounded-full">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center font-semibold',
            'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            'ring-2 ring-white dark:ring-gray-900 rounded-full',
            sizeStyles[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
