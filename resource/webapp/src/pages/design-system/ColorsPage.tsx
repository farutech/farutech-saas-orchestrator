import { useState } from 'react'
import { CodePreview } from '../../components/ui/CodePreview'
import { CheckIcon } from '@heroicons/react/24/outline'

/**
 * 🎨 Colors Page
 * 
 * Documentación completa del sistema de colores del Design System.
 * Incluye paleta completa, variantes, usos recomendados y ejemplos.
 */

export default function ColorsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🎨 Sistema de Colores
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Paleta de colores completa del Design System con variantes y guías de uso.
        </p>
      </div>

      {/* Primary Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔵 Colores Primarios
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Colores principales de la marca, usados en botones, enlaces y elementos destacados.
          </p>
        </div>

        <ColorPalette
          name="Primary (Blue)"
          colors={[
            { shade: '50', hex: '#eff6ff', usage: 'Fondos muy claros, hover states' },
            { shade: '100', hex: '#dbeafe', usage: 'Fondos claros, badges' },
            { shade: '200', hex: '#bfdbfe', usage: 'Bordes, divisores sutiles' },
            { shade: '300', hex: '#93c5fd', usage: 'Hover states, elementos secundarios' },
            { shade: '400', hex: '#60a5fa', usage: 'Elementos interactivos' },
            { shade: '500', hex: '#3b82f6', usage: 'Color principal por defecto' },
            { shade: '600', hex: '#2563eb', usage: 'Botones primarios, enlaces (DS Token)' },
            { shade: '700', hex: '#1d4ed8', usage: 'Hover de botones primarios' },
            { shade: '800', hex: '#1e40af', usage: 'Estados presionados' },
            { shade: '900', hex: '#1e3a8a', usage: 'Textos oscuros sobre fondos claros' },
          ]}
        />

        <CodePreview
          title="Uso de colores primarios"
          preview={
            <div className="space-y-4">
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                Botón Primary
              </button>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                <p className="text-primary-900 dark:text-primary-100">
                  Contenedor con fondo primary suave
                </p>
              </div>
            </div>
          }
          code={`<!-- Botón primary -->
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Botón Primary
</button>

<!-- Container con fondo primary -->
<div className="bg-primary-50 border border-primary-200">
  Contenedor con fondo primary suave
</div>

<!-- Con tokens CSS -->
<div style={{ 
  backgroundColor: 'var(--color-primary)',
  color: '#fff'
}}>
  Usando token CSS
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
            Colores para feedback, notificaciones y estados del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Success */}
          <ColorPalette
            name="Success (Green)"
            colors={[
              { shade: '50', hex: '#f0fdf4', usage: 'Fondos success muy claros' },
              { shade: '100', hex: '#dcfce7', usage: 'Fondos success claros' },
              { shade: '200', hex: '#bbf7d0', usage: 'Bordes success' },
              { shade: '300', hex: '#86efac', usage: 'Hover states success' },
              { shade: '400', hex: '#4ade80', usage: 'Elementos success' },
              { shade: '500', hex: '#22c55e', usage: 'Success por defecto' },
              { shade: '600', hex: '#16a34a', usage: 'Botones success (DS Token)' },
              { shade: '700', hex: '#15803d', usage: 'Hover success' },
              { shade: '800', hex: '#166534', usage: 'Estados presionados' },
              { shade: '900', hex: '#14532d', usage: 'Textos oscuros' },
            ]}
          />

          {/* Warning */}
          <ColorPalette
            name="Warning (Yellow)"
            colors={[
              { shade: '50', hex: '#fefce8', usage: 'Fondos warning muy claros' },
              { shade: '100', hex: '#fef9c3', usage: 'Fondos warning claros' },
              { shade: '200', hex: '#fef08a', usage: 'Bordes warning' },
              { shade: '300', hex: '#fde047', usage: 'Hover states warning' },
              { shade: '400', hex: '#facc15', usage: 'Elementos warning' },
              { shade: '500', hex: '#eab308', usage: 'Warning por defecto' },
              { shade: '600', hex: '#ca8a04', usage: 'Botones warning (DS Token)' },
              { shade: '700', hex: '#a16207', usage: 'Hover warning' },
              { shade: '800', hex: '#854d0e', usage: 'Estados presionados' },
              { shade: '900', hex: '#713f12', usage: 'Textos oscuros' },
            ]}
          />

          {/* Error */}
          <ColorPalette
            name="Error (Red)"
            colors={[
              { shade: '50', hex: '#fef2f2', usage: 'Fondos error muy claros' },
              { shade: '100', hex: '#fee2e2', usage: 'Fondos error claros' },
              { shade: '200', hex: '#fecaca', usage: 'Bordes error' },
              { shade: '300', hex: '#fca5a5', usage: 'Hover states error' },
              { shade: '400', hex: '#f87171', usage: 'Elementos error' },
              { shade: '500', hex: '#ef4444', usage: 'Error por defecto' },
              { shade: '600', hex: '#dc2626', usage: 'Botones error (DS Token)' },
              { shade: '700', hex: '#b91c1c', usage: 'Hover error' },
              { shade: '800', hex: '#991b1b', usage: 'Estados presionados' },
              { shade: '900', hex: '#7f1d1d', usage: 'Textos oscuros' },
            ]}
          />

          {/* Info */}
          <ColorPalette
            name="Info (Cyan)"
            colors={[
              { shade: '50', hex: '#ecfeff', usage: 'Fondos info muy claros' },
              { shade: '100', hex: '#cffafe', usage: 'Fondos info claros' },
              { shade: '200', hex: '#a5f3fc', usage: 'Bordes info' },
              { shade: '300', hex: '#67e8f9', usage: 'Hover states info' },
              { shade: '400', hex: '#22d3ee', usage: 'Elementos info' },
              { shade: '500', hex: '#06b6d4', usage: 'Info por defecto' },
              { shade: '600', hex: '#0891b2', usage: 'Botones info (DS Token)' },
              { shade: '700', hex: '#0e7490', usage: 'Hover info' },
              { shade: '800', hex: '#155e75', usage: 'Estados presionados' },
              { shade: '900', hex: '#164e63', usage: 'Textos oscuros' },
            ]}
          />
        </div>

        <CodePreview
          title="Ejemplos de estados"
          preview={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatusCard variant="success" title="Éxito" message="Operación completada" />
              <StatusCard variant="warning" title="Advertencia" message="Revisar datos" />
              <StatusCard variant="error" title="Error" message="Acción fallida" />
              <StatusCard variant="info" title="Info" message="Información adicional" />
            </div>
          }
          code={`<!-- Success -->
<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
  <h3 className="text-green-900 font-semibold">Éxito</h3>
  <p className="text-green-700">Operación completada</p>
</div>

<!-- Warning -->
<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
  <h3 className="text-yellow-900 font-semibold">Advertencia</h3>
  <p className="text-yellow-700">Revisar datos</p>
</div>

<!-- Error -->
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <h3 className="text-red-900 font-semibold">Error</h3>
  <p className="text-red-700">Acción fallida</p>
</div>

<!-- Info -->
<div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
  <h3 className="text-cyan-900 font-semibold">Info</h3>
  <p className="text-cyan-700">Información adicional</p>
</div>`}
        />
      </section>

      {/* Neutral Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⚪ Colores Neutrales (Grises)
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Escala de grises para textos, fondos, bordes y elementos estructurales.
          </p>
        </div>

        <ColorPalette
          name="Gray"
          colors={[
            { shade: '50', hex: '#f9fafb', usage: 'Fondo general de la app' },
            { shade: '100', hex: '#f3f4f6', usage: 'Fondos secundarios, hover' },
            { shade: '200', hex: '#e5e7eb', usage: 'Bordes sutiles, divisores' },
            { shade: '300', hex: '#d1d5db', usage: 'Bordes normales, placeholders' },
            { shade: '400', hex: '#9ca3af', usage: 'Iconos deshabilitados' },
            { shade: '500', hex: '#6b7280', usage: 'Texto secundario' },
            { shade: '600', hex: '#4b5563', usage: 'Texto normal' },
            { shade: '700', hex: '#374151', usage: 'Texto oscuro' },
            { shade: '800', hex: '#1f2937', usage: 'Headings, texto importante' },
            { shade: '900', hex: '#111827', usage: 'Texto muy oscuro, fondos dark mode' },
          ]}
        />

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 Guía de Uso de Grises
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-50 border border-gray-200 rounded flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">50-100:</strong>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Fondos generales, backgrounds</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-200 border border-gray-300 rounded flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">200-300:</strong>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Bordes, divisores, inputs</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-400 border border-gray-500 rounded flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">400-500:</strong>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Texto secundario, placeholders, iconos</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-700 border border-gray-800 rounded flex-shrink-0" />
              <div>
                <strong className="text-gray-900 dark:text-white">600-900:</strong>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Textos principales, headings, elementos importantes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accent Colors */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🌈 Colores de Acento
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Colores adicionales para categorías, badges, gráficas y elementos decorativos.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AccentColorCard name="Purple" hex="#7B1FA2" usage="Premium, destacados" />
          <AccentColorCard name="Orange" hex="#F57C00" usage="Alertas, destacados cálidos" />
          <AccentColorCard name="Teal" hex="#00897B" usage="Alternativa a success" />
          <AccentColorCard name="Pink" hex="#C2185B" usage="Promociones, femenino" />
          <AccentColorCard name="Indigo" hex="#3F51B5" usage="Alternativa a primary" />
          <AccentColorCard name="Lime" hex="#9E9D24" usage="Eco, natural" />
          <AccentColorCard name="Amber" hex="#FF8F00" usage="Destacados cálidos" />
          <AccentColorCard name="Blue Gray" hex="#546E7A" usage="Neutro con carácter" />
        </div>
      </section>

      {/* Combinations */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎭 Combinaciones Recomendadas
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Ejemplos de combinaciones armoniosas para diferentes contextos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CombinationCard
            title="Professional"
            bg="#1E88E5"
            text="#FFFFFF"
            accent="#F5F6FA"
            description="Blue primary + White + Soft gray"
          />
          <CombinationCard
            title="Success"
            bg="#2E7D32"
            text="#FFFFFF"
            accent="#E8F5E9"
            description="Green + White + Light green"
          />
          <CombinationCard
            title="Warning"
            bg="#F9A825"
            text="#212121"
            accent="#FFF9C4"
            description="Yellow + Dark text + Light yellow"
          />
          <CombinationCard
            title="Error"
            bg="#D32F2F"
            text="#FFFFFF"
            accent="#FFEBEE"
            description="Red + White + Light red"
          />
          <CombinationCard
            title="Premium"
            bg="#7B1FA2"
            text="#FFFFFF"
            accent="#F3E5F5"
            description="Purple + White + Light purple"
          />
          <CombinationCard
            title="Neutral"
            bg="#546E7A"
            text="#FFFFFF"
            accent="#ECEFF1"
            description="Blue Gray + White + Light gray"
          />
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ♿ Accesibilidad de Colores
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Contraste mínimo según WCAG 2.1 para garantizar legibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ✅ Combinaciones Accesibles
            </h3>
            <div className="space-y-3">
              <AccessibilityExample
                bg="bg-primary-600"
                text="text-white"
                ratio="4.5:1"
                label="Primary 600 + White"
                accessible
              />
              <AccessibilityExample
                bg="bg-green-600"
                text="text-white"
                ratio="4.5:1"
                label="Green 600 + White"
                accessible
              />
              <AccessibilityExample
                bg="bg-gray-900"
                text="text-white"
                ratio="21:1"
                label="Gray 900 + White"
                accessible
              />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ❌ Combinaciones NO Accesibles
            </h3>
            <div className="space-y-3">
              <AccessibilityExample
                bg="bg-yellow-400"
                text="text-white"
                ratio="2.1:1"
                label="Yellow 400 + White"
                accessible={false}
              />
              <AccessibilityExample
                bg="bg-gray-300"
                text="text-gray-500"
                ratio="2.8:1"
                label="Gray 300 + Gray 500"
                accessible={false}
              />
              <AccessibilityExample
                bg="bg-primary-100"
                text="text-primary-300"
                ratio="1.5:1"
                label="Primary 100 + Primary 300"
                accessible={false}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Norma WCAG 2.1:</strong> Contraste mínimo de <strong>4.5:1</strong> para texto normal 
            y <strong>3:1</strong> para texto grande (18px+ o 14px+ bold).
          </p>
        </div>
      </section>
    </div>
  )
}

