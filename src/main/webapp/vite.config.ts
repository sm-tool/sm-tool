import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig(({ mode }) => {
  const env =
    mode === 'production'
      ? loadEnv(mode, process.cwd(), '')
      : loadEnv(mode, path.resolve(__dirname, '../../../'), '');

  const keycloakUrl =
    mode === 'production'
      ? `${env.APP_PROTOCOL}${env.APP_BASE_DOMAIN}/auth`
      : `http://${env.KEYCLOAK_HOST}:${env.KEYCLOAK_HTTP_PORT}`;

  const backendUrl =
    mode === 'development'
      ? `${env.APP_PROTOCOL}${env.APP_BASE_DOMAIN}:${env.BACKEND_PORT}`
      : '';

  return {
    plugins: [
      react(),
      // analyzer({
      //   analyzerMode: 'server',
      //   openAnalyzer: true,
      // }),
      // checker({
      //   typescript: true,
      //   terminal: false,
      //   overlay: {
      //     badgeStyle: 'margin-left: 60px;',
      //   },
      // }),
      TanStackRouterVite({
        routeFileIgnorePrefix: '~',
        routesDirectory: './app',
        generatedRouteTree: './lib/routing/routeTree.gen.ts',
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, '.'),
        },
      ],
    },
    publicDir: path.resolve(__dirname, './public'),
    server: {
      port: parseInt(env.FRONTEND_PORT || '9000'),
      hmr: { overlay: true, protocol: 'ws' },
      proxy: {
        '^/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    define: {
      'globalThis.process.env': {
        APP_URL: `${env.APP_PROTOCOL}${env.APP_BASE_DOMAIN}:${env.FRONTEND_PORT}`,
        BACKEND_URL: backendUrl,
        KEYCLOAK_URL: keycloakUrl,
        KEYCLOAK_REALM: env.REALM_NAME,
        KEYCLOAK_CLIENT_ID: env.CLIENT_ID,
        KEYCLOAK_TOKEN_INTERVAL: env.TOKEN_INTERVAL,
        FRONTEND_AUTH_PROVIDER: env.FRONTEND_AUTH_PROVIDER,
        REQUEST_RETRY_COUNT: env.REQUEST_RETRY_COUNT,
      },
    },
    build: {
      outDir: './dist',
      sourcemap: true,
    },
  };
});
