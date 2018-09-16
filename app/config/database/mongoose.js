const mongoose = require('mongoose');

const connectionURI = process.env.MONGO_URI;

let configure = () => {
    // Set ES2015 promises to avoid deprecation notice
    mongoose.Promise = Promise;

    mongoose.connect(connectionURI, {
        useMongoClient: true,
    });

    mongoose.connection.on('error', (err) => {
        console.error('Mongoose errored: ' + err);
    });

    return mongoose.connection;
};

module.exports = configure;
