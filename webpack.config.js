/* eslint-disable no-unused-vars */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { NoEncryption } = require('@mui/icons-material');
// const Dotenv = require('dotenv-webpack');
require('dotenv').config();

module.exports = {
  entry: [
    // entry point of our app
    './client/index.js',
  ],
  mode: 'none',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
    // publicPath: '/'
  },
  devtool: 'eval-source-map',
  devServer: {
    host: 'localhost',
    port: 8080,
    // enable HMR on the devServer
    hot: true,
    open: true,
    // fallback to root for other urls
    historyApiFallback: true,
    static: {
      // match the output path
      directory: path.resolve(__dirname, 'dist'),
      // // match the output 'publicPath'
      publicPath: '/',
    },

    headers: { 
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    // /**
    //  * proxy is required in order to make api calls to
    //  * express server while using hot-reload webpack server
    //  * routes api fetch requests from localhost:8080/api/* (webpack dev server)
    //  * to localhost:3000/api/* (where our Express server is running)
    //  */
    proxy: {
      '/**': {
        target: 'http://localhost:3000/',
        secure: false,

      },
    //   '/assets/**': {
    //     target: 'http://localhost:3000/',
    //     secure: false,
    //   },
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        // exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {//test gives regex file path, use is name of loader
        test: /\.(png|jpg|gif|svg)$/i, 
        type: 'asset/resource',
        exclude: /node_modules/
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: "./public/images/favicon.ico",
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'REACT_APP_AUTH0_DOMAIN': JSON.stringify(process.env.REACT_APP_AUTH0_DOMAIN),
        'REACT_APP_AUTH0_CLIENTID': JSON.stringify(process.env.REACT_APP_AUTH0_CLIENTID),
        'LOCALMODE': JSON.stringify(process.env.LOCALMODE)
      }
    })
    // new Dotenv({ systemvars: true }),
  ],
  resolve: {
    // Enable importing JS / JSX files without specifying their extension
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
}
