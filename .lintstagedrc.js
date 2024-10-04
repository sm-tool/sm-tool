export default {
  '*.{ts,tsx}': [
    'bun eslint --fix',
    "bun prettier --write '{,src/**/}*.{ts,tsx}'",
  ],
  '*.java': ["bun prettier --write '{,src/**/}*.java'"],
  '*.{json,md,yml,yaml,xml,html,css,scss}':
    "bun prettier --write '{,src/**/}*.{md,json,yml,html,css,scss,xml}'",
};
