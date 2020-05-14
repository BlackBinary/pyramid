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
    resolve: {
      alias: {
        '@frontend': path.resolve(__dirname, 'frontend/src'),
      },
    },
  },
};
