import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GlobalLoading } from '@/components/ui/GlobalLoading'

export function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    // Por defecto usa variante aleatoria
    // Puedes especificar: variant="flip" o usar customLoader={<TuComponente />}
    return <GlobalLoading variant="random" message="Cargando..." />
  }

  if (!user) {
    // No autenticado -> redirigir al login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
