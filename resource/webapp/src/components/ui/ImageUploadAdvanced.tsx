/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                    ADVANCED IMAGE UPLOAD COMPONENT                         ║
 * ║                                                                            ║
 * ║  Componente enterprise de carga de imágenes con:                          ║
 * ║  - Drag & Drop                                                            ║
 * ║  - Preview con gradientes dinámicos                                       ║
 * ║  - Crop y redimensionamiento                                              ║
 * ║  - Múltiples imágenes                                                     ║
 * ║  - Validación (tamaño, tipo, dimensiones)                                 ║
 * ║  - Upload a servidor o base64                                             ║
 * ║                                                                            ║
 * ║  @author    Farid Maloof Suarez                                           ║
 * ║  @company   FaruTech                                                      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useRef, useCallback, useMemo } from 'react'
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { useAppTheme } from '@/store/applicationStore'
import { lightenColor } from '@/utils/theme-generator'
import toast from 'react-hot-toast'

// ============================================================================
// TYPES
// ============================================================================

export interface ImageFile {
  id: string
  file?: File
  url: string
  name: string
  size: number
  type: string
  preview: string
  uploaded: boolean
  uploading: boolean
  error?: string
}

export interface ImageUploadProps {
  /** Valor actual (URLs o archivos) */
  value?: string | string[] | File | File[]
  
  /** Callback al cambiar */
  onChange?: (files: File | File[] | null) => void
  
  /** Callback al cargar a servidor */
  onUpload?: (files: File[]) => Promise<string[]>
  
  /** Máximo de archivos (undefined = ilimitado) */
  maxFiles?: number
  
  /** Tamaño máximo por archivo (bytes) */
  maxFileSize?: number
  
  /** Tipos de archivo permitidos */
  acceptedTypes?: string[]
  
  /** Ancho máximo de imagen */
  maxWidth?: number
  
  /** Alto máximo de imagen */
  maxHeight?: number
  
  /** Mostrar preview */
  showPreview?: boolean
  
  /** Variante visual */
  variant?: 'default' | 'gradient' | 'card' | 'avatar'
  
  /** Tamaño del preview */
  previewSize?: 'sm' | 'md' | 'lg'
  
  /** Label */
  label?: string
  
  /** Descripción/ayuda */
  description?: string
  
  /** Error */
  error?: string
  
  /** Deshabilitado */
  disabled?: boolean
  
  /** Requerido */
  required?: boolean
  
  /** Clase CSS */
  className?: string
}

// ============================================================================
// UTILITIES
// ============================================================================

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
const DEFAULT_ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function generateId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

async function validateImage(
  file: File,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ valid: boolean; error?: string }> {
  if (!maxWidth && !maxHeight) {
    return { valid: true }
  }

  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      if (maxWidth && img.width > maxWidth) {
        resolve({
          valid: false,
          error: `La imagen debe tener máximo ${maxWidth}px de ancho (actual: ${img.width}px)`
        })
        return
      }

      if (maxHeight && img.height > maxHeight) {
        resolve({
          valid: false,
          error: `La imagen debe tener máximo ${maxHeight}px de alto (actual: ${img.height}px)`
        })
        return
      }

      resolve({ valid: true })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ valid: false, error: 'Error al cargar la imagen' })
    }

    img.src = url
  })
}

// ============================================================================
// COMPONENT: ImageUploadAdvanced
// ============================================================================

