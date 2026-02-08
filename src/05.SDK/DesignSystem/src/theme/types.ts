/**
 * Theme Types - Farutech Design System
 */

import type { typography, spacing, shadows, borderRadius } from '../tokens'

export type ThemeMode = 'light' | 'dark'
export type ModuleTheme = 'medical' | 'vet' | 'erp' | 'pos' | 'default'

export interface Theme {
  name: ModuleTheme
  mode: ThemeMode
  colors: {
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    accent: string
    accentForeground: string
    background: string
    foreground: string
    surface: string
    border: string
    muted: string
    mutedForeground: string
    text: {
      primary: string
      secondary: string
      tertiary: string
      inverse: string
    }
    semantic: {
      success: string
      warning: string
      error: string
      info: string
    }
  }
  spacing: typeof spacing
  typography: typeof typography
  shadows: typeof shadows
  borderRadius: typeof borderRadius
}

export interface ThemeContextValue {
  theme: Theme
  mode: ThemeMode
  moduleName: ModuleTheme
  setTheme: (moduleName: ModuleTheme) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}
