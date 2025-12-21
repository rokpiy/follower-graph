import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
      server: {
        port: 3001,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'chart-vendor': ['recharts'],
              'ui-vendor': ['@radix-ui/react-popover', '@radix-ui/react-slot'],
              'date-vendor': ['date-fns', 'react-day-picker'],
            },
          },
        },
        chunkSizeWarningLimit: 600,
      },
});
