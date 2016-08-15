const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
  bail: false,
  entry: {
    browser: './src/json_stream_reporter.js'
  },
  module: {
    loaders: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'}
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'umd',
    pathinfo: false
  },
  plugins: [
    new UglifyJsPlugin({compress: {warnings: false}, sourceMap: false})
  ]
};