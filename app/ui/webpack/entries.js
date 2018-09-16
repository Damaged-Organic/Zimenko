var path = require('path'),
    fs = require('fs'),
    config = require('../config');

const jsPath = path.join(config.js, 'pages');
const files = fs.readdirSync(jsPath);

const parseFile = (file) => path.parse(file);

const getAbsFilePath = (file) => path.join(config.js, 'pages', file);

const entries = files.reduce((obj, file) => {
    
    let parsedFile = parseFile(file),
        absPathToFile = getAbsFilePath(file);

    obj[parsedFile.name] = absPathToFile;

    return obj;

}, {});

module.exports = entries;