var path = require('path'),
    webpack = require('webpack'),
    config = require('../config'),

    entries = require('./entries'),
    aliases = require('./aliases');

const devConfig = {
    entry: entries,
    output: {
        path: path.join(config.build, 'js'),
        publicPath: 'public/js',
        filename: '[name].bundle.dev.js'
    },
    resolve: {
        alias: aliases,
        extensions: ['.js', '.jsx', '.es6']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'eval-source-map',
    cache: false
}

module.exports = devConfig;
