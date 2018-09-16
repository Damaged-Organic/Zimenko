const fs = require('fs');
const path = require('path');

const morgan = require('morgan');

const logPath = path.resolve(
    process.env.DIR_BASE,
    'logs/morgan.log'
);

let configure = (env) => {
    let options = [];

    if( env === 'production' ) {
        options = ['common', {
            skip: function(req, res) { return res.statusCode < 400 },
            stream: fs.createWriteStream(logPath, { flags: 'a' })
        }];
    } else {
        options = ['dev'];
    }

    return morgan(...options);
};

module.exports = configure;
