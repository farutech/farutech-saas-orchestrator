/**
 * Error Boundary para capturar errores de React
 */

import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { ServerErrorPage } from '@/pages/errors/ServerErrorPage'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el state para que el siguiente render muestre la UI de fallback
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error a un servicio de reporte de errores
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // TODO: Enviar a servicio de monitoreo (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo)
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Renderizar UI de fallback personalizada o por defecto
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ServerErrorPage 
          error={this.state.error || undefined}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
