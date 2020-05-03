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
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    rules: {},
    settings: {
        'import/resolver': {
            alias: {
                map: [
                    ["@root", "./"],
                    ["@lib", resolve("src/lib")],
                    ["@core", resolve("src/core")],
                    ["@data", resolve("data")],
                    ["@strategies", resolve("strategies")],
                ]
            }
        }
    }
};