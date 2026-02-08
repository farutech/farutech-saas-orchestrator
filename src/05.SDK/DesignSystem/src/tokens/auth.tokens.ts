// ============================================================================
// AUTH TOKENS - Design Tokens for Authentication Components
// ============================================================================
// Tokens de diseño compartidos para todos los componentes de autenticación
// Basado en los patrones de resource/webapp

export const authTokens = {
  // ============================================================================
  // Layout & Container
  // ============================================================================
  layout: {
    minHeight: 'min-h-screen',
    background:
      'bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800',
    display: 'flex',
    alignment: 'items-center justify-center',
  },

  // ============================================================================
  // Card Container
  // ============================================================================
  card: {
    maxWidth: 'max-w-md',
    width: 'w-full',
    padding: 'p-8',
    background: 'bg-white dark:bg-gray-800',
    border: 'border border-gray-200 dark:border-gray-700',
    rounded: 'rounded-2xl',
    shadow: 'shadow-2xl shadow-primary-600/10 dark:shadow-primary-900/30',
    animation: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
  },

  // ============================================================================
  // Logo Container
  // ============================================================================
  logo: {
    container: 'relative group w-20 h-20 mx-auto mb-6',
    wrapper: 'relative w-full h-full',
    gradient: 'bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700',
    rounded: 'rounded-2xl',
    ring: 'ring-4 ring-primary-200 dark:ring-primary-900/50',
    transition: 'transition-all duration-300',
    // Glow effect
    glow: {
      base: 'absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur-lg',
      opacity: 'opacity-50 group-hover:opacity-75',
      transition: 'transition-opacity duration-300',
    },
    // Icon container
    icon: {
      container: 'relative w-full h-full flex items-center justify-center',
      color: 'text-white',
      size: 'w-10 h-10',
    },
  },

  // ============================================================================
  // Typography
  // ============================================================================
  typography: {
    title: 'text-3xl font-bold text-gray-900 dark:text-white text-center mb-2',
    subtitle: 'text-sm text-gray-600 dark:text-gray-400 text-center mb-8',
    description: 'text-sm text-gray-600 dark:text-gray-400 text-center mb-6',
  },

  // ============================================================================
  // Form
  // ============================================================================
  form: {
    spacing: 'space-y-6',
    inputSpacing: 'space-y-4',
  },

  // ============================================================================
  // Links
  // ============================================================================
  link: {
    base: 'text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300',
    transition: 'transition-colors duration-200',
    underline: 'underline',
  },

  // ============================================================================
  // Divider
  // ============================================================================
  divider: {
    container: 'my-6 flex items-center',
    line: 'flex-1 border-t border-gray-300 dark:border-gray-600',
    text: 'mx-4 text-sm text-gray-500 dark:text-gray-400',
  },

  // ============================================================================
  // Success/Error States
  // ============================================================================
  state: {
    success: {
      icon: 'w-16 h-16 mx-auto mb-4 text-green-500',
      title: 'text-xl font-semibold text-gray-900 dark:text-white text-center mb-2',
      message: 'text-gray-600 dark:text-gray-400 text-center mb-6',
    },
    error: {
      icon: 'w-16 h-16 mx-auto mb-4 text-red-500',
      title: 'text-xl font-semibold text-gray-900 dark:text-white text-center mb-2',
      message: 'text-gray-600 dark:text-gray-400 text-center mb-6',
    },
  },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type AuthTokens = typeof authTokens;
