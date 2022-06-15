const webpack = require('webpack')

module.exports = {
  devServer: {
    port:$PORT,
    proxy: ''
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ]
  },
  transpileDependencies: [
    'vuetify'
  ]
}
