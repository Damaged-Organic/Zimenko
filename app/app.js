const express = require('express');

const NamedRouter = require('named-routes');

const configureTemplating = require('@config/templating/handlebars');
const configureDatabase = require('@config/database/mongoose');

const configureLogger = require('@config/middleware/logger');
const configureHelmet = require('@config/middleware/helmet');
const configureBodyParser = require('@config/middleware/bodyParser');
const configureCookieParser = require('@config/middleware/cookieParser');
const configureSession = require('@config/middleware/session');
const configureCors = require('@config/middleware/cors');
const configureFavicon = require('@config/middleware/favicon');
const configureStatic = require('@config/middleware/static');

const subdomain = require('@middleware/subdomain');
const ipDetection = require('@middleware/ipDetection');
const geolocation = require('@middleware/geolocation');
const localization = require('@middleware/localization');

const {
    handler400, handler404Soft, handler404Hard, handler500,
} = require('@routes/errors');
const index = require('@routes/index');

const app = express();

// Database (Mongoose)
const db = configureDatabase();

// Set named-routes views helpers
const router = express.Router();
const namedRouter = new NamedRouter();
namedRouter.extendExpress(router);

// Third-party middleware
app.use(configureHelmet());
app.use(configureLogger(app.get('env')));

const bodyParser = configureBodyParser();
app.use(bodyParser.json);
app.use(bodyParser.urlencoded);

app.use(configureCookieParser());
app.use(configureSession(db));
app.use(configureCors());
app.use(configureFavicon());
app.use(...configureStatic());

// Custom-tailored middleware
app.use(subdomain);
app.use(ipDetection);
app.use(geolocation);
app.use(localization);

// Templating (Handlebars)
configureTemplating(app, router);

// Routes
app.use('/', index(router));

// Not found
app.use(handler404Soft);

// Error handlers
app.use(handler400);
app.use(handler404Hard);
app.use(handler500);

// TODO: Proper logging (bunyan/winston) and shutdown
process.on('uncaughtException', function(err) {
    console.log(err);
})

process.on('unhandledRejection', function(reason, p) {
    console.log(reason, p);
})

module.exports = app;
