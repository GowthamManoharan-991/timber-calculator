import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// NOTE: This project uses a hand-written manifest.json + service worker
// (see /public/manifest.json and /public/service-worker.js) instead of
// vite-plugin-pwa, to keep the build dependency-light. If you prefer the
// plugin-based workflow, install `vite-plugin-pwa` and register it here.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Hostinger deployment note:
  // - Deploying to the domain root (e.g. https://yourshop.com/) -> leave
  //   VITE_BASE_PATH unset, base defaults to '/'.
  // - Deploying into a sub-folder (e.g. https://yourshop.com/timber-app/)
  //   -> set VITE_BASE_PATH=/timber-app/ in a .env.production file before
  //   running `npm run build`, so all asset URLs resolve correctly.
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [react()],
    server: {
      host: true,
      port: 5173
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      // Static, content-hashed filenames -> safe for aggressive browser/CDN
      // caching on Hostinger's Apache hosting.
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        }
      }
    }
  };
});
