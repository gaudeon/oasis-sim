const path = require('path');
const webpack = require('webpack');

// Listen port
const PORT = process.env.PORT || 8080;

// Load base config
const baseConfig = require('./webpack.config.base');

// Create the config
const config = Object.create(baseConfig);

config.mode = "development";

config.devtool = "eval-source-map";

config.devServer = {
    host: "0.0.0.0",
    disableHostCheck: true,
    port: PORT,
    hot: true,
    contentBase: path.resolve(__dirname, '../src'),
    watchContentBase: true
};

module.exports = config;
