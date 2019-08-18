const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, './src/styles/global.scss')]
      // patterns: []
    }
  },
  outputDir: '../appengine/default/static',
  assetsDir: 'static',
  devServer: {
    port: 8080,
    proxy: 'http://localhost:8081'
  }
}
