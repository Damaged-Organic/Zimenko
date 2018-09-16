const path = require('path');

const favicon = require('serve-favicon');

const faviconPath = path.resolve(
    process.env.DIR_BASE,
    process.env.DIR_APP,
    'ui/public/images/favicons/16x16.png'
);

let configure = () => {
    return favicon(faviconPath);
};

module.exports = configure;
