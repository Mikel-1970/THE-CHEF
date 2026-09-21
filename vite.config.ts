import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Cloudflare Pages inyecta CF_PAGES=1. GitHub Pages sigue usando /THE-CHEF/.
  const env = loadEnv(mode, '.', '');
  const isCloudflarePages = env.CF_PAGES === '1';
  const base = isCloudflarePages ? '/' : '/THE-CHEF/';
  const buildCommit = env.CF_PAGES_COMMIT_SHA || env.GITHUB_SHA || '';
  const buildBranch = env.CF_PAGES_BRANCH || env.GITHUB_REF_NAME || '';

  return {
    base,
    define: {
      __PRIVATE_PREVIEW__: JSON.stringify(isCloudflarePages),
      __BUILD_COMMIT__: JSON.stringify(buildCommit),
      __BUILD_BRANCH__: JSON.stringify(buildBranch)
    },
    plugins: [
      react(),
      ...(isCloudflarePages ? [{
        name: 'cloudflare-preview-version',
        generateBundle() {
          if (!env.CF_PAGES_COMMIT_SHA || !env.CF_PAGES_BRANCH) {
            throw new Error('Pages build requires CF_PAGES_COMMIT_SHA and CF_PAGES_BRANCH for traceability.');
          }
          this.emitFile({
            type: 'asset',
            fileName: 'version.json',
            source: JSON.stringify({ commit: env.CF_PAGES_COMMIT_SHA, branch: env.CF_PAGES_BRANCH }, null, 2) + '\n'
          });
        }
      }] : []),
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
          scope: base,
          start_url: base,
          lang: 'es',
          icons: [
            { src: `${base}favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
          ]
        }
      })
    ]
  };
});
