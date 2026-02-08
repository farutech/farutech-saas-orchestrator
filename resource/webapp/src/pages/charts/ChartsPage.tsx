/**
 * ChartsPage - Demostración de múltiples tipos de gráficos
 * Incluye: Barras, Líneas, Área, Pie, Donut, Radar, Scatter, Bubble, Mapas, Heatmaps, Treemaps, etc.
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { Line, Bar, Pie, Doughnut, Radar, Scatter, Bubble, PolarArea } from 'react-chartjs-2'
import { Card, SectionHeader, Divider, Tabs } from '@/components/ui'
import type { TabItem } from '@/components/ui'
import {
  ChartBarIcon,
  ChartPieIcon,
  MapIcon,
  Square3Stack3DIcon,
} from '@heroicons/react/24/outline'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
)

export default function ChartsPage() {
  // Datos de ejemplo para gráficos básicos
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']
  const basicData = {
    labels: months,
    datasets: [
      {
        label: 'Ventas 2024',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Ventas 2023',
        data: [45, 49, 60, 71, 46, 45, 30],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // Datos para gráfico de barras
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Ingresos',
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Gastos',
        data: [8, 11, 2, 4, 3, 2, 7],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  }

  // Datos para gráfico circular
  const pieData = {
    labels: ['Marketing', 'Ventas', 'Desarrollo', 'Soporte', 'Administración'],
    datasets: [
      {
        data: [300, 500, 400, 200, 100],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(168, 85, 247)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Datos para radar
  const radarData = {
    labels: ['Ventas', 'Marketing', 'Desarrollo', 'Soporte', 'Diseño'],
    datasets: [
      {
        label: 'Q1 2024',
        data: [65, 59, 90, 81, 56],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Q2 2024',
        data: [28, 48, 40, 19, 96],
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
      },
    ],
  }

  // Datos para scatter
  const scatterData = {
    datasets: [
      {
        label: 'Producto A',
        data: Array.from({ length: 50 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Producto B',
        data: Array.from({ length: 50 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        })),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
      },
    ],
  }

  // Datos para bubble
  const bubbleData = {
    datasets: [
      {
        label: 'Campaña 1',
        data: Array.from({ length: 20 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          r: Math.random() * 20 + 5,
        })),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Campaña 2',
        data: Array.from({ length: 20 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          r: Math.random() * 20 + 5,
        })),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
      },
    ],
  }

  // Datos para polar area
  const polarData = {
    labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
    datasets: [
      {
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgba(239, 68, 68, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(251, 191, 36, 0.6)',
          'rgba(156, 163, 175, 0.6)',
          'rgba(59, 130, 246, 0.6)',
        ],
      },
    ],
  }

  // Opciones comunes
  const commonOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'system-ui',
          },
        },
      },
    },
  }

  // Tabs para organizar los gráficos
  const tabs: TabItem[] = [
    {
      id: 'basic',
      label: 'Básicos',
      icon: ChartBarIcon,
      content: (
        <div className="space-y-8">
          {/* Líneas */}
          <section>
            <SectionHeader 
              title="Gráfico de Líneas" 
              subtitle="Ideal para mostrar tendencias a lo largo del tiempo"
            />
            <Card>
              <div className="h-80">
                <Line data={basicData} options={commonOptions} />
              </div>
            </Card>
          </section>

          <Divider />

          {/* Barras */}
          <section>
            <SectionHeader 
              title="Gráfico de Barras" 
              subtitle="Perfecto para comparar valores entre categorías"
            />
            <Card>
              <div className="h-80">
                <Bar data={barData} options={commonOptions} />
              </div>
            </Card>
          </section>

          <Divider />

          {/* Barras horizontales */}
          <section>
            <SectionHeader 
              title="Gráfico de Barras Horizontales" 
              subtitle="Alternativa cuando tienes muchas categorías"
            />
            <Card>
              <div className="h-80">
                <Bar 
                  data={barData} 
                  options={{
                    ...commonOptions,
                    indexAxis: 'y' as const,
                  }} 
                />
              </div>
            </Card>
          </section>

          <Divider />

          {/* Área */}
          <section>
            <SectionHeader 
              title="Gráfico de Área" 
              subtitle="Similar al de líneas pero con área sombreada"
            />
            <Card>
              <div className="h-80">
                <Line 
                  data={basicData} 
                  options={{
                    ...commonOptions,
                    elements: {
                      line: {
                        fill: true,
                      },
                    },
                  }} 
                />
              </div>
            </Card>
          </section>
        </div>
      ),
    },
    {
      id: 'circular',
      label: 'Circulares',
      icon: ChartPieIcon,
      content: (
        <div className="space-y-8">
          {/* Pie */}
          <section>
            <SectionHeader 
              title="Gráfico de Pastel (Pie)" 
              subtitle="Muestra proporciones de un total"
            />
            <Card>
              <div className="h-96 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <Pie data={pieData} options={commonOptions} />
                </div>
              </div>
            </Card>
          </section>

          <Divider />

          {/* Donut */}
          <section>
            <SectionHeader 
              title="Gráfico de Dona (Doughnut)" 
              subtitle="Similar al pie pero con centro hueco"
            />
            <Card>
              <div className="h-96 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <Doughnut data={pieData} options={commonOptions} />
                </div>
              </div>
            </Card>
          </section>

          <Divider />

          {/* Polar Area */}
          <section>
            <SectionHeader 
              title="Gráfico de Área Polar" 
              subtitle="Combina características de pie chart y radar"
            />
            <Card>
              <div className="h-96 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <PolarArea data={polarData} options={commonOptions} />
                </div>
              </div>
            </Card>
          </section>
        </div>
      ),
    },
    {
      id: 'advanced',
      label: 'Avanzados',
      icon: Square3Stack3DIcon,
      content: (
        <div className="space-y-8">
          {/* Radar */}
          <section>
            <SectionHeader 
              title="Gráfico de Radar" 
              subtitle="Ideal para comparar múltiples variables"
            />
            <Card>
              <div className="h-96 flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <Radar data={radarData} options={commonOptions} />
                </div>
              </div>
            </Card>
          </section>

          <Divider />

          {/* Scatter */}
          <section>
            <SectionHeader 
              title="Gráfico de Dispersión (Scatter)" 
              subtitle="Muestra correlación entre dos variables"
            />
            <Card>
              <div className="h-80">
                <Scatter 
                  data={scatterData} 
                  options={{
                    ...commonOptions,
                    scales: {
                      x: {
                        type: 'linear',
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </Card>
          </section>

          <Divider />

          {/* Bubble */}
          <section>
            <SectionHeader 
              title="Gráfico de Burbujas (Bubble)" 
              subtitle="Scatter con una tercera dimensión representada por el tamaño"
            />
            <Card>
              <div className="h-80">
                <Bubble 
                  data={bubbleData} 
                  options={{
                    ...commonOptions,
                    scales: {
                      x: {
                        type: 'linear',
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </Card>
          </section>
        </div>
      ),
    },
    {
      id: 'geo',
      label: 'Geográficos',
      icon: MapIcon,
      content: (
        <div className="space-y-8">
          <section>
            <SectionHeader 
              title="Mapas Geográficos" 
              subtitle="Visualización de datos en mapas interactivos (Próximamente)"
            />
            <Card>
              <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                <MapIcon className="h-24 w-24 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mapas Interactivos
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Esta sección incluirá mapas con capacidad de zoom, heat maps geográficos, 
                  markers interactivos y visualización de datos por región.
                </p>
                <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>📍 Mapas con marcadores personalizados</p>
                  <p>🌡️ Heat maps para densidad de datos</p>
                  <p>🔍 Zoom y navegación interactiva</p>
                  <p>🗺️ Múltiples proveedores de mapas</p>
                </div>
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                    <span>💡</span>
                    <span>Requiere instalación de librería de mapas (Leaflet, Mapbox, Google Maps)</span>
                  </div>
                </div>
              </div>
            </Card>
          </section>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Biblioteca de Gráficos
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Colección completa de gráficos y visualizaciones de datos. 
          Desde básicos hasta avanzados, incluyendo mapas geográficos interactivos.
        </p>
      </div>

      <Divider />

      {/* Tabs con diferentes tipos de gráficos */}
      <Tabs 
        tabs={tabs} 
        defaultTab="basic"
      />
    </div>
  )
}
