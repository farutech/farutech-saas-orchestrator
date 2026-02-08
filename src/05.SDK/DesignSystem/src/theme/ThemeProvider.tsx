/**
 * Theme Provider - Farutech Design System
 * Context provider for theme management
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { ThemeMode, ModuleTheme, ThemeContextValue } from './types'
import { createTheme } from './createTheme'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultModule?: ModuleTheme
  defaultMode?: ThemeMode
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultModule = 'erp',
  defaultMode = 'light',
  storageKey = 'farutech-theme',
}: ThemeProviderProps) {
  const [moduleName, setModuleName] = useState<ModuleTheme>(defaultModule)
  const [mode, setMode] = useState<ThemeMode>(defaultMode)

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const { moduleName: storedModule, mode: storedMode } = JSON.parse(stored)
        if (storedModule) setModuleName(storedModule)
        if (storedMode) setMode(storedMode)
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error)
    }
  }, [storageKey])

  // Generate theme based on module and mode
  const theme = useMemo(() => createTheme(moduleName, mode), [moduleName, mode])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    // Toggle dark mode class
    root.classList.toggle('dark', mode === 'dark')

    // Apply CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--color-${key}`, value)
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue)
        })
      }
    })

    // Save to localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify({ moduleName, mode }))
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error)
    }
  }, [theme, mode, moduleName, storageKey])

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setTheme = (newModuleName: ModuleTheme) => {
    setModuleName(newModuleName)
  }

  const value: ThemeContextValue = {
    theme,
    mode,
    moduleName,
    setTheme,
    setMode,
    toggleMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
