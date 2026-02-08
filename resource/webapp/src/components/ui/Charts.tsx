import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

/**
 * 📊 Chart Components
 * 
 * Wrappers unificados para Recharts con estilos consistentes del Design System.
 * Todos los componentes usan los tokens CSS y soportan dark mode automáticamente.
 * Incluye mejoras de responsividad y dimensionamiento automático.
 */

interface BaseChartProps {
  /** Datos para renderizar */
  data: any[]
  /** Altura del gráfico en píxeles (default: 300) */
  height?: number
  /** Altura mínima en píxeles para contenedores pequeños (default: 200) */
  minHeight?: number
  /** Ancho del gráfico (default: '100%' - se ajusta al contenedor) */
  width?: string | number
  /** Mostrar leyenda */
  showLegend?: boolean
  /** Mostrar tooltip */
  showTooltip?: boolean
  /** Colores personalizados (sobrescribe los del theme) */
  colors?: string[]
  /** Clase CSS adicional para el contenedor */
  className?: string
}

/**
 * 🎨 Color Palette del Design System
 */
const CHART_COLORS = {
  primary: '#1E88E5',
  secondary: '#1565C0',
  success: '#2E7D32',
  warning: '#F9A825',
  error: '#D32F2F',
  info: '#0288D1',
  purple: '#7B1FA2',
  orange: '#F57C00',
  teal: '#00897B',
  pink: '#C2185B',
}

const DEFAULT_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.error,
  CHART_COLORS.info,
  CHART_COLORS.purple,
  CHART_COLORS.orange,
  CHART_COLORS.teal,
]

/**
 * 📈 ChartLine - Gráfica de líneas
 * 
 * Ideal para mostrar tendencias y evolución en el tiempo.
 * 
 * @example
 * ```tsx
 * <ChartLine
 *   data={salesData}
 *   dataKey="value"
 *   xAxisKey="month"
 *   height={300}
 * />
 * ```
 */
export interface ChartLineProps extends BaseChartProps {
  /** Key del eje X */
  xAxisKey: string
  /** Key del valor a graficar */
  dataKey: string | string[]
  /** Mostrar curva suave */
  smooth?: boolean
}

