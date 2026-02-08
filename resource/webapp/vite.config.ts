import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y React DOM en su propio chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separar librerías de UI grandes
          'ui-vendor': ['@headlessui/react', '@heroicons/react', 'framer-motion'],
          // Separar librerías de data fetching y estado
          'data-vendor': ['@tanstack/react-query', '@tanstack/react-table', 'zustand'],
          // Separar librerías de gráficos
          'chart-vendor': ['recharts'],
          // Separar axios y utilidades
          'utils-vendor': ['axios', 'clsx', 'date-fns', 'zod'],
        },
        // Mejorar nombres de chunks para debugging
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Aumentar límite a 700KB ya que con lazy loading el chunk inicial será más pequeño
    chunkSizeWarningLimit: 700,
  },
})
