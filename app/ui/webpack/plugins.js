var webpack = require('webpack');

const definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
});

const orderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

const uglifyJSPlugin = new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    comments: false,
    mangle: {
        screw_ie8: true,
        keep_fnames: true
    },
    compress: {
        screw_ie8: true
    },
});

const plugins = [
    definePlugin,
    orderPlugin,
    uglifyJSPlugin
];

module.exports = plugins;