const session = require('express-session');
const connectMongo = require('connect-mongo');

const MongoStore = connectMongo(session);

const cookie = process.env.COOKIE_SECRET;
const origin = process.env.COOKIE_SECRET;

let configure = (connection) => {
    return session({
        secret: cookie,
        resave: false,
        saveUninitialized: true,
        cookie: {
            domain: origin, maxAge: 86000
        },
        store: new MongoStore({mongooseConnection: connection}),
    });
};

module.exports = configure;