// Helper Components

interface ColorPaletteProps {
  name: string
  colors: Array<{ shade: string; hex: string; usage: string }>
}

const ColorPalette = ({ name, colors }: ColorPaletteProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
      <div className="grid grid-cols-1 gap-2">
        {colors.map((color) => (
          <ColorSwatch key={color.shade} {...color} />
        ))}
      </div>
    </div>
  )
}

const ColorSwatch = ({ shade, hex, usage }: { shade: string; hex: string; usage: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-4 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all"
    >
      <div
        className="w-16 h-12 rounded-md shadow-sm flex-shrink-0"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{shade}</span>
          <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{hex}</code>
          {copied && (
            <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckIcon className="h-3 w-3" />
              Copiado
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{usage}</p>
      </div>
    </button>
  )
}

const StatusCard = ({ variant, title, message }: { variant: string; title: string; message: string }) => {
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    info: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-100',
  }

  return (
    <div className={`p-4 border rounded-lg ${colors[variant as keyof typeof colors]}`}>
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs mt-1 opacity-80">{message}</p>
    </div>
  )
}

const AccentColorCard = ({ name, hex, usage }: { name: string; hex: string; usage: string }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="w-full h-24 rounded-lg shadow-sm mb-3" style={{ backgroundColor: hex }} />
      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{name}</h4>
      <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{hex}</code>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{usage}</p>
    </div>
  )
}

