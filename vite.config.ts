import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/THE-CHEF/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      selfDestroying: true,
      includeAssets: ['favicon.svg', 'home-pantry.jpg', 'home-desire.jpg'],
      manifest: {
        name: 'El Chef · Cocina inteligente',
        short_name: 'El Chef',
        description: 'Tu asistente inteligente para decidir qué cocinar.',
        theme_color: '#f7f1e6',
        background_color: '#f7f1e6',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/THE-CHEF/',
        start_url: '/THE-CHEF/',
        lang: 'es',
        icons: [
          { src: '/THE-CHEF/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ]
});
