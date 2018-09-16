const path = require('path');

const express = require('express');

const staticPath = path.resolve(
    process.env.DIR_BASE,
    process.env.DIR_APP,
    'ui/public'
);

let configure = () => {
    return ['/static', express.static(staticPath)];
};

module.exports = configure;
