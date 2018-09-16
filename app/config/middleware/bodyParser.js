const bodyParser = require('body-parser');

let configure = () => {
    return {
        json: bodyParser.json(),
        urlencoded: bodyParser.urlencoded({ extended: true }),
    };
};

module.exports = configure;
