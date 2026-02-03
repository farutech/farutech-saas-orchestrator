import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 59138,
    },
    build: {
        // Give Rollup hints to split large vendor bundles into logical chunks.
        // Increase warning limit to accommodate Storybook's iframe bundle.
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'vendor_react';
                        if (id.includes('chart.js') || id.includes('chart.js')) return 'vendor_chart';
                        if (id.includes('lucide') || id.includes('@radix-ui')) return 'vendor_icons_ui';
                        if (id.includes('framer-motion')) return 'vendor_motion';
                        return 'vendor';
                    }
                }
            }
        }
    },
    resolve: {
        alias: {
            '@farutech/design-system': resolve(__dirname, 'packages/design-system/src'),
            '@farutech/dashboard-core': resolve(__dirname, 'packages/dashboard-core/src'),
            '@farutech/dashboard-components': resolve(__dirname, 'packages/dashboard-components/src'),
            '@farutech/dashboard-app': resolve(__dirname, 'packages/dashboard-app/src')
                // Allow importing unified barrel from src/unified
                , '@farutech/sdk-designsystem/unified': resolve(__dirname, 'src/unified')
        }
    }
})
