const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    'form-google-sheets': './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './out'),
    filename: '[name].js',
    library: 'FormGoogleSheets',
    libraryTarget: 'umd',
  },
  devtool: 'sourcemap',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] },
        }],
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true,
      },
    })
  ],
}
