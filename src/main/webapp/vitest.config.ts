/// <reference types="vitest" />
import { ConfigEnv, defineConfig, mergeConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import storybookTest from '@storybook/experimental-addon-test/vitest-plugin';

import viteConfig from './vite.config.ts';

export default defineConfig((environment: ConfigEnv) => {
  return mergeConfig(viteConfig(environment), {
    plugins: [
      react(),
      tsconfigPaths(),
      storybookTest({
        storybookScript: 'npm run sb --ci',
      }),
    ],
    test: {
      browser: {
        enabled: true,
        provider: 'playwright',
        headless: true,
        environment: 'jsdom',
        name: 'chromium',
        providerOptions: {
          devtools: true,
        },
      },
      globals: true,
      include: ['src/**/*.stories.?(m)[jt]s?(x)'],
      setupFiles: ['./.storybook/vitest.setup.ts'],
    },
  });
});
