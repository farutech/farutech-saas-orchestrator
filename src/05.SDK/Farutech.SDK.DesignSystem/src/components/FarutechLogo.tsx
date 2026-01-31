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

  // Intentar usar el logo PNG primero
  if (usePng) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <img
          src="/logo.png"
          alt="Farutech Logo"
          style={{ height: imgSize, width: 'auto' }}
          className="object-contain"
          onError={(e) => {
            // Fallback: si falla, ocultar imagen y usar el icono
            e.currentTarget.style.display = 'none';
          }}
        />
        {showText && (
          <span className={cn("font-bold tracking-tight text-foreground", textSize)}>
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
        className="text-primary fill-primary/20"
        strokeWidth={1.5}
      />
    </motion.div>
  ) : (
    <Hexagon
      size={iconSize}
      className="text-primary fill-primary/20"
      strokeWidth={1.5}
    />
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        {LogoIcon}
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-primary"
          style={{ fontSize: iconSize * 0.35 }}
        >
          F
        </span>
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight text-foreground", textSize)}>
          Farutech
        </span>
      )}
    </div>
  );
}