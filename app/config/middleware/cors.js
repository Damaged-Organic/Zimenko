const cors = require('cors');

const origin = process.env.CORS_ORIGIN;

let configure = () => {
    return cors({
        origin: [origin],
        methods: ["GET", "POST"]
    });
};

module.exports = configure;
