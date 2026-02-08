/**
 * Componente para upload de imágenes con preview
 */

import { useState, useRef } from 'react'
import { PhotoIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from './Button'
import clsx from 'clsx'

interface ImageUploadProps {
  label: string
  currentImage?: string
  onImageChange: (file: File | null, previewUrl: string | null) => void
  helperText?: string
  aspectRatio?: 'square' | 'wide' | 'auto'
  maxSizeMB?: number
  accept?: string
}

export function ImageUpload({
  label,
  currentImage,
  onImageChange,
  helperText,
  aspectRatio = 'auto',
  maxSizeMB = 2,
  accept = 'image/png,image/jpeg,image/svg+xml,image/webp',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    setError(null)

    // Validar tamaño
    const sizeMB = file.size / 1024 / 1024
    if (sizeMB > maxSizeMB) {
      setError(`El archivo es muy grande. Máximo ${maxSizeMB}MB`)
      return
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen')
      return
    }

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onImageChange(file, result)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null, null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const getAspectClasses = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'wide':
        return 'aspect-[16/9]'
      default:
        return 'min-h-[200px]'
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div
        className={clsx(
          'relative border-2 border-dashed rounded-xl transition-all duration-200',
          getAspectClasses(),
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
          error && 'border-red-500'
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleClick}
                className="gap-2"
              >
                <ArrowUpTrayIcon className="h-4 w-4" />
                Cambiar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={handleRemove}
                className="gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full p-6 cursor-pointer"
            onClick={handleClick}
          >
            <PhotoIcon className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Haz clic para subir o arrastra aquí
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, SVG o WebP (máx. {maxSizeMB}MB)
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  )
}
