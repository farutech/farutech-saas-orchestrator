/**
 * Theme Factory - Farutech Design System
 * Creates theme objects for different modules
 */

import { colors, typography, spacing, shadows, borderRadius } from '../tokens'
import type { Theme, ModuleTheme, ThemeMode } from './types'

export function createTheme(moduleName: ModuleTheme, mode: ThemeMode = 'light'): Theme {
  const moduleColors = moduleName === 'default' 
    ? colors.brand 
    : colors.modules[moduleName as keyof typeof colors.modules]

  const isDark = mode === 'dark'

  return {
    name: moduleName,
    mode,
    colors: {
      primary: moduleColors.primary.hsl,
      primaryForeground: '0 0% 100%',
      secondary: moduleColors.secondary.hsl,
      secondaryForeground: '0 0% 100%',
      accent: moduleColors.accent.hsl,
      accentForeground: '0 0% 100%',
      background: isDark ? '222 47% 6%' : '220 20% 97%',
      foreground: isDark ? '220 14% 96%' : '222 47% 11%',
      surface: isDark ? '222 47% 11%' : '0 0% 100%',
      border: isDark ? '222 30% 18%' : '220 13% 91%',
      muted: isDark ? '222 47% 11%' : '220 14% 96%',
      mutedForeground: isDark ? '220 14% 70%' : '220 9% 46%',
      text: {
        primary: isDark ? colors.neutral[50] : colors.neutral[900],
        secondary: isDark ? colors.neutral[300] : colors.neutral[500],
        tertiary: isDark ? colors.neutral[400] : colors.neutral[300],
        inverse: isDark ? colors.neutral[900] : colors.neutral[50],
      },
      semantic: {
        success: colors.semantic.success.hsl,
        warning: colors.semantic.warning.hsl,
        error: colors.semantic.error.hsl,
        info: colors.semantic.info.hsl,
      },
    },
    spacing,
    typography,
    shadows: isDark ? shadows : shadows,
    borderRadius,
  }
}

// Pre-built themes
export const defaultTheme = createTheme('default', 'light')
export const medicalTheme = createTheme('medical', 'light')
export const vetTheme = createTheme('vet', 'light')
export const erpTheme = createTheme('erp', 'light')
export const posTheme = createTheme('pos', 'light')

// Dark variants
export const defaultThemeDark = createTheme('default', 'dark')
export const medicalThemeDark = createTheme('medical', 'dark')
export const vetThemeDark = createTheme('vet', 'dark')
export const erpThemeDark = createTheme('erp', 'dark')
export const posThemeDark = createTheme('pos', 'dark')
