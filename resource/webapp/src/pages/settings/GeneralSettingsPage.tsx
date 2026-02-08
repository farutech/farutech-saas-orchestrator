/**
 * Página de Configuración General
 * Permite personalizar la marca y parámetros generales del dashboard
 */

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Alert } from '@/components/ui/Alert'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { useConfig } from '@/contexts/ConfigContext'
import { notify } from '@/store/notificationStore'
import {
  SparklesIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import type { BrandConfig } from '@/types'

export function GeneralSettingsPage() {
  const { config, updateConfig, resetConfig, isLoading } = useConfig()
  const [formData, setFormData] = useState<BrandConfig>(config)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // Estado para manejar las imágenes cargadas (para futuro uso con API de upload)
  const [_logoFile, _setLogoFile] = useState<File | null>(null)
  const [_logoFullFile, _setLogoFullFile] = useState<File | null>(null)

  // Sincronizar formData con config cuando carga
  useEffect(() => {
    setFormData(config)
  }, [config])

  // Detectar cambios
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(config)
    setHasChanges(changed)
  }, [formData, config])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // TODO: Aquí deberías subir las imágenes a un servidor
      // Por ahora, solo guardamos las URLs de preview
      await updateConfig(formData)
      notify.success('Configuración actualizada', 'Los cambios se han guardado correctamente')
      setHasChanges(false)
    } catch (error) {
      notify.error('Error al guardar', 'No se pudieron guardar los cambios. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoChange = (file: File | null, previewUrl: string | null) => {
    if (file) _setLogoFile(file) // Guardar para futuro uso con API
    if (previewUrl) {
      setFormData((prev) => ({ ...prev, logoUrl: previewUrl }))
    }
  }

  const handleLogoFullChange = (file: File | null, previewUrl: string | null) => {
    if (file) _setLogoFullFile(file) // Guardar para futuro uso con API
    if (previewUrl) {
      setFormData((prev) => ({ ...prev, logoFullUrl: previewUrl }))
    }
  }

  const handleReset = () => {
    if (confirm('¿Estás seguro de restaurar la configuración por defecto?')) {
      resetConfig()
      notify.info('Configuración restaurada', 'Se han restablecido los valores por defecto')
    }
  }

  const handleCancel = () => {
    setFormData(config)
    setHasChanges(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configuración General
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Personaliza la marca y apariencia de tu dashboard
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckIcon className="h-5 w-5" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Alert info */}
      <Alert variant="info" title="Configuración de marca SaaS">
        Estos cambios afectarán la apariencia de tu dashboard. Los campos marcados como "Solo lectura" son gestionados por el sistema.
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Preview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Vista previa
              </h2>
            </div>
            
            <div className="space-y-6">
              {/* Logo corto preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo corto
                </p>
                <div className="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="h-16 w-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/Logo.png'
                      }}
                    />
                  ) : (
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Logo completo preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logo completo
                </p>
                <div className="flex items-center justify-center h-24 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  {formData.logoFullUrl ? (
                    <img
                      src={formData.logoFullUrl}
                      alt="Logo full preview"
                      className="h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/Logo_Full.png'
                      }}
                    />
                  ) : (
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Brand name preview */}
              <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Nombre de marca
                </p>
                <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                  {formData.brandName || 'Sin nombre'}
                </p>
              </div>

              {/* Tab title preview */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Título del tab
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {formData.pageTitle || 'Sin título'}
                </p>
              </div>
            </div>
          </Card>

          {/* Acción de reset */}
          <Button
            variant="secondary"
            fullWidth
            onClick={handleReset}
            className="gap-2"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Restaurar valores por defecto
          </Button>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información de la marca */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información de la marca
              </h2>
            </div>

            <div className="space-y-5">
              <Input
                label="Nombre de la marca"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Ej: FaruTech"
                helperText="Este nombre aparecerá en todo el dashboard"
              />

              <Input
                label="Título del navegador"
                name="pageTitle"
                value={formData.pageTitle}
                onChange={handleChange}
                placeholder="Ej: FaruTech - Admin Panel"
                helperText="Título que aparece en la pestaña del navegador"
              />

              <Textarea
                label="Descripción"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Descripción breve de tu plataforma"
                rows={3}
                helperText="Aparece en la página de login y otros lugares"
              />
            </div>
          </Card>

          {/* Logos */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <PhotoIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Logos y recursos
              </h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Logo corto (cuadrado)"
                  currentImage={formData.logoUrl}
                  onImageChange={handleLogoChange}
                  helperText="Usado en el sidebar, favicon, etc. Formato cuadrado recomendado (128x128px)"
                  aspectRatio="square"
                  maxSizeMB={2}
                />

                <ImageUpload
                  label="Logo completo (horizontal)"
                  currentImage={formData.logoFullUrl}
                  onImageChange={handleLogoFullChange}
                  helperText="Usado en la página de login y header. Formato horizontal recomendado"
                  aspectRatio="wide"
                  maxSizeMB={2}
                />
              </div>

              <Alert variant="info" title="Nota sobre la carga de imágenes">
                <p className="text-sm">
                  Las imágenes se guardan automáticamente como base64 en el navegador. 
                  Para producción, estas imágenes deberían subirse a un servidor o servicio de almacenamiento en la nube (S3, CloudFlare R2, etc.)
                </p>
              </Alert>
            </div>
          </Card>

          {/* Información del sistema (solo lectura) */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <DocumentTextIcon className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información del sistema
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                Solo lectura
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Versión
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {config.version || 'v1.0.0'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Copyright
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {config.copyright || '© 2025'}
                  </p>
                </div>
              </div>

              <Alert variant="info">
                <p className="text-sm">
                  Estos valores son gestionados por el sistema y no pueden ser modificados manualmente.
                </p>
              </Alert>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettingsPage
