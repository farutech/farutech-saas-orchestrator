import { useState } from 'react'
import { CodePreview } from '../../components/ui/CodePreview'

/**
 * 🎨 Design Tokens Page
 * 
 * Documentación completa del sistema de tokens del Design System.
 * Muestra todos los tokens de color, espaciado, tipografía, sombras, etc.
 */

export default function DesignTokensPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🎨 Design Tokens
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Sistema de tokens CSS para mantener consistencia visual en toda la aplicación.
        </p>
      </div>

      {/* Semantic Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🌈 Colores Semánticos
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Colores base del sistema para fondos, bordes y textos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ColorToken
            name="Primary"
            token="--color-primary"
            description="Color institucional principal"
          />
          <ColorToken
            name="Secondary"
            token="--color-secondary"
            description="Color de soporte o contraste"
          />
          <ColorToken
            name="Background"
            token="--color-background"
            description="Fondo general de la aplicación"
          />
          <ColorToken
            name="Surface"
            token="--color-surface"
            description="Fondo de tarjetas y paneles"
          />
          <ColorToken
            name="Border"
            token="--color-border"
            description="Bordes y divisores"
          />
          <ColorToken
            name="Text Primary"
            token="--color-text-primary"
            description="Texto principal"
          />
          <ColorToken
            name="Text Secondary"
            token="--color-text-secondary"
            description="Texto secundario"
          />
          <ColorToken
            name="Text Tertiary"
            token="--color-text-tertiary"
            description="Texto terciario"
          />
        </div>

        <CodePreview
          title="Uso de colores semánticos"
          preview={
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-primary)' }} />
              <div className="w-24 h-24 rounded-lg shadow-sm" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
            </div>
          }
          code={`<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Primary Color
</div>

<div style={{ 
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)'
}}>
  Surface with Border
</div>`}
        />
      </section>

      {/* Status Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⚠️ Colores de Estado
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Colores para feedback y estados del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ColorToken
            name="Success"
            token="--color-success"
            description="Operaciones exitosas"
          />
          <ColorToken
            name="Info"
            token="--color-info"
            description="Información y notificaciones"
          />
          <ColorToken
            name="Warning"
            token="--color-warning"
            description="Advertencias y avisos"
          />
          <ColorToken
            name="Error"
            token="--color-error"
            description="Errores y validaciones fallidas"
          />
          <ColorToken
            name="Neutral"
            token="--color-neutral"
            description="Estados intermedios"
          />
        </div>

        <CodePreview
          title="Ejemplo de estados"
          preview={
            <div className="flex flex-wrap gap-3">
              <StatusBadge status="success">Éxito</StatusBadge>
              <StatusBadge status="info">Info</StatusBadge>
              <StatusBadge status="warning">Advertencia</StatusBadge>
              <StatusBadge status="error">Error</StatusBadge>
              <StatusBadge status="neutral">Neutral</StatusBadge>
            </div>
          }
          code={`<div style={{ 
  backgroundColor: 'var(--color-success-light)',
  color: 'var(--color-success)',
  padding: '8px 16px',
  borderRadius: '8px'
}}>
  Éxito
</div>`}
        />
      </section>

      {/* Spacing */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📏 Espaciado
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sistema de espaciado basado en múltiplos de 8px.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpacingToken name="XS" token="--space-xs" value="4px" />
          <SpacingToken name="SM" token="--space-sm" value="8px" />
          <SpacingToken name="MD" token="--space-md" value="16px" />
          <SpacingToken name="LG" token="--space-lg" value="24px" />
          <SpacingToken name="XL" token="--space-xl" value="32px" />
          <SpacingToken name="2XL" token="--space-2xl" value="48px" />
          <SpacingToken name="3XL" token="--space-3xl" value="64px" />
        </div>

        <CodePreview
          title="Uso de espaciado"
          preview={
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded" style={{ padding: 'var(--space-sm)' }}>
                SM Padding
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded" style={{ padding: 'var(--space-md)' }}>
                MD Padding
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded" style={{ padding: 'var(--space-lg)' }}>
                LG Padding
              </div>
            </div>
          }
          code={`<div style={{ padding: 'var(--space-md)' }}>
  MD Padding (16px)
</div>`}
        />
      </section>

      {/* Typography */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 Tipografía
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Escalas de tamaño de fuente y pesos tipográficos.
          </p>
        </div>

        <div className="space-y-4">
          <TypographyToken size="4xl" weight="bold">Heading 1 - 4XL Bold</TypographyToken>
          <TypographyToken size="3xl" weight="bold">Heading 2 - 3XL Bold</TypographyToken>
          <TypographyToken size="2xl" weight="semibold">Heading 3 - 2XL Semibold</TypographyToken>
          <TypographyToken size="xl" weight="semibold">Heading 4 - XL Semibold</TypographyToken>
          <TypographyToken size="lg" weight="medium">Heading 5 - LG Medium</TypographyToken>
          <TypographyToken size="base" weight="normal">Body Text - Base Normal</TypographyToken>
          <TypographyToken size="sm" weight="normal">Small Text - SM Normal</TypographyToken>
          <TypographyToken size="xs" weight="normal">Extra Small - XS Normal</TypographyToken>
        </div>

        <CodePreview
          title="Uso de tipografía"
          preview={
            <div className="space-y-2">
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>
                Título Principal
              </h1>
              <p style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-normal)' }}>
                Texto de párrafo con tamaño base.
              </p>
            </div>
          }
          code={`<h1 style={{ 
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-bold)'
}}>
  Título Principal
</h1>`}
        />
      </section>

      {/* Shadows */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🌑 Sombras
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sistema de elevación con sombras predefinidas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShadowToken name="XS" token="--shadow-xs" />
          <ShadowToken name="SM" token="--shadow-sm" />
          <ShadowToken name="MD" token="--shadow-md" />
          <ShadowToken name="LG" token="--shadow-lg" />
          <ShadowToken name="XL" token="--shadow-xl" />
        </div>

        <CodePreview
          title="Uso de sombras"
          preview={
            <div className="flex gap-4">
              <div 
                className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                SM
              </div>
              <div 
                className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-md)' }}
              >
                MD
              </div>
              <div 
                className="w-24 h-24 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              >
                LG
              </div>
            </div>
          }
          code={`<div style={{ boxShadow: 'var(--shadow-md)' }}>
  Card with MD Shadow
</div>`}
        />
      </section>

      {/* Border Radius */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔲 Border Radius
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sistema de bordes redondeados consistente.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <RadiusToken name="SM" token="--radius-sm" />
          <RadiusToken name="MD" token="--radius-md" />
          <RadiusToken name="LG" token="--radius-lg" />
          <RadiusToken name="XL" token="--radius-xl" />
          <RadiusToken name="Full" token="--radius-full" />
        </div>
      </section>
    </div>
  )
}

