import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import Pages from 'vite-plugin-pages';
import checker from 'vite-plugin-checker';

// https://github.com/hannoeru/vite-plugin-pages <- syntax

export default defineConfig({
  plugins: [
    react({
      devTarget: 'esnext',
    }),
    checker({
      typescript: true,
      overlay: true,
    }),
    Pages({
      dirs: path.resolve(__dirname, 'src/main/webapp/app/'),
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src/main/webapp'),
      },
    ],
  },
  root: path.resolve(__dirname, 'src/main/webapp'),
  server: {
    port: 9000,
    open: '/index.html',
    hmr: { overlay: true },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from the Target:',
              proxyRes.statusCode,
              req.url,
            );
          });
        },
      },
    },
  },
  define: {
    global: ['window'],
    'process.env': {},
  },
  build: {
    outDir: '../../dist',
    sourcemap: true,
  },
});
