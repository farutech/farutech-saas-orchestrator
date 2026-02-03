import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import { cn } from '../utils/cn';

interface FarutechLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showText?: boolean;
  className?: string;
  usePng?: boolean;
}

const sizes = {
  sm: { icon: 20, text: 'text-lg', img: 32 },
  md: { icon: 28, text: 'text-xl', img: 40 },
  lg: { icon: 40, text: 'text-2xl', img: 56 },
  xl: { icon: 56, text: 'text-4xl', img: 72 },
};

export function FarutechLogo({
  size = 'md',
  animated = false,
  showText = true,
  className,
  usePng = true
}: FarutechLogoProps) {
  const { icon: iconSize, text: textSize, img: imgSize } = sizes[size];
  const containerStyle: React.CSSProperties = {
    fontFamily: 'var(--ft-font-family, Inter, system-ui, sans-serif)',
    color: 'var(--ft-color-text, #0F1724)'
  };

  // Intentar usar el logo PNG primero
  if (usePng) {
    return (
      <div style={containerStyle} className={cn('flex items-center gap-3', className)}>
        <img
          src="/logo.png"
          alt="Farutech Logo"
          style={{ height: `${imgSize}px`, width: 'auto' }}
          className="object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        {showText && (
          <span style={{ fontFamily: containerStyle.fontFamily as string }} className={cn('font-bold tracking-tight text-foreground', textSize)}>
            Farutech
          </span>
        )}
      </div>
    );
  }

  // Fallback: Logo con ícono (diseño original)
  const LogoIcon = animated ? (
    <motion.div
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Hexagon
        size={iconSize}
        strokeWidth={1.5}
        style={{ color: 'var(--ft-color-primary, #0EA5A4)', fill: 'var(--ft-color-primary, #0EA5A4)', opacity: 0.12 }}
      />
    </motion.div>
  ) : (
    <Hexagon size={iconSize} strokeWidth={1.5} style={{ color: 'var(--ft-color-primary, #0EA5A4)', fill: 'var(--ft-color-primary, #0EA5A4)', opacity: 0.12 }} />
  );

  return (
    <div style={containerStyle} className={cn('flex items-center gap-2', className)}>
      <div className="relative" aria-hidden>
        {LogoIcon}
        <span
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{ fontSize: iconSize * 0.35, color: 'var(--ft-color-primary, #0EA5A4)' }}
        >
          F
        </span>
      </div>
      {showText && (
        <span style={{ fontFamily: containerStyle.fontFamily as string }} className={cn('font-bold tracking-tight text-foreground', textSize)}>
          Farutech
        </span>
      )}
    </div>
  );
}