import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: process.env.HOST || "0.0.0.0", // Permite que Aspire controle el host
    port: parseInt(process.env.PORT || "8081"), // Usa PORT de Aspire o 8081 por defecto
    allowedHosts: [
      "farutech.local",
      ".farutech.local",
      ".app.farutech.local",
      "localhost",
    ],
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Deshabilitar advertencia de browserslist desactualizada
  logLevel: 'warn',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks para librerías grandes
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'animation-vendor': ['framer-motion'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumentar límite a 1000 kB
  },
}));

