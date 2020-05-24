const path = require('path');

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.vue'],
      },
      webpack: {
        config: {
          resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
              '@root': path.resolve(__dirname),
              '@data': path.resolve(__dirname, 'data'),
              '@server': path.resolve(__dirname, 'server'),
              '@assets': path.resolve(__dirname, 'assets'),
              '@frontend': path.resolve(__dirname, 'frontend/src'),
              '@indicators': path.resolve(__dirname, 'indicators'),
            },
          },
        },
      },
    },
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
