import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'eav-scenes-web': path.resolve(__dirname, '../scenes-web/src/index.ts'),
      'eav-scripts-web': path.resolve(__dirname, '../scripts-web/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'ES2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-utils': ['zod', 'zustand'],
        },
      },
    },
  },
})
