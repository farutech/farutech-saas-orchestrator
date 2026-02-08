// ============================================================================
// AUTH LAYOUT - Container for Authentication Forms
// ============================================================================
// Layout reutilizable para todas las páginas de autenticación
// Proporciona logo, branding y estructura consistente

import React from 'react';
import { authTokens } from '../../tokens/auth.tokens';
import { cn } from '../../lib/utils';

// ============================================================================
// Types
// ============================================================================

export interface AuthLayoutProps {
  /** Contenido del formulario */
  children: React.ReactNode;
  /** Título principal (ej: "Iniciar Sesión") */
  title?: string;
  /** Subtítulo o descripción */
  subtitle?: string;
  /** URL del logo personalizado */
  logoUrl?: string;
  /** Nombre de la marca */
  brandName?: string;
  /** Icono por defecto si no hay logoUrl */
  defaultIcon?: React.ReactNode;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  logoUrl,
  brandName = 'Farutech',
  defaultIcon,
  className,
}) => {
  return (
    <div
      className={cn(
        authTokens.layout.minHeight,
        authTokens.layout.background,
        authTokens.layout.display,
        authTokens.layout.alignment,
        'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <div
        className={cn(
          authTokens.card.maxWidth,
          authTokens.card.width,
          authTokens.card.padding,
          authTokens.card.background,
          authTokens.card.border,
          authTokens.card.rounded,
          authTokens.card.shadow,
          authTokens.card.animation
        )}
      >
        {/* Logo Section */}
        <div className={authTokens.logo.container}>
          {/* Glow effect */}
          <div
            className={cn(
              authTokens.logo.glow.base,
              authTokens.logo.glow.opacity,
              authTokens.logo.glow.transition
            )}
            aria-hidden="true"
          />

          {/* Logo/Icon */}
          <div
            className={cn(
              authTokens.logo.wrapper,
              authTokens.logo.gradient,
              authTokens.logo.rounded,
              authTokens.logo.ring,
              authTokens.logo.transition
            )}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${brandName} logo`}
                className="w-full h-full object-contain p-3"
              />
            ) : (
              <div className={authTokens.logo.icon.container}>
                {defaultIcon || (
                  <svg
                    className={cn(authTokens.logo.icon.size, authTokens.logo.icon.color)}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && <h2 className={authTokens.typography.title}>{title}</h2>}
            {subtitle && <p className={authTokens.typography.subtitle}>{subtitle}</p>}
          </div>
        )}

        {/* Form Content */}
        {children}
      </div>
    </div>
  );
};

AuthLayout.displayName = 'AuthLayout';
