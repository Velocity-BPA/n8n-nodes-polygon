/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    extraFileExtensions: ['.json'],
  },
  ignorePatterns: [
    '.eslintrc.js',
    'gulpfile.js',
    'jest.config.js',
    'node_modules/**',
    'dist/**',
    'scripts/**',
  ],
  plugins: ['n8n-nodes-base'],
  extends: ['plugin:n8n-nodes-base/community'],
  rules: {
    'n8n-nodes-base/community-package-json-name-still-default': 'off',
  },
};
