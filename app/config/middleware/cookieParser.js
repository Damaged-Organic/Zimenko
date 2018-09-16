const cookieParser = require('cookie-parser');

const cookie = process.env.COOKIE_SECRET;

let configure = () => {
    return cookieParser(cookie);
};

module.exports = configure;
