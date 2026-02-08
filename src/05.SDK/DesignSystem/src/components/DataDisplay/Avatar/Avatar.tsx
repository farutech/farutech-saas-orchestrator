import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium text-white',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
      variant: {
        default: 'bg-primary',
        medical: 'bg-gradient-to-br from-green-500 to-emerald-600',
        vet: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        erp: 'bg-gradient-to-br from-purple-500 to-violet-600',
        pos: 'bg-gradient-to-br from-amber-500 to-orange-600',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export function Avatar({
  src,
  alt,
  fallback,
  status,
  size,
  variant,
  className,
  ...props
}: AvatarProps) {
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  return (
    <div
      className={cn(avatarVariants({ size, variant }), 'relative', className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt || fallback || 'Avatar'}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(fallback)}</span>
      )}

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full border-2 border-background',
            statusColors[status],
            statusSizes[size || 'md']
          )}
        />
      )}
    </div>
  );
}
