const { resolve } = require('path');

module.exports = {
  root: true,
  env: {
    "browser": true,
    "es6": true,
    "node": true
  },
  extends: "airbnb-base",
  globals: {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  parserOptions: {
    "parser": "babel-eslint",
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  rules: {},
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ["@root", "./"],
          ["@frontend", resolve("frontend/src/")],
          ["@backend", resolve("backend/src/")],
          ["@lib", resolve("backend/src/lib")],
          ["@core", resolve("backend/src/core")],
          ["@strategies", resolve("strategies")],
        ]
      }
    }
  }
};