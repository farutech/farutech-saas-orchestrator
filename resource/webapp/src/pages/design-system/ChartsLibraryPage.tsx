import { CodePreview, CodePreviewGroup } from '../../components/ui/CodePreview'
import {
  ChartLine,
  ChartBar,
  ChartPie,
  ChartArea,
  ChartRadar,
  ChartGauge,
} from '../../components/ui/Charts'

/**
 * 📊 Charts Documentation Page
 * 
 * Documentación completa de los componentes de gráficas del Design System.
 */

export default function ChartsLibraryPage() {
  // Sample Data
  const salesData = [
    { month: 'Ene', ventas: 4000, gastos: 2400 },
    { month: 'Feb', ventas: 3000, gastos: 1398 },
    { month: 'Mar', ventas: 2000, gastos: 9800 },
    { month: 'Abr', ventas: 2780, gastos: 3908 },
    { month: 'May', ventas: 1890, gastos: 4800 },
    { month: 'Jun', ventas: 2390, gastos: 3800 },
  ]

  const productData = [
    { product: 'Producto A', ventas: 4000 },
    { product: 'Producto B', ventas: 3000 },
    { product: 'Producto C', ventas: 2000 },
    { product: 'Producto D', ventas: 2780 },
  ]

  const marketShareData = [
    { name: 'Producto A', value: 400 },
    { name: 'Producto B', value: 300 },
    { name: 'Producto C', value: 200 },
    { name: 'Producto D', value: 100 },
  ]

  const performanceData = [
    { skill: 'Velocidad', score: 80, benchmark: 65 },
    { skill: 'Calidad', score: 90, benchmark: 75 },
    { skill: 'Eficiencia', score: 75, benchmark: 80 },
    { skill: 'Innovación', score: 85, benchmark: 70 },
    { skill: 'Colaboración', score: 70, benchmark: 85 },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📊 Charts Library
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Componentes de gráficas unificados con estilos del Design System.
        </p>
      </div>

      {/* Chart Line */}
      <CodePreviewGroup
        title="📈 Line Chart"
        description="Ideal para mostrar tendencias y evolución en el tiempo."
      >
        <CodePreview
          title="Gráfica de Líneas - Simple"
          description="Una sola serie de datos con línea suave."
          preview={
            <div className="w-full">
              <ChartLine
                data={salesData}
                xAxisKey="month"
                dataKey="ventas"
                height={300}
              />
            </div>
          }
          code={`const data = [
  { month: 'Ene', ventas: 4000 },
  { month: 'Feb', ventas: 3000 },
  // ...
]

<ChartLine
  data={data}
  xAxisKey="month"
  dataKey="ventas"
  height={300}
/>`}
        />

        <CodePreview
          title="Gráfica de Líneas - Múltiples Series"
          description="Comparación de múltiples variables en el tiempo."
          preview={
            <div className="w-full">
              <ChartLine
                data={salesData}
                xAxisKey="month"
                dataKey={['ventas', 'gastos']}
                height={300}
              />
            </div>
          }
          code={`<ChartLine
  data={salesData}
  xAxisKey="month"
  dataKey={['ventas', 'gastos']}
  height={300}
/>`}
        />
      </CodePreviewGroup>

      {/* Chart Bar */}
      <CodePreviewGroup
        title="📊 Bar Chart"
        description="Ideal para comparar valores entre categorías."
      >
        <CodePreview
          title="Gráfica de Barras - Vertical"
          description="Comparación de ventas por producto."
          preview={
            <div className="w-full">
              <ChartBar
                data={productData}
                xAxisKey="product"
                dataKey="ventas"
                height={300}
              />
            </div>
          }
          code={`<ChartBar
  data={productData}
  xAxisKey="product"
  dataKey="ventas"
  height={300}
/>`}
        />

        <CodePreview
          title="Gráfica de Barras - Horizontal"
          description="Útil cuando los nombres de categorías son largos."
          preview={
            <div className="w-full">
              <ChartBar
                data={productData}
                xAxisKey="product"
                dataKey="ventas"
                height={300}
                horizontal
              />
            </div>
          }
          code={`<ChartBar
  data={productData}
  xAxisKey="product"
  dataKey="ventas"
  height={300}
  horizontal
/>`}
        />

        <CodePreview
          title="Gráfica de Barras - Múltiples Series"
          description="Comparación de múltiples métricas por categoría."
          preview={
            <div className="w-full">
              <ChartBar
                data={salesData}
                xAxisKey="month"
                dataKey={['ventas', 'gastos']}
                height={300}
              />
            </div>
          }
          code={`<ChartBar
  data={salesData}
  xAxisKey="month"
  dataKey={['ventas', 'gastos']}
  height={300}
/>`}
        />
      </CodePreviewGroup>

      {/* Chart Pie */}
      <CodePreviewGroup
        title="🥧 Pie Chart"
        description="Ideal para mostrar distribución porcentual."
      >
        <CodePreview
          title="Gráfica de Pastel"
          description="Distribución de mercado por producto."
          preview={
            <div className="w-full">
              <ChartPie
                data={marketShareData}
                nameKey="name"
                dataKey="value"
                height={300}
              />
            </div>
          }
          code={`<ChartPie
  data={marketShareData}
  nameKey="name"
  dataKey="value"
  height={300}
/>`}
        />

        <CodePreview
          title="Gráfica Donut"
          description="Variante con agujero en el centro, más moderna."
          preview={
            <div className="w-full">
              <ChartPie
                data={marketShareData}
                nameKey="name"
                dataKey="value"
                height={300}
                donut
              />
            </div>
          }
          code={`<ChartPie
  data={marketShareData}
  nameKey="name"
  dataKey="value"
  height={300}
  donut
/>`}
        />
      </CodePreviewGroup>

      {/* Chart Area */}
      <CodePreviewGroup
        title="📈 Area Chart"
        description="Similar a línea pero con área rellena, ideal para mostrar volumen."
      >
        <CodePreview
          title="Gráfica de Área - Simple"
          description="Una sola serie de datos con área rellena."
          preview={
            <div className="w-full">
              <ChartArea
                data={salesData}
                xAxisKey="month"
                dataKey="ventas"
                height={300}
              />
            </div>
          }
          code={`<ChartArea
  data={salesData}
  xAxisKey="month"
  dataKey="ventas"
  height={300}
/>`}
        />

        <CodePreview
          title="Gráfica de Área - Apilada"
          description="Múltiples series apiladas para mostrar total acumulado."
          preview={
            <div className="w-full">
              <ChartArea
                data={salesData}
                xAxisKey="month"
                dataKey={['ventas', 'gastos']}
                height={300}
                stacked
              />
            </div>
          }
          code={`<ChartArea
  data={salesData}
  xAxisKey="month"
  dataKey={['ventas', 'gastos']}
  height={300}
  stacked
/>`}
        />
      </CodePreviewGroup>

      {/* Chart Radar */}
      <CodePreviewGroup
        title="🎯 Radar Chart"
        description="Ideal para evaluaciones o perfiles comparativos."
      >
        <CodePreview
          title="Gráfica de Radar - Simple"
          description="Evaluación de desempeño en múltiples dimensiones."
          preview={
            <div className="w-full">
              <ChartRadar
                data={performanceData}
                angleKey="skill"
                dataKey="score"
                height={400}
              />
            </div>
          }
          code={`<ChartRadar
  data={performanceData}
  angleKey="skill"
  dataKey="score"
  height={400}
/>`}
        />

        <CodePreview
          title="Gráfica de Radar - Comparativa"
          description="Comparación de desempeño actual vs benchmark."
          preview={
            <div className="w-full">
              <ChartRadar
                data={performanceData}
                angleKey="skill"
                dataKey={['score', 'benchmark']}
                height={400}
              />
            </div>
          }
          code={`<ChartRadar
  data={performanceData}
  angleKey="skill"
  dataKey={['score', 'benchmark']}
  height={400}
/>`}
        />
      </CodePreviewGroup>

      {/* Chart Gauge */}
      <CodePreviewGroup
        title="🎛️ Gauge Chart"
        description="Ideal para mostrar KPIs y porcentajes de cumplimiento."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CodePreview
            title="Cumplimiento Alto"
            preview={
              <ChartGauge
                value={85}
                max={100}
                label="Objetivos Cumplidos"
                color="#2E7D32"
              />
            }
            code={`<ChartGauge
  value={85}
  max={100}
  label="Objetivos Cumplidos"
  color="#2E7D32"
/>`}
          />

          <CodePreview
            title="Cumplimiento Medio"
            preview={
              <ChartGauge
                value={65}
                max={100}
                label="Eficiencia"
                color="#F9A825"
              />
            }
            code={`<ChartGauge
  value={65}
  max={100}
  label="Eficiencia"
  color="#F9A825"
/>`}
          />

          <CodePreview
            title="Cumplimiento Bajo"
            preview={
              <ChartGauge
                value={35}
                max={100}
                label="Satisfacción"
                color="#D32F2F"
              />
            }
            code={`<ChartGauge
  value={35}
  max={100}
  label="Satisfacción"
  color="#D32F2F"
/>`}
          />
        </div>
      </CodePreviewGroup>

      {/* Usage Guide */}
      <section className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4">
          💡 Guía de Uso
        </h2>
        <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <strong>Tendencias:</strong> Usa <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">ChartLine</code> o{' '}
            <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">ChartArea</code> para mostrar evolución en el tiempo.
          </div>
          <div>
            <strong>Comparaciones:</strong> Usa <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">ChartBar</code> para comparar valores entre categorías.
          </div>
          <div>
            <strong>Distribuciones:</strong> Usa <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">ChartPie</code> para mostrar porcentajes y proporciones.
          </div>
          <div>
            <strong>Evaluaciones:</strong> Usa <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">ChartRadar</code> para perfiles comparativos multidimensionales.
          </div>
          <div>
            <strong>KPIs:</strong> Usa <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">ChartGauge</code> para mostrar cumplimiento de objetivos.
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎨 Paleta de Colores
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Todos los gráficos usan la paleta de colores del Design System automáticamente.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch color="#1E88E5" name="Primary" />
          <ColorSwatch color="#2E7D32" name="Success" />
          <ColorSwatch color="#F9A825" name="Warning" />
          <ColorSwatch color="#D32F2F" name="Error" />
          <ColorSwatch color="#0288D1" name="Info" />
          <ColorSwatch color="#7B1FA2" name="Purple" />
          <ColorSwatch color="#F57C00" name="Orange" />
          <ColorSwatch color="#00897B" name="Teal" />
        </div>
      </section>
    </div>
  )
}

const ColorSwatch = ({ color, name }: { color: string; name: string }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div
        className="w-12 h-12 rounded-lg shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <div className="font-semibold text-gray-900 dark:text-white text-sm">
          {name}
        </div>
        <code className="text-xs text-gray-500 dark:text-gray-400">
          {color}
        </code>
      </div>
    </div>
  )
}
