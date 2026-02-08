import { useState } from 'react'
import { CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'

/**
 * 🎨 CodePreview Component
 * 
 * Componente de documentación con pestañas Vista/Código.
 * Permite visualizar el componente renderizado y su código fuente.
 * Incluye botón de copiar código al portapapeles.
 * 
 * @example
 * ```tsx
 * <CodePreview
 *   title="Button Primary"
 *   description="Botón principal para acciones importantes"
 *   preview={<Button variant="primary">Guardar</Button>}
 *   code={`<Button variant="primary">Guardar</Button>`}
 *   language="tsx"
 * />
 * ```
 */

export interface CodePreviewProps {
  /** Título del ejemplo */
  title?: string
  /** Descripción del ejemplo */
  description?: string
  /** Componente a renderizar en la pestaña Vista */
  preview: React.ReactNode
  /** Código fuente a mostrar en la pestaña Código */
  code: string
  /** Lenguaje para syntax highlighting */
  language?: 'tsx' | 'jsx' | 'html' | 'css' | 'javascript' | 'typescript'
  /** Altura mínima del área de preview */
  minHeight?: string
  /** Mostrar grid de fondo para visualizar componentes transparentes */
  showGrid?: boolean
}

export const CodePreview = ({
  title,
  description,
  preview,
  code,
  language = 'tsx',
  minHeight = '200px',
  showGrid = false,
}: CodePreviewProps) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'preview'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              🖥️ Vista
              {activeTab === 'preview' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === 'code'
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              💻 Código
              {activeTab === 'code' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400" />
              )}
            </button>
          </div>

          {/* Copy Button */}
          {activeTab === 'code' && (
            <button
              onClick={handleCopy}
              className="mr-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-4 w-4 text-green-600" />
                  Copiado
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copiar
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {activeTab === 'preview' ? (
          <div
            className={`p-6 ${
              showGrid
                ? 'bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_14px]'
                : ''
            }`}
            style={{ minHeight }}
          >
            <div className="flex items-center justify-center">
              {preview}
            </div>
          </div>
        ) : (
          <div className="relative">
            <CodeBlock code={code} language={language} />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 📝 CodeBlock Component
 * Muestra código con syntax highlighting básico
 */
interface CodeBlockProps {
  code: string
  language: string
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  // Syntax highlighting básico (se puede mejorar con librerías como Prism o Highlight.js)
  const highlightedCode = code
    .replace(/(&lt;|<)(\/?[\w-]+)/g, '<span class="text-blue-600 dark:text-blue-400">&lt;$2</span>')
    .replace(/(\w+)=/g, '<span class="text-purple-600 dark:text-purple-400">$1</span>=')
    .replace(/"([^"]*)"/g, '<span class="text-green-600 dark:text-green-400">"$1"</span>')
    .replace(/'([^']*)'/g, '<span class="text-green-600 dark:text-green-400">\'$1\'</span>')
    .replace(/\b(const|let|var|function|return|import|export|from|default|interface|type|extends|implements)\b/g, '<span class="text-pink-600 dark:text-pink-400">$1</span>')
    .replace(/\/\/(.*)/g, '<span class="text-gray-500 dark:text-gray-400">//$1</span>')

  return (
    <div className="relative">
      {/* Language Badge */}
      <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
        {language}
      </div>

      {/* Code */}
      <pre className="p-6 overflow-x-auto bg-gray-50 dark:bg-gray-900 text-sm leading-relaxed">
        <code
          className="text-gray-800 dark:text-gray-200 font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </pre>
    </div>
  )
}

/**
 * 📚 CodePreviewGroup Component
 * Agrupa múltiples ejemplos de código en una sección
 */
export interface CodePreviewGroupProps {
  title?: string
  description?: string
  children: React.ReactNode
}

export const CodePreviewGroup = ({
  title,
  description,
  children,
}: CodePreviewGroupProps) => {
  return (
    <div className="space-y-6">
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-8">
        {children}
      </div>
    </div>
  )
}
