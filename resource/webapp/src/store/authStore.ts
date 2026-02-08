import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  rememberMe: boolean
  setTokens: (accessToken: string, refreshToken: string, remember?: boolean) => void
  setAccessToken: (token: string | null) => void
  clearAuth: () => void
}

// Custom storage que alterna entre localStorage y sessionStorage
const createDualStorage = () => {
  return createJSONStorage(() => ({
    getItem: (name: string) => {
      // Primero intentar localStorage
      const localValue = localStorage.getItem(name)
      if (localValue) return localValue
      
      // Luego sessionStorage
      return sessionStorage.getItem(name)
    },
    setItem: (name: string, value: string) => {
      try {
        const parsed = JSON.parse(value)
        const state = parsed?.state as Partial<AuthState> | undefined
        
        if (state?.rememberMe) {
          // Si remember me está activado, usar localStorage
          localStorage.setItem(name, value)
          sessionStorage.removeItem(name)
        } else {
          // Si no, usar sessionStorage (se borra al cerrar navegador)
          sessionStorage.setItem(name, value)
          localStorage.removeItem(name)
        }
      } catch {
        // En caso de error, usar sessionStorage por defecto
        sessionStorage.setItem(name, value)
      }
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name)
      sessionStorage.removeItem(name)
    },
  }))
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      rememberMe: false,
      
      setTokens: (accessToken: string, refreshToken: string, remember = false) => 
        set({ accessToken, refreshToken, rememberMe: remember }),
      
      setAccessToken: (token: string | null) => 
        set({ accessToken: token }),
      
      clearAuth: () => 
        set({ accessToken: null, refreshToken: null, rememberMe: false }),
    }),
    {
      name: 'auth-storage',
      storage: createDualStorage(),
    }
  )
)
