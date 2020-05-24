const path = require('path');

module.exports = {
  publicPath: '/',
  outputDir: 'frontend/dist',
  pages: {
    index: {
      title: 'Pyramid Project',
      entry: 'frontend/src/main.js',
      template: 'frontend/public/index.html',
    },
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
      ],
    },
    resolve: {
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
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@assets/styles/_variables.scss";',
      },
    },
  },
};