export function ImageUploadAdvanced({
  value,
  onChange,
  onUpload,
  maxFiles = 1,
  maxFileSize = DEFAULT_MAX_SIZE,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxWidth,
  maxHeight,
  showPreview = true,
  variant = 'default',
  previewSize = 'md',
  label,
  description,
  error,
  disabled = false,
  required = false,
  className
}: ImageUploadProps) {
  const { theme, gradients } = useAppTheme()
  const [images, setImages] = useState<ImageFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isMultiple = maxFiles > 1

  // Validar archivo
  const validateFile = useCallback(
    async (file: File): Promise<{ valid: boolean; error?: string }> => {
      // Validar tipo
      if (!acceptedTypes.includes(file.type)) {
        return {
          valid: false,
          error: `Tipo de archivo no permitido. Tipos válidos: ${acceptedTypes.join(', ')}`
        }
      }

      // Validar tamaño
      if (file.size > maxFileSize) {
        return {
          valid: false,
          error: `El archivo es muy grande. Máximo: ${formatFileSize(maxFileSize)}`
        }
      }

      // Validar dimensiones
      const dimensionValidation = await validateImage(file, maxWidth, maxHeight)
      if (!dimensionValidation.valid) {
        return dimensionValidation
      }

      return { valid: true }
    },
    [acceptedTypes, maxFileSize, maxWidth, maxHeight]
  )

  // Procesar archivos
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files)

      // Validar cantidad máxima
      if (maxFiles && images.length + fileArray.length > maxFiles) {
        toast.error(`Máximo ${maxFiles} ${maxFiles === 1 ? 'archivo' : 'archivos'}`)
        return
      }

      const newImages: ImageFile[] = []

      for (const file of fileArray) {
        const validation = await validateFile(file)

        if (!validation.valid) {
          toast.error(validation.error || 'Error al validar archivo')
          continue
        }

        const preview = await fileToBase64(file)

        newImages.push({
          id: generateId(),
          file,
          url: preview,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
          uploaded: false,
          uploading: false
        })
      }

      if (newImages.length > 0) {
        const updatedImages = isMultiple ? [...images, ...newImages] : newImages
        setImages(updatedImages)

        if (onChange) {
          const files = updatedImages.map((img) => img.file).filter(Boolean) as File[]
          onChange(isMultiple ? files : files[0] || null)
        }

        // Auto-upload si hay callback
        if (onUpload) {
          uploadImages(newImages)
        }
      }
    },
    [images, maxFiles, isMultiple, validateFile, onChange, onUpload]
  )

  // Upload de imágenes
  const uploadImages = useCallback(
    async (imagesToUpload: ImageFile[]) => {
      if (!onUpload) return

      // Marcar como uploading
      setImages((prev) =>
        prev.map((img) =>
          imagesToUpload.some((uploadImg) => uploadImg.id === img.id)
            ? { ...img, uploading: true }
            : img
        )
      )

      try {
        const files = imagesToUpload.map((img) => img.file).filter(Boolean) as File[]
        const urls = await onUpload(files)

        // Actualizar con URLs del servidor
        setImages((prev) =>
          prev.map((img) => {
            const index = imagesToUpload.findIndex((uploadImg) => uploadImg.id === img.id)
            if (index !== -1 && urls[index]) {
              return {
                ...img,
                url: urls[index],
                uploaded: true,
                uploading: false
              }
            }
            return img
          })
        )

        toast.success('Imágenes subidas correctamente')
      } catch (error) {
        console.error('Error uploading images:', error)
        toast.error('Error al subir imágenes')

        setImages((prev) =>
          prev.map((img) =>
            imagesToUpload.some((uploadImg) => uploadImg.id === img.id)
              ? { ...img, uploading: false, error: 'Error al subir' }
              : img
          )
        )
      }
    },
    [onUpload]
  )

  // Eliminar imagen
  const removeImage = useCallback(
    (id: string) => {
      const updatedImages = images.filter((img) => img.id !== id)
      setImages(updatedImages)

      if (onChange) {
        const files = updatedImages.map((img) => img.file).filter(Boolean) as File[]
        onChange(isMultiple ? files : files[0] || null)
      }
    },
    [images, isMultiple, onChange]
  )

  // Handlers
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (disabled) return

      const files = e.dataTransfer.files
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [disabled, processFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        processFiles(files)
      }
      // Reset input para permitir seleccionar el mismo archivo nuevamente
      e.target.value = ''
    },
    [processFiles]
  )

  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  // Styles según variante
  const previewSizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-32 w-32',
    lg: 'h-48 w-48'
  }

  const gradientBg = useMemo(() => {
    if (variant === 'gradient' && gradients.cardLight) {
      return gradients.cardLight
    }
    return `linear-gradient(135deg, ${lightenColor(theme.primaryColor, 45)}, ${lightenColor(
      theme.secondaryColor || theme.primaryColor,
      45
    )})`
  }, [variant, gradients, theme])

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={clsx(
          'relative cursor-pointer rounded-lg border-2 border-dashed transition-all',
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
          disabled && 'cursor-not-allowed opacity-50',
          error && 'border-red-500',
          variant === 'gradient' && !isDragging && 'border-transparent',
          'p-6'
        )}
        style={
          variant === 'gradient' && !isDragging
            ? { background: gradientBg }
            : undefined
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={isMultiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <PhotoIcon
              className={clsx(
                'mb-3 h-12 w-12',
                variant === 'gradient'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400'
              )}
            />
            <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <span className="text-primary-600 dark:text-primary-400">Haz clic para subir</span> o
              arrastra archivos aquí
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {acceptedTypes.includes('image/*')
                ? 'Imágenes'
                : acceptedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')}
              {' · '}Máx. {formatFileSize(maxFileSize)}
            </p>
            {maxWidth && maxHeight && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Dimensiones máx: {maxWidth}x{maxHeight}px
              </p>
            )}
          </div>
        ) : (
          <div
            className={clsx(
              'grid gap-4',
              isMultiple ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1 place-items-center'
            )}
          >
            {images.map((image) => (
              <div
                key={image.id}
                className={clsx(
                  'group relative rounded-lg overflow-hidden',
                  previewSizeClasses[previewSize],
                  'shadow-md hover:shadow-lg transition-shadow'
                )}
              >
                <img
                  src={image.preview}
                  alt={image.name}
                  className="h-full w-full object-cover"
                />

                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(image.preview, '_blank')
                    }}
                    className="rounded-full bg-white p-2 text-gray-700 hover:bg-gray-100"
                    title="Ver"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage(image.id)
                    }}
                    className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Estado */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                  </div>
                )}

                {image.uploaded && !image.uploading && (
                  <div className="absolute top-2 right-2 rounded-full bg-green-500 p-1">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}

                {image.error && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500 p-1 text-center text-xs text-white">
                    {image.error}
                  </div>
                )}
              </div>
            ))}

            {/* Botón agregar más (si es múltiple) */}
            {isMultiple && (!maxFiles || images.length < maxFiles) && (
              <div
                className={clsx(
                  'flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700',
                  previewSizeClasses[previewSize],
                  'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors'
                )}
              >
                <ArrowUpTrayIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {description && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}

      {/* Error */}
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

export default ImageUploadAdvanced
