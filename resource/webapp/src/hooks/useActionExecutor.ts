/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   ENHANCED DATA TABLE - ACTIONS CONFIG                     ║
 * ║                                                                            ║
 * ║  Sistema de acciones configurables para DataTable                         ║
 * ║  - Acciones globales y por registro                                       ║
 * ║  - Soporte para API, navegación, modales, descargas                       ║
 * ║  - Confirmaciones y permisos                                              ║
 * ║  - Ejecutor de acciones desacoplado                                       ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { ActionConfig } from '@/config/applications.config'
import toast from 'react-hot-toast'

// ============================================================================
// TYPES
// ============================================================================

export interface ActionContext<T = any> {
  /** Registro actual (para acciones por fila) */
  record?: T
  
  /** Registros seleccionados (para acciones masivas) */
  selectedRecords?: T[]
  
  /** IDs seleccionados */
  selectedIds?: (string | number)[]
  
  /** Datos adicionales del contexto */
  metadata?: Record<string, any>
}

export interface ActionExecutionResult {
  success: boolean
  message?: string
  data?: any
  error?: Error
}

// ============================================================================
// HOOK: useActionExecutor
// ============================================================================

/**
 * Hook para ejecutar acciones configurables
 */
export function useActionExecutor<T = any>() {
  const navigate = useNavigate()

  /**
   * Verifica permisos (implementar según tu sistema de permisos)
   */
  const checkPermissions = useCallback((requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    // TODO: Implementar verificación real de permisos
    // Por ahora, retornamos true (permitir todo)
    // En producción, verificar contra el usuario actual
    return true
  }, [])

  /**
   * Evalúa condición de deshabilitado
   */
  const evaluateDisabledCondition = useCallback(
    (condition?: string, context?: ActionContext<T>): boolean => {
      if (!condition) return false

      try {
        // Evaluar expresión simple
        // Ejemplo: "record.status === 'inactive'"
        // En producción, usar una librería segura para evaluación
        // eslint-disable-next-line no-new-func
        const fn = new Function('record', 'selectedRecords', 'selectedIds', `return ${condition}`)
        return fn(context?.record, context?.selectedRecords, context?.selectedIds)
      } catch (error) {
        console.error('Error evaluating disabled condition:', error)
        return false
      }
    },
    []
  )

  /**
   * Muestra confirmación si es requerida
   */
  const showConfirmation = useCallback(
    async (message: string): Promise<boolean> => {
      // En producción, usar un modal de confirmación personalizado
      return window.confirm(message)
    },
    []
  )

  /**
   * Ejecuta acción tipo 'function'
   */
  const executeFunctionAction = useCallback(
    async (config: ActionConfig['config'], context: ActionContext<T>): Promise<ActionExecutionResult> => {
      try {
        // Buscar función en el contexto global o en window
        const fnName = config.functionName
        if (!fnName) {
          throw new Error('Function name not provided')
        }

        // Nota: En producción, las funciones deben registrarse en un registro global
        // en lugar de usar window
        const fn = (window as any)[fnName]

        if (typeof fn !== 'function') {
          throw new Error(`Function '${fnName}' not found`)
        }

        const result = await fn(context)

        return {
          success: true,
          message: config.successMessage || 'Acción ejecutada correctamente',
          data: result
        }
      } catch (error) {
        return {
          success: false,
          message: config.errorMessage || 'Error al ejecutar la acción',
          error: error as Error
        }
      }
    },
    []
  )

  /**
   * Ejecuta acción tipo 'api'
   */
  const executeAPIAction = useCallback(
    async (config: ActionConfig['config'], context: ActionContext<T>): Promise<ActionExecutionResult> => {
      try {
        if (!config.endpoint) {
          throw new Error('API endpoint not provided')
        }

        const response = await axios({
          method: config.method || 'POST',
          url: config.endpoint,
          data: {
            record: context.record,
            selectedIds: context.selectedIds,
            metadata: context.metadata
          }
        })

        toast.success(config.successMessage || 'Acción ejecutada correctamente')

        return {
          success: true,
          message: config.successMessage || 'Acción ejecutada correctamente',
          data: response.data
        }
      } catch (error) {
        const errorMsg = config.errorMessage || 'Error al ejecutar la acción'
        toast.error(errorMsg)

        return {
          success: false,
          message: errorMsg,
          error: error as Error
        }
      }
    },
    []
  )

  /**
   * Ejecuta acción tipo 'navigate'
   */
  const executeNavigateAction = useCallback(
    async (config: ActionConfig['config'], context: ActionContext<T>): Promise<ActionExecutionResult> => {
      try {
        if (!config.path) {
          throw new Error('Navigation path not provided')
        }

        // Reemplazar variables en el path
        let path = config.path
        if (context.record) {
          // Reemplazar {id}, {slug}, etc.
          path = path.replace(/\{(\w+)\}/g, (_, key) => {
            return (context.record as any)[key] || ''
          })
        }

        navigate(path)

        return {
          success: true,
          message: 'Navegación exitosa'
        }
      } catch (error) {
        return {
          success: false,
          message: 'Error al navegar',
          error: error as Error
        }
      }
    },
    [navigate]
  )

  /**
   * Ejecuta acción tipo 'modal'
   */
  const executeModalAction = useCallback(
    async (config: ActionConfig['config'], context: ActionContext<T>): Promise<ActionExecutionResult> => {
      try {
        if (!config.modalId) {
          throw new Error('Modal ID not provided')
        }

        // Emitir evento personalizado para abrir modal
        const event = new CustomEvent('openModal', {
          detail: {
            modalId: config.modalId,
            context
          }
        })
        window.dispatchEvent(event)

        return {
          success: true,
          message: 'Modal abierto'
        }
      } catch (error) {
        return {
          success: false,
          message: 'Error al abrir modal',
          error: error as Error
        }
      }
    },
    []
  )

  /**
   * Ejecuta acción tipo 'download'
   */
  const executeDownloadAction = useCallback(
    async (config: ActionConfig['config'], context: ActionContext<T>): Promise<ActionExecutionResult> => {
      try {
        if (!config.endpoint) {
          throw new Error('Download endpoint not provided')
        }

        const response = await axios({
          method: config.method || 'GET',
          url: config.endpoint,
          responseType: 'blob',
          params: {
            ids: context.selectedIds
          }
        })

        // Crear link de descarga
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `export-${Date.now()}.csv`)
        document.body.appendChild(link)
        link.click()
        link.remove()

        toast.success(config.successMessage || 'Descarga iniciada')

        return {
          success: true,
          message: config.successMessage || 'Descarga iniciada'
        }
      } catch (error) {
        toast.error(config.errorMessage || 'Error al descargar')

        return {
          success: false,
          message: config.errorMessage || 'Error al descargar',
          error: error as Error
        }
      }
    },
    []
  )

  /**
   * Ejecuta una acción configurada
   */
  const executeAction = useCallback(
    async (action: ActionConfig, context: ActionContext<T>): Promise<ActionExecutionResult> => {
      try {
        // Verificar permisos
        if (!checkPermissions(action.requiredPermissions)) {
          toast.error('No tienes permisos para ejecutar esta acción')
          return {
            success: false,
            message: 'Permisos insuficientes'
          }
        }

        // Verificar condición de deshabilitado
        if (evaluateDisabledCondition(action.config.disabledWhen, context)) {
          toast.error('Esta acción no está disponible')
          return {
            success: false,
            message: 'Acción no disponible'
          }
        }

        // Mostrar confirmación si es requerida
        if (action.config.requireConfirmation) {
          const message = action.config.confirmMessage || '¿Estás seguro de que deseas continuar?'
          const confirmed = await showConfirmation(message)

          if (!confirmed) {
            return {
              success: false,
              message: 'Acción cancelada'
            }
          }
        }

        // Ejecutar según tipo
        switch (action.type) {
          case 'function':
            return await executeFunctionAction(action.config, context)

          case 'api':
            return await executeAPIAction(action.config, context)

          case 'navigate':
            return await executeNavigateAction(action.config, context)

          case 'modal':
            return await executeModalAction(action.config, context)

          case 'download':
            return await executeDownloadAction(action.config, context)

          default:
            throw new Error(`Unknown action type: ${action.type}`)
        }
      } catch (error) {
        console.error('Error executing action:', error)
        toast.error('Error al ejecutar la acción')

        return {
          success: false,
          message: 'Error inesperado',
          error: error as Error
        }
      }
    },
    [
      checkPermissions,
      evaluateDisabledCondition,
      showConfirmation,
      executeFunctionAction,
      executeAPIAction,
      executeNavigateAction,
      executeModalAction,
      executeDownloadAction
    ]
  )

  return {
    executeAction,
    checkPermissions,
    evaluateDisabledCondition
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Convierte ActionConfig a formato compatible con DataTable
 */
export function convertActionConfigToTableAction<T = any>(
  actions: ActionConfig[],
  executeAction: (action: ActionConfig, context: ActionContext<T>) => Promise<ActionExecutionResult>
) {
  return actions.map((action) => ({
    label: action.label,
    icon: action.icon,
    variant: action.variant || 'ghost',
    onClick: async (record?: T, selectedIds?: (string | number)[]) => {
      const context: ActionContext<T> = {
        record,
        selectedIds,
        selectedRecords: selectedIds ? [] : undefined // Populate if needed
      }
      return await executeAction(action, context)
    },
    disabled: (record?: T) => {
      // Evaluar condición de deshabilitado si existe
      if (!action.config.disabledWhen) return false
      
      try {
        // eslint-disable-next-line no-new-func
        const fn = new Function('record', `return ${action.config.disabledWhen}`)
        return fn(record)
      } catch {
        return false
      }
    }
  }))
}

export default useActionExecutor
