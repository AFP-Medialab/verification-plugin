import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        icon: true,
      },
    }),
    crx({
      manifest,
      // Improve HMR for browser extensions
      browser: 'chrome'
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@workers': path.resolve(__dirname, 'src/workers'),
      '@Shared': path.resolve(__dirname, 'src/components/Shared'),
    },
  },
  define: {
    // Provide Buffer polyfill for browser
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    // Increase chunk size warning limit to avoid noise
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Handle WebAssembly
      external: [],
      output: {
        // Manual chunking for better code splitting
        manualChunks: {
          // React and core libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Redux ecosystem
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux', 'redux', 'redux-saga'],

          // Material-UI (largest dependency)
          'vendor-mui-core': ['@mui/material', '@mui/icons-material'],
          'vendor-mui-x': ['@mui/x-charts', '@mui/x-data-grid', '@mui/x-date-pickers'],

          // Chart libraries (heavy)
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts', 'echarts', 'echarts-for-react'],

          // Image processing and visualization
          'vendor-graphics': ['konva', 'react-konva', 'html2canvas', 'leaflet', 'react-leaflet'],

          // Large utility libraries
          'vendor-utils': ['lodash', 'moment', 'moment-timezone', 'dayjs', 'axios'],

          // I18n and text processing
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-chained-backend'],

          // Media and file processing
          'vendor-media': ['wavesurfer.js', '@wavesurfer/react', 'exifr', 'file-type', 'pako'],

          // Specialized tools (C2PA, etc.)
          'vendor-specialized': ['c2pa', 'graphology', 'warcio', '@visx/wordcloud'],
        },
      },
    },
  },
  // Use relative paths for Chrome extension
  base: './',
  // Enable WebAssembly support
  worker: {
    format: 'es',
  },
  // Handle environment variables
  envPrefix: 'VITE_',
  // Better development experience
  server: {
    // Disable HMR for browser extension development (use build --watch instead)
    hmr: false,
    // But allow HMR when using dev:hot for testing components
    port: 3000,
  },
})