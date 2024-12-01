import { env } from 'node:process';

const pm = env.PACKAGE_MANAGER || 'npx';

export default {
  '*.{ts,tsx}': files => {
    const escapedFiles = files.map(file => file.replace(/\$/g, '\\$'));
    return [
      `${pm} eslint --fix --max-warnings 0 --no-warn-ignored ${escapedFiles.join(' ')}`,
      `${pm} prettier --write --ignore-unknown ${escapedFiles.join(' ')}`,
    ];
  },
  '*.java': [`${pm} prettier --write --ignore-unknown "src/**/*.java"`],
  '*.{json,md,yml,yaml,xml,html,css,scss}': [
    `${pm} prettier --write --ignore-unknown "src/**/*.{json,md,yml,yaml,xml,html,css,scss}"`,
  ],
  'package.json': ['bun prettier --write', 'sort-package-json'],
};
