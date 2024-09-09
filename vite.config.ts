import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

const pathSrc = resolve(__dirname, './src');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [TanStackRouterVite(), react()],
    define: {
      'process.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME),
      'process.env.VITE_APP_DESCRIPTION': JSON.stringify(env.VITE_APP_DESCRIPTION)
    },
    resolve: {
      alias: {
        '@': pathSrc
      }
    }
  };
});