export const ChartLine = ({
  data,
  xAxisKey,
  dataKey,
  height = 300,
  minHeight = 200,
  showLegend = true,
  showTooltip = true,
  smooth = true,
  colors = DEFAULT_COLORS,
  className,
}: ChartLineProps) => {
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey]

  return (
    <div className={className} style={{ minHeight: `${minHeight}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height={height} minHeight={minHeight}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          <XAxis 
            dataKey={xAxisKey} 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            height={40}
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            width={50}
          />
          {showTooltip && <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />}
          {showLegend && <Legend wrapperStyle={{ paddingTop: '10px' }} />}
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type={smooth ? 'monotone' : 'linear'}
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ fill: colors[index % colors.length] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 📊 ChartBar - Gráfica de barras
 * 
 * Ideal para comparar valores entre categorías.
 * 
 * @example
 * ```tsx
 * <ChartBar
 *   data={salesByProduct}
 *   xAxisKey="product"
 *   dataKey="sales"
 *   height={300}
 * />
 * ```
 */
export interface ChartBarProps extends BaseChartProps {
  /** Key del eje X */
  xAxisKey: string
  /** Key del valor a graficar */
  dataKey: string | string[]
  /** Orientación horizontal */
  horizontal?: boolean
}

export const ChartBar = ({
  data,
  xAxisKey,
  dataKey,
  height = 300,
  minHeight = 200,
  showLegend = true,
  showTooltip = true,
  horizontal = false,
  colors = DEFAULT_COLORS,
  className,
}: ChartBarProps) => {
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey]

  return (
    <div className={className} style={{ minHeight: `${minHeight}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height={height} minHeight={minHeight}>
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          layout={horizontal ? 'vertical' : 'horizontal'}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          {horizontal ? (
            <>
              <YAxis type="category" dataKey={xAxisKey} className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor', fontSize: 12 }} width={80} />
              <XAxis type="number" className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor', fontSize: 12 }} height={40} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor', fontSize: 12 }} height={40} />
              <YAxis className="text-gray-600 dark:text-gray-400" tick={{ fill: 'currentColor', fontSize: 12 }} width={50} />
            </>
          )}
          {showTooltip && <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />}
          {showLegend && <Legend wrapperStyle={{ paddingTop: '10px' }} />}
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 🥧 ChartPie - Gráfica de pastel/donut
 * 
 * Ideal para mostrar distribución porcentual.
 * 
 * @example
 * ```tsx
 * <ChartPie
 *   data={marketShare}
 *   dataKey="value"
 *   nameKey="name"
 *   donut
 * />
 * ```
 */
export interface ChartPieProps extends BaseChartProps {
  /** Key del nombre/etiqueta */
  nameKey: string
  /** Key del valor */
  dataKey: string
  /** Modo donut (con agujero en el centro) */
  donut?: boolean
}

export const ChartPie = ({
  data,
  nameKey,
  dataKey,
  height = 300,
  minHeight = 200,
  showLegend = true,
  showTooltip = true,
  donut = false,
  colors = DEFAULT_COLORS,
  className,
}: ChartPieProps) => {
  return (
    <div className={className} style={{ minHeight: `${minHeight}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height={height} minHeight={minHeight}>
        <PieChart>
        {showTooltip && <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />}
        {showLegend && <Legend />}
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          cx="50%"
          cy="50%"
          innerRadius={donut ? '60%' : 0}
          outerRadius="80%"
          paddingAngle={2}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    </div>
  )
}

/**
 * 📈 ChartArea - Gráfica de área
 * 
 * Similar a línea pero con área rellena, ideal para volumen.
 * 
 * @example
 * ```tsx
 * <ChartArea
 *   data={revenue}
 *   xAxisKey="month"
 *   dataKey="revenue"
 *   stacked
 * />
 * ```
 */
export interface ChartAreaProps extends BaseChartProps {
  /** Key del eje X */
  xAxisKey: string
  /** Key del valor a graficar */
  dataKey: string | string[]
  /** Apilar áreas */
  stacked?: boolean
}

export const ChartArea = ({
  data,
  xAxisKey,
  dataKey,
  height = 300,
  minHeight = 200,
  showLegend = true,
  showTooltip = true,
  stacked = false,
  colors = DEFAULT_COLORS,
  className,
}: ChartAreaProps) => {
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey]

  return (
    <div className={className} style={{ minHeight: `${minHeight}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height={height} minHeight={minHeight}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
          <XAxis 
            dataKey={xAxisKey} 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            height={40}
          />
          <YAxis 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            width={50}
          />
          {showTooltip && <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />}
          {showLegend && <Legend wrapperStyle={{ paddingTop: '10px' }} />}
          {dataKeys.map((key, index) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId={stacked ? '1' : undefined}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 🎯 ChartRadar - Gráfica de radar
 * 
 * Ideal para evaluaciones o perfiles comparativos.
 * 
 * @example
 * ```tsx
 * <ChartRadar
 *   data={performance}
 *   angleKey="skill"
 *   dataKey="score"
 * />
 * ```
 */
export interface ChartRadarProps extends BaseChartProps {
  /** Key del ángulo/categoría */
  angleKey: string
  /** Key del valor */
  dataKey: string | string[]
}

export const ChartRadar = ({
  data,
  angleKey,
  dataKey,
  height = 400,
  minHeight = 300,
  showLegend = true,
  showTooltip = true,
  colors = DEFAULT_COLORS,
  className,
}: ChartRadarProps) => {
  const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey]

  return (
    <div className={className} style={{ minHeight: `${minHeight}px`, width: '100%' }}>
      <ResponsiveContainer width="100%" height={height} minHeight={minHeight}>
        <RadarChart data={data}>
          <PolarGrid className="stroke-gray-300 dark:stroke-gray-700" />
          <PolarAngleAxis 
            dataKey={angleKey} 
            className="text-gray-600 dark:text-gray-400"
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <PolarRadiusAxis className="text-gray-600 dark:text-gray-400" tick={{ fontSize: 12 }} />
          {showTooltip && <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />}
          {showLegend && <Legend wrapperStyle={{ paddingTop: '10px' }} />}
          {dataKeys.map((key, index) => (
            <Radar
              key={key}
              dataKey={key}
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              fillOpacity={0.5}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

/**
 * 🎛️ ChartGauge - Gráfica de velocímetro
 * 
 * Ideal para mostrar KPIs y porcentajes de cumplimiento.
 * 
 * @example
 * ```tsx
 * <ChartGauge
 *   value={75}
 *   max={100}
 *   label="Cumplimiento"
 * />
 * ```
 */
export interface ChartGaugeProps {
  /** Valor actual */
  value: number
  /** Valor máximo */
  max?: number
  /** Etiqueta del gauge */
  label?: string
  /** Altura */
  height?: number
  /** Color */
  color?: string
}

export const ChartGauge = ({
  value,
  max = 100,
  label,
  height = 200,
  color = CHART_COLORS.primary,
}: ChartGaugeProps) => {
  const percentage = (value / max) * 100
  const data = [
    { name: 'Completado', value: value, fill: color },
    { name: 'Restante', value: max - value, fill: '#E0E0E0' },
  ]

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="80%"
            innerRadius="70%"
            outerRadius="90%"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '40%' }}>
        <div className="text-3xl font-bold" style={{ color }}>
          {percentage.toFixed(0)}%
        </div>
        {label && (
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {label}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 📊 Exportar constantes de colores para uso externo
 */
export { CHART_COLORS, DEFAULT_COLORS }
