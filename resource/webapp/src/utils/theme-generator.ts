/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                     DYNAMIC THEME GENERATOR UTILITY                        ║
 * ║                                                                            ║
 * ║  Utilidades para generación dinámica de temas y gradientes                ║
 * ║  - Conversión de colores (hex, rgb, hsl)                                  ║
 * ║  - Generación automática de variantes                                     ║
 * ║  - Creación de gradientes dinámicos                                       ║
 * ║  - Aplicación de CSS variables                                            ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import type { ApplicationTheme } from '@/config/applications.config'

// ============================================================================
// COLOR CONVERSION UTILITIES
// ============================================================================

/**
 * Convierte HEX a RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

/**
 * Convierte RGB a HEX
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * Convierte RGB a HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convierte HSL a RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Aclara un color (aumenta luminosidad)
 */
export function lightenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.l = Math.min(100, hsl.l + amount)

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Oscurece un color (reduce luminosidad)
 */
export function darkenColor(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.l = Math.max(0, hsl.l - amount)

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Ajusta la saturación de un color
 */
export function adjustSaturation(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.s = Math.max(0, Math.min(100, hsl.s + amount))

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Genera color complementario (opuesto en rueda de color)
 */
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.h = (hsl.h + 180) % 360

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

/**
 * Genera color análogo (30° en rueda de color)
 */
export function getAnalogousColor(hex: string, offset: number = 30): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.h = (hsl.h + offset) % 360

  const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l)
  return rgbToHex(newRgb.r, newRgb.g, newRgb.b)
}

// ============================================================================
// COLOR SCALE GENERATION
// ============================================================================

/**
 * Genera una escala de colores (50-900) basada en un color base
 */
export function generateColorScale(baseColor: string): Record<number, string> {
  const rgb = hexToRgb(baseColor)
  if (!rgb) return {}

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  const scale: Record<number, string> = {}
  const luminosities = [95, 90, 80, 70, 60, hsl.l, 40, 30, 20, 10]
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

  shades.forEach((shade, index) => {
    const newRgb = hslToRgb(hsl.h, hsl.s, luminosities[index])
    scale[shade] = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
  })

  return scale
}

// ============================================================================
// GRADIENT GENERATION
// ============================================================================

/**
 * Genera gradientes basados en el tema
 */
export function generateGradients(theme: ApplicationTheme): Record<string, string> {
  const primary = theme.primaryColor
  const secondary = theme.secondaryColor || getAnalogousColor(primary, 30)
  const style = theme.gradientStyle || 'linear'
  const direction = theme.gradientDirection || 135

  const gradients: Record<string, string> = {}

  if (!theme.useGradients) {
    return gradients
  }

  // Gradiente primario
  if (style === 'linear') {
    gradients.primary = `linear-gradient(${direction}deg, ${primary}, ${lightenColor(primary, 20)})`
    gradients.primaryToSecondary = `linear-gradient(${direction}deg, ${primary}, ${secondary})`
    gradients.primaryDark = `linear-gradient(${direction}deg, ${darkenColor(primary, 10)}, ${primary})`
  } else if (style === 'radial') {
    gradients.primary = `radial-gradient(circle, ${lightenColor(primary, 20)}, ${primary})`
    gradients.primaryToSecondary = `radial-gradient(circle, ${primary}, ${secondary})`
  } else if (style === 'conic') {
    gradients.primary = `conic-gradient(from ${direction}deg, ${primary}, ${lightenColor(primary, 20)}, ${primary})`
    gradients.primaryToSecondary = `conic-gradient(from ${direction}deg, ${primary}, ${secondary}, ${primary})`
  }

  // Gradientes para estados
  gradients.success = `linear-gradient(${direction}deg, ${theme.successColor || '#10b981'}, ${lightenColor(theme.successColor || '#10b981', 15)})`
  gradients.warning = `linear-gradient(${direction}deg, ${theme.warningColor || '#f59e0b'}, ${lightenColor(theme.warningColor || '#f59e0b', 15)})`
  gradients.error = `linear-gradient(${direction}deg, ${theme.errorColor || '#ef4444'}, ${lightenColor(theme.errorColor || '#ef4444', 15)})`
  gradients.info = `linear-gradient(${direction}deg, ${theme.infoColor || '#3b82f6'}, ${lightenColor(theme.infoColor || '#3b82f6', 15)})`

  // Gradientes sutiles para backgrounds
  gradients.cardLight = `linear-gradient(${direction}deg, ${lightenColor(primary, 45)}, ${lightenColor(secondary, 45)})`
  gradients.cardDark = `linear-gradient(${direction}deg, ${darkenColor(primary, 35)}, ${darkenColor(secondary, 35)})`
  
  // Gradiente animado (para efectos especiales)
  gradients.animated = `linear-gradient(${direction}deg, ${primary}, ${secondary}, ${getAnalogousColor(primary, -30)})`

  return gradients
}

