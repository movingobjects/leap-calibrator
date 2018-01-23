
const path  = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {

  entry: {
    app: './app/src/entry.js'
  },

  output: {
    path: path.resolve(__dirname, '../app/build'),
    filename: 'resources/scripts/[name].bundle.js',
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ]
  },

  module: {
    rules: [

      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },

      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['react'],
          plugins: ['transform-object-rest-spread'],
        }
      },

      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }

    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'app/src/config.default.json', to: '.' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/src/index.html'
    })
  ]

};
