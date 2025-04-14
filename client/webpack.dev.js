const path = require('path');
const common = require('./webpack.common');

module.exports = {
  ...common,
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    ...common.resolve,
  },
  devServer: {
    port: 3097,
    host: '0.0.0.0',
    hot: true,
    open: false,
    historyApiFallback: true,
    allowedHosts: 'all',
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/'
    }
  }
};

