import { CodePreview, CodePreviewGroup } from '../../components/ui/CodePreview'

/**
 * 📝 Typography Page
 * 
 * Documentación completa del sistema tipográfico del Design System.
 * Incluye escalas, pesos, line heights y ejemplos de jerarquía.
 */

export default function TypographyPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📝 Sistema Tipográfico
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Escalas de tamaño, pesos, espaciado y jerarquía tipográfica.
        </p>
      </div>

      {/* Font Family */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔤 Familia de Fuentes
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sistema de fuentes optimizado para legibilidad en pantallas.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-normal">Inter Regular</p>
              <code className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
              </code>
            </div>
            <div>
              <p className="text-4xl font-medium">Inter Medium</p>
              <code className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                font-weight: 500
              </code>
            </div>
            <div>
              <p className="text-4xl font-semibold">Inter Semibold</p>
              <code className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                font-weight: 600
              </code>
            </div>
            <div>
              <p className="text-4xl font-bold">Inter Bold</p>
              <code className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
                font-weight: 700
              </code>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Inter</strong> es una fuente de código abierto diseñada específicamente para pantallas digitales. 
            Ofrece excelente legibilidad en tamaños pequeños y cuenta con números tabulares ideales para datos.
          </p>
        </div>
      </section>

      {/* Type Scale */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📏 Escala de Tamaños
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sistema de tamaños basado en una escala armoniosa con tokens CSS.
          </p>
        </div>

        <div className="space-y-6">
          <TypeScaleItem
            size="4xl"
            pixels="36px"
            token="--font-size-4xl"
            usage="Títulos hero, landing pages"
            example="Hero Title"
          />
          <TypeScaleItem
            size="3xl"
            pixels="30px"
            token="--font-size-3xl"
            usage="Títulos principales (H1)"
            example="Main Heading"
          />
          <TypeScaleItem
            size="2xl"
            pixels="24px"
            token="--font-size-2xl"
            usage="Subtítulos importantes (H2)"
            example="Section Heading"
          />
          <TypeScaleItem
            size="xl"
            pixels="20px"
            token="--font-size-xl"
            usage="Títulos de sección (H3)"
            example="Subsection Title"
          />
          <TypeScaleItem
            size="lg"
            pixels="18px"
            token="--font-size-lg"
            usage="Títulos pequeños (H4), destacados"
            example="Small Heading"
          />
          <TypeScaleItem
            size="base"
            pixels="16px"
            token="--font-size-base"
            usage="Texto de cuerpo principal"
            example="Body text for paragraphs and regular content"
          />
          <TypeScaleItem
            size="sm"
            pixels="14px"
            token="--font-size-sm"
            usage="Texto secundario, labels"
            example="Secondary text and form labels"
          />
          <TypeScaleItem
            size="xs"
            pixels="12px"
            token="--font-size-xs"
            usage="Texto pequeño, captions"
            example="Small captions and helper text"
          />
        </div>

        <CodePreview
          title="Uso de la escala tipográfica"
          preview={
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Título Principal (3xl)</h1>
              <h2 className="text-2xl font-semibold">Subtítulo (2xl)</h2>
              <h3 className="text-xl font-semibold">Sección (xl)</h3>
              <p className="text-base">
                Párrafo de texto con tamaño base para lectura cómoda y extendida.
                Este es el tamaño por defecto para el contenido principal.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Texto secundario con información adicional o complementaria.
              </p>
            </div>
          }
          code={`<h1 className="text-3xl font-bold">
  Título Principal (3xl)
</h1>

<h2 className="text-2xl font-semibold">
  Subtítulo (2xl)
</h2>

<p className="text-base">
  Párrafo de texto con tamaño base.
</p>

<p className="text-sm text-gray-600">
  Texto secundario.
</p>

/* Con tokens CSS */
<h1 style={{ fontSize: 'var(--font-size-3xl)' }}>
  Título Principal
</h1>`}
        />
      </section>

      {/* Font Weights */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            💪 Pesos Tipográficos
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Diferentes pesos para crear jerarquía y énfasis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FontWeightCard
            weight="Normal (400)"
            token="--font-weight-normal"
            usage="Texto de cuerpo, contenido regular"
            example="The quick brown fox jumps over the lazy dog"
            className="font-normal"
          />
          <FontWeightCard
            weight="Medium (500)"
            token="--font-weight-medium"
            usage="Texto destacado, labels importantes"
            example="The quick brown fox jumps over the lazy dog"
            className="font-medium"
          />
          <FontWeightCard
            weight="Semibold (600)"
            token="--font-weight-semibold"
            usage="Subtítulos, títulos secundarios"
            example="The quick brown fox jumps over the lazy dog"
            className="font-semibold"
          />
          <FontWeightCard
            weight="Bold (700)"
            token="--font-weight-bold"
            usage="Títulos principales, énfasis fuerte"
            example="The quick brown fox jumps over the lazy dog"
            className="font-bold"
          />
        </div>

        <CodePreview
          title="Combinación de tamaño y peso"
          preview={
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Bold Heading</h1>
              <h2 className="text-2xl font-semibold">Semibold Subheading</h2>
              <p className="text-lg font-medium">Medium Emphasized Text</p>
              <p className="text-base font-normal">Normal Body Text</p>
            </div>
          }
          code={`<h1 className="text-4xl font-bold">Bold Heading</h1>
<h2 className="text-2xl font-semibold">Semibold Subheading</h2>
<p className="text-lg font-medium">Medium Emphasized Text</p>
<p className="text-base font-normal">Normal Body Text</p>

/* Con tokens CSS */
<h1 style={{ 
  fontSize: 'var(--font-size-4xl)',
  fontWeight: 'var(--font-weight-bold)'
}}>
  Bold Heading
</h1>`}
        />
      </section>

      {/* Line Height */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📐 Altura de Línea (Line Height)
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Espaciado vertical para mejorar legibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LineHeightCard
            name="Tight (1.25)"
            token="--line-height-tight"
            usage="Títulos, headings cortos"
            className="leading-tight"
          />
          <LineHeightCard
            name="Normal (1.5)"
            token="--line-height-normal"
            usage="Texto de cuerpo estándar"
            className="leading-normal"
          />
          <LineHeightCard
            name="Relaxed (1.75)"
            token="--line-height-relaxed"
            usage="Texto largo, artículos"
            className="leading-relaxed"
          />
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Regla general:</strong> Títulos usan line-height tight (1.25), 
            texto de cuerpo usa normal (1.5), y contenido extenso usa relaxed (1.75).
          </p>
        </div>
      </section>

      {/* Hierarchy Example */}
      <CodePreviewGroup
        title="🎯 Jerarquía Tipográfica"
        description="Ejemplo completo de jerarquía visual usando la escala tipográfica."
      >
        <CodePreview
          title="Página de Artículo"
          preview={
            <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  TECNOLOGÍA
                </p>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                  El Futuro de los Design Systems
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Cómo los sistemas de diseño están transformando el desarrollo de productos digitales.
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Por John Doe</span>
                <span>•</span>
                <span>5 min de lectura</span>
                <span>•</span>
                <span>Nov 6, 2025</span>
              </div>

              <div className="h-px bg-gray-200 dark:bg-gray-700" />

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Introducción
                </h2>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  Los design systems han evolucionado de simples guías de estilo a ecosistemas 
                  completos de componentes, tokens y patrones de interacción. En este artículo 
                  exploramos su impacto en el desarrollo moderno.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
                  Beneficios Clave
                </h3>
                <ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                    <span>Consistencia visual en todos los productos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                    <span>Aceleración del desarrollo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                    <span>Mejor colaboración entre equipos</span>
                  </li>
                </ul>

                <p className="text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-primary-600 pl-4">
                  "Un buen design system es invisible para el usuario final, pero invaluable para el equipo de desarrollo."
                </p>
              </div>
            </div>
          }
          code={`<article className="space-y-6">
  {/* Eyebrow */}
  <p className="text-sm text-primary-600 font-medium">
    TECNOLOGÍA
  </p>

  {/* Title */}
  <h1 className="text-4xl font-bold leading-tight">
    El Futuro de los Design Systems
  </h1>

  {/* Subtitle */}
  <p className="text-lg text-gray-600">
    Cómo los sistemas de diseño están transformando 
    el desarrollo de productos digitales.
  </p>

  {/* Meta */}
  <div className="text-sm text-gray-600">
    Por John Doe • 5 min • Nov 6, 2025
  </div>

  {/* Section Heading */}
  <h2 className="text-2xl font-semibold">
    Introducción
  </h2>

  {/* Body Text */}
  <p className="text-base leading-relaxed">
    Los design systems han evolucionado...
  </p>

  {/* Subsection */}
  <h3 className="text-xl font-semibold">
    Beneficios Clave
  </h3>

  {/* Quote */}
  <p className="text-sm italic border-l-4 border-primary-600 pl-4">
    "Un buen design system es invisible..."
  </p>
</article>`}
        />
      </CodePreviewGroup>

      {/* Best Practices */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ✅ Mejores Prácticas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BestPracticeCard
            title="Jerarquía Clara"
            description="Usa 3-4 niveles de títulos máximo. Diferencia con tamaño Y peso."
            type="success"
          />
          <BestPracticeCard
            title="Consistencia"
            description="Usa los mismos tamaños y pesos para los mismos tipos de contenido."
            type="success"
          />
          <BestPracticeCard
            title="Contraste Adecuado"
            description="Asegura que el texto sea legible con suficiente contraste (4.5:1 mínimo)."
            type="success"
          />
          <BestPracticeCard
            title="Espaciado Generoso"
            description="Deja suficiente espacio entre párrafos y secciones para respirar."
            type="success"
          />
          <BestPracticeCard
            title="Evitar Muchos Pesos"
            description="No uses más de 3-4 pesos diferentes en una misma vista."
            type="warning"
          />
          <BestPracticeCard
            title="Evitar Texto Muy Pequeño"
            description="No uses tamaños menores a 12px para texto importante."
            type="warning"
          />
        </div>
      </section>
    </div>
  )
}

// Helper Components

const TypeScaleItem = ({
  size,
  pixels,
  token,
  usage,
  example,
}: {
  size: string
  pixels: string
  token: string
  usage: string
  example: string
}) => {
  const sizeClasses = {
    '4xl': 'text-4xl',
    '3xl': 'text-3xl',
    '2xl': 'text-2xl',
    xl: 'text-xl',
    lg: 'text-lg',
    base: 'text-base',
    sm: 'text-sm',
    xs: 'text-xs',
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{size}</span>
            <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{pixels}</code>
            <code className="text-xs text-gray-500 dark:text-gray-500 font-mono">{token}</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{usage}</p>
          <p className={`${sizeClasses[size as keyof typeof sizeClasses]} text-gray-900 dark:text-white`}>
            {example}
          </p>
        </div>
      </div>
    </div>
  )
}

const FontWeightCard = ({
  weight,
  token,
  usage,
  example,
  className,
}: {
  weight: string
  token: string
  usage: string
  example: string
  className: string
}) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{weight}</h3>
        <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{token}</code>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{usage}</p>
      </div>
      <p className={`text-xl text-gray-900 dark:text-white ${className}`}>{example}</p>
    </div>
  )
}

const LineHeightCard = ({
  name,
  token,
  usage,
  className,
}: {
  name: string
  token: string
  usage: string
  className: string
}) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
        <code className="text-xs text-gray-600 dark:text-gray-400 font-mono">{token}</code>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{usage}</p>
      </div>
      <p className={`text-base text-gray-700 dark:text-gray-300 ${className}`}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
        ut labore et dolore magna aliqua. Ut enim ad minim veniam.
      </p>
    </div>
  )
}

const BestPracticeCard = ({
  title,
  description,
  type,
}: {
  title: string
  description: string
  type: 'success' | 'warning'
}) => {
  const colors = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
  }

  return (
    <div className={`p-4 border rounded-lg ${colors[type]}`}>
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  )
}
