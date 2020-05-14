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
              '@frontend': path.resolve(__dirname, 'frontend/src/'),
              '@backend': path.resolve(__dirname, 'backend/src/'),
              '@lib': path.resolve(__dirname, 'backend/src/lib'),
              '@core': path.resolve(__dirname, 'backend/src/core'),
              '@strategies': path.resolve(__dirname, 'strategies'),
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
