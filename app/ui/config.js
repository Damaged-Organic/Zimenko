var path = require('path');

const base = './';

const config = {
    'css': path.resolve(base, 'assets/css'),
    'js': path.resolve(base, 'assets/js'),
    'fonts': path.resolve(base, 'assets/fonts'),
    'images': path.resolve(base, 'assets/images'),
    'build': path.resolve(base, 'public'),
}

module.exports = config;
