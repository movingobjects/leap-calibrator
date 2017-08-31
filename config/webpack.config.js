const path  = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {

  entry: {
      app: './src/index.js'
    },

    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../dist'),
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
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' }, // creates style nodes from JS strings
          { loader: 'css-loader' }, // translates CSS into CommonJS
          { loader: 'sass-loader' } // compiles Sass to CSS
        ]
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'node_modules/react/dist/react.js', to: 'vendor/react/' },
      { from: 'node_modules/react-dom/dist/react-dom.js', to: 'vendor/react/' },
      { from: 'node_modules/jquery/dist/jquery.min.js', to: 'resources/scripts/vendor/jquery/' }
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [
        'vendor/react/react.js',
        'vendor/react/react-dom.js',
        'resources/scripts/vendor/jquery/jquery.min.js'
      ],
      append: false
    })
  ],

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': 'jQuery'
  },

};
