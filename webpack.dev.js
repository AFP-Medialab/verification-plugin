const { merge } = require('webpack-merge')
const config = require('./webpack.config.js')
const path = require("path");

module.exports = merge(config, {
    mode: 'development',
    devtool: "inline-source-map",
    devServer: {
        static: {
          directory: path.join(__dirname, 'build'),
        },
        compress: true,
        port: 9000,
      },
})