// ============================================================================
// CSS VARIABLES APPLICATION
// ============================================================================

/**
 * Aplica CSS variables al documento basándose en el tema
 */
export function applyCSSVariables(
  theme: ApplicationTheme,
  gradients: Record<string, string>
): void {
  const root = document.documentElement

  // Colores base
  root.style.setProperty('--color-primary', theme.primaryColor)
  
  if (theme.secondaryColor) {
    root.style.setProperty('--color-secondary', theme.secondaryColor)
  } else {
    root.style.setProperty('--color-secondary', getAnalogousColor(theme.primaryColor, 30))
  }

  if (theme.accentColor) {
    root.style.setProperty('--color-accent', theme.accentColor)
  }

  root.style.setProperty('--color-success', theme.successColor || '#10b981')
  root.style.setProperty('--color-warning', theme.warningColor || '#f59e0b')
  root.style.setProperty('--color-error', theme.errorColor || '#ef4444')
  root.style.setProperty('--color-info', theme.infoColor || '#3b82f6')

  // Escalas de colores
  const primaryScale = generateColorScale(theme.primaryColor)
  Object.entries(primaryScale).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color)
    
    // También como RGB para usar con opacity
    const rgb = hexToRgb(color)
    if (rgb) {
      root.style.setProperty(`--color-primary-${shade}-rgb`, `${rgb.r}, ${rgb.g}, ${rgb.b}`)
    }
  })

  // Gradientes
  Object.entries(gradients).forEach(([name, gradient]) => {
    root.style.setProperty(`--gradient-${name}`, gradient)
  })

  // Tipografía
  if (theme.fontFamily) {
    root.style.setProperty('--font-family', theme.fontFamily)
  }

  // Border radius
  if (theme.borderRadius) {
    root.style.setProperty('--border-radius', theme.borderRadius)
    root.style.setProperty('--border-radius-sm', `calc(${theme.borderRadius} * 0.5)`)
    root.style.setProperty('--border-radius-lg', `calc(${theme.borderRadius} * 1.5)`)
    root.style.setProperty('--border-radius-xl', `calc(${theme.borderRadius} * 2)`)
  }
}

/**
 * Obtiene el valor de una CSS variable
 */
export function getCSSVariable(variableName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim()
}

/**
 * Establece una CSS variable
 */
export function setCSSVariable(variableName: string, value: string): void {
  document.documentElement.style.setProperty(variableName, value)
}

// ============================================================================
// THEME UTILITIES
// ============================================================================

/**
 * Verifica si un color es oscuro (para determinar color de texto)
 */
export function isColorDark(hex: string): boolean {
  const rgb = hexToRgb(hex)
  if (!rgb) return false

  // Fórmula de luminancia relativa
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance < 0.5
}

/**
 * Obtiene color de texto apropiado (blanco o negro) según el fondo
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isColorDark(backgroundColor) ? '#ffffff' : '#000000'
}

/**
 * Genera tema completo a partir de un color primario
 */
export function generateCompleteTheme(primaryColor: string): ApplicationTheme {
  return {
    primaryColor,
    secondaryColor: getAnalogousColor(primaryColor, 30),
    accentColor: getAnalogousColor(primaryColor, 60),
    successColor: '#10b981',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    infoColor: '#3b82f6',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: '0.5rem',
    defaultMode: 'system',
    useGradients: true,
    gradientStyle: 'linear',
    gradientDirection: 135
  }
}

export default {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  lightenColor,
  darkenColor,
  adjustSaturation,
  getComplementaryColor,
  getAnalogousColor,
  generateColorScale,
  generateGradients,
  applyCSSVariables,
  getCSSVariable,
  setCSSVariable,
  isColorDark,
  getContrastTextColor,
  generateCompleteTheme
}
