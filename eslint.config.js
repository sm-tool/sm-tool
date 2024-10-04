import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier';
import eslintComment from 'eslint-plugin-eslint-comments';
import a11y from 'eslint-plugin-jsx-a11y';

export default [
  eslint.configs.recommended,
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        browser: true,
        window: true,
        document: true,
        console: true,
        React: 'writable',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      unicorn,
      prettier,
      a11y,
      'eslint-comments': eslintComment,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
      'import/core-modules': ['sinon'],
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['strict-type-checked'].rules,
      ...prettier.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...unicorn.configs.recommended.rules,
      'eslint-comments/require-description': ['error', { ignore: [] }],
      'no-unused-vars': 'off',
      'no-var': 0,
      'import/no-anonymous-default-export': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'unicorn/no-array-reduce': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['src/**/*.{js,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-empty-file': 'off',
      'unicorn/no-nested-ternary': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    ignores: [
      'dist',
      '**/*/stories.tsx',
      'node_modules/',
      'src/main/docker',
      'src/main/docker/',
      'src/test/javascript/cypress/',
      'src/test/javascript/protractor.conf.js',
      'jest.conf.js',
      'src/test/javascript/jest.conf.js',
      'webpack/',
      'target/',
      'build/',
      'node/',
      'postcss.config.js',
      'src/main/webapp/components/ui/shadcn/auto-form',
      'src/main/webapp/i18n/',
    ],
  },
];