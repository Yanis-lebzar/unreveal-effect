const path = require('path')

const { merge } = require('webpack-merge')

const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',
  output: {
    path: path.join(__dirname, 'public')
  }
})
