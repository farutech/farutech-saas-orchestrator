/**
 * Sistema de temas y colores personalizable
 * Permite cambiar fácilmente los colores de los componentes
 */

export type ColorScheme = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray'

export interface ThemeColors {
  primary: string
  success: string
  warning: string
  error: string
  info: string
  gray: string
}

// Colores predefinidos
export const defaultTheme: ThemeColors = {
  primary: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  info: 'cyan',
  gray: 'gray',
}

// Generador de clases de Tailwind basado en el esquema de color
export const getColorClasses = (color: ColorScheme, shade: number = 600) => {
  const colorMap: Record<ColorScheme, string> = {
    primary: `primary-${shade}`,
    success: `green-${shade}`,
    warning: `yellow-${shade}`,
    error: `red-${shade}`,
    info: `blue-${shade}`,
    gray: `gray-${shade}`,
  }

  return colorMap[color]
}

// Utilidades para generar clases de color
export const colorUtils = {
  // Background
  bg: (color: ColorScheme, shade: number = 600) => `bg-${getColorClasses(color, shade)}`,
  
  // Text
  text: (color: ColorScheme, shade: number = 600) => `text-${getColorClasses(color, shade)}`,
  
  // Border
  border: (color: ColorScheme, shade: number = 600) => `border-${getColorClasses(color, shade)}`,
  
  // Ring (focus)
  ring: (color: ColorScheme, shade: number = 500) => `ring-${getColorClasses(color, shade)}`,
  
  // Hover background
  hoverBg: (color: ColorScheme, shade: number = 700) => `hover:bg-${getColorClasses(color, shade)}`,
  
  // Hover text
  hoverText: (color: ColorScheme, shade: number = 700) => `hover:text-${getColorClasses(color, shade)}`,
  
  // Focus ring
  focusRing: (color: ColorScheme, shade: number = 500) => `focus:ring-${getColorClasses(color, shade)}`,
}

// Hook para temas personalizados
export const useThemeColors = () => {
  // Aquí podrías integrar con un estado global o context
  return defaultTheme
}

// Función para aplicar tema personalizado
export const applyCustomTheme = (theme: Partial<ThemeColors>) => {
  const customTheme = { ...defaultTheme, ...theme }
  
  // Actualizar variables CSS personalizadas
  const root = document.documentElement
  
  Object.entries(customTheme).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value)
  })
  
  return customTheme
}

// Paletas de colores preconstruidas
export const colorPalettes = {
  default: {
    primary: 'blue',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'cyan',
    gray: 'gray',
  },
  purple: {
    primary: 'purple',
    success: 'emerald',
    warning: 'amber',
    error: 'rose',
    info: 'indigo',
    gray: 'slate',
  },
  ocean: {
    primary: 'cyan',
    success: 'teal',
    warning: 'orange',
    error: 'red',
    info: 'blue',
    gray: 'slate',
  },
  forest: {
    primary: 'emerald',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'teal',
    gray: 'stone',
  },
  sunset: {
    primary: 'orange',
    success: 'lime',
    warning: 'yellow',
    error: 'red',
    info: 'amber',
    gray: 'warm',
  },
}

export type ColorPalette = keyof typeof colorPalettes
