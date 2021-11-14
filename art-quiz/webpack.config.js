const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const MODE = (process.env.npm_lifecycle_event === 'dev') ? 'development' : 'production';
const ISDEV = MODE === 'development';

module.exports = {
  mode: MODE,
  entry: {
    main: path.resolve(__dirname, 'src/js/index.js')
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          {
            loader: ISDEV ? 'style-loader' : MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: ISDEV,
              url: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: ISDEV
            }
          }
        ]
      }
    ]
  },
  devServer: {
    watchFiles: ['./src'],
    static: './dist',
    port: 8080,
    liveReload: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets')
        },
        {
          from: path.resolve(__dirname, 'src/views'),
          to: path.resolve(__dirname, 'dist/views')
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: './styles/[name].css'
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    clean: true
  }
};
