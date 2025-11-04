import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const trimApiSuffix = (value) => value.replace(/\/api\/?$/, '');

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawProxyTarget = env.VITE_PROXY_TARGET ?? env.VITE_API_URL ?? ''
  const proxyTarget = rawProxyTarget
    ? trimApiSuffix(rawProxyTarget)
    : 'http://localhost:3000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