// Helper Components

const ColorToken = ({ name, token, description }: { name: string; token: string; description: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`var(${token})`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="group p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all text-left"
    >
      <div
        className="w-full h-16 rounded-md mb-3 border border-gray-200 dark:border-gray-700"
        style={{ backgroundColor: `var(${token})` }}
      />
      <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
      <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{token}</code>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">{description}</p>
      {copied && (
        <span className="mt-2 inline-block text-xs text-green-600 dark:text-green-400">
          ✓ Copiado
        </span>
      )}
    </button>
  )
}

const StatusBadge = ({ status, children }: { status: string; children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundColor: `var(--color-${status}-light)`,
        color: `var(--color-${status})`,
        padding: '8px 16px',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        fontWeight: 'var(--font-weight-medium)',
      }}
    >
      {children}
    </div>
  )
}

const SpacingToken = ({ name, token, value }: { name: string; token: string; value: string }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        className="bg-primary-600 dark:bg-primary-500"
        style={{ width: `var(${token})`, height: '40px', minWidth: '4px' }}
      />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
        <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{token}</code>
        <p className="text-xs text-gray-500 dark:text-gray-500">{value}</p>
      </div>
    </div>
  )
}

const TypographyToken = ({ 
  size, 
  weight, 
  children 
}: { 
  size: string
  weight: string
  children: React.ReactNode 
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        style={{
          fontSize: `var(--font-size-${size})`,
          fontWeight: `var(--font-weight-${weight})`,
        }}
      >
        {children}
      </div>
      <div className="mt-2 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
        <code>--font-size-{size}</code>
        <code>--font-weight-{weight}</code>
      </div>
    </div>
  )
}

const ShadowToken = ({ name, token }: { name: string; token: string }) => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
      <div
        className="w-full h-32 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center font-semibold"
        style={{ boxShadow: `var(${token})` }}
      >
        {name}
      </div>
      <code className="mt-3 block text-xs text-gray-600 dark:text-gray-400 font-mono">
        {token}
      </code>
    </div>
  )
}

const RadiusToken = ({ name, token }: { name: string; token: string }) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center">
      <div
        className="w-full h-24 bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white font-semibold"
        style={{ borderRadius: `var(${token})` }}
      >
        {name}
      </div>
      <code className="mt-2 block text-xs text-gray-600 dark:text-gray-400 font-mono">
        {token}
      </code>
    </div>
  )
}
