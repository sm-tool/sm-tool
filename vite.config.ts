import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const keycloakUrl = `http://${env.KEYCLOAK_HOST || 'localhost'}:${env.KEYCLOAK_HTTP_PORT || '8180'}`;

  return {
    plugins: [
      react({
        devTarget: 'es2022',
        jsxImportSource: 'react',
      }),
      // checker({
      //   typescript: true,
      //   overlay: {
      //     badgeStyle: 'margin-left: 60px;',
      //   },
      // }),
      TanStackRouterVite({
        routeFileIgnorePrefix: '~',
        routesDirectory: './src/main/webapp/app',
        generatedRouteTree: './src/main/webapp/lib/routing/routeTree.gen.ts',
      }),
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src/main/webapp'),
        },
        {
          find: '@public',
          replacement: path.resolve(__dirname, 'public'),
        },
      ],
    },
    root: path.resolve(__dirname, 'src/main/webapp'),
    publicDir: path.resolve(__dirname, 'public'),
    server: {
      port: 9000,
      hmr: { overlay: true },
    },
    define: {
      global: ['window'],
      'process.env': {
        APP_URL: `${env.APP_PROTOCOL}${env.APP_BASE_DOMAIN}:${env.FRONTEND_PORT}`,
        KEYCLOAK_URL: keycloakUrl,
        KEYCLOAK_REALM: env.REALM_NAME,
        KEYCLOAK_CLIENT_ID: env.CLIENT_ID,
        KEYCLOAK_TOKEN_INTERVAL: env.TOKEN_INTERVAL,
      },
    },
    build: {
      outDir: '../../../dist',
      sourcemap: true,
      rollupOptions: {},
    },
  };
});