const CombinationCard = ({ 
  title, 
  bg, 
  text, 
  accent, 
  description 
}: { 
  title: string
  bg: string
  text: string
  accent: string
  description: string
}) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{title}</h4>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded shadow-sm" style={{ backgroundColor: bg }} />
          <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{bg}</code>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded shadow-sm border border-gray-200" style={{ backgroundColor: text }} />
          <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{text}</code>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded shadow-sm border border-gray-200" style={{ backgroundColor: accent }} />
          <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{accent}</code>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
      <div 
        className="mt-4 p-3 rounded-lg"
        style={{ backgroundColor: bg, color: text }}
      >
        <p className="text-sm font-medium">Ejemplo</p>
        <p className="text-xs mt-1 opacity-90">Texto sobre fondo principal</p>
      </div>
    </div>
  )
}

const AccessibilityExample = ({ 
  bg, 
  text, 
  ratio, 
  label, 
  accessible 
}: { 
  bg: string
  text: string
  ratio: string
  label: string
  accessible: boolean
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 p-3 ${bg} ${text} rounded-lg`}>
        <p className="text-sm font-medium">Aa</p>
      </div>
      <div className="flex-1 text-sm">
        <div className="flex items-center gap-2">
          {accessible ? (
            <CheckIcon className="h-4 w-4 text-green-600" />
          ) : (
            <span className="text-red-600 text-lg">✕</span>
          )}
          <span className="text-gray-900 dark:text-white font-medium">{ratio}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">{label}</p>
      </div>
    </div>
  )
}
