import { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  typescript: {
    //reactDocgen: 'react-docgen-typescript',
  },
  addons: [
    '@storybook/addon-jest',
    '@storybook/addon-a11y',
    '@storybook/addon-coverage',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
};

export default config;
