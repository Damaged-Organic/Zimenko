const path = require('path');

const hbs = require('hbs');

const Helpers = require('@services/templating/handlebars/Helpers');

const publicPath = process.env.PATH_PUBLIC;

const viewsPath = path.resolve(
    process.env.DIR_BASE, process.env.DIR_APP, 'ui/views'
);

const partialsPath = path.resolve(
    process.env.DIR_BASE, process.env.DIR_APP, 'ui/views/partials'
);

const configure = async (app, router) => {
    app.set('views', viewsPath);
    app.set('view engine', 'hbs');

    const helpers = new Helpers(publicPath);

    await registerHelpers(helpers, app, router);
    await registerPartials();
};

const registerHelpers = async (helpers, app, router) => {
    /* Plain helpers */

    hbs.registerHelper('dump', helpers.dump);
    hbs.registerHelper('date', helpers.formatDate);
    hbs.registerHelper('toUpper', helpers.toUpper);
    hbs.registerHelper('toLower', helpers.toLower);
    hbs.registerHelper('static', helpers.staticPath());
    hbs.registerHelper('url', helpers.getURL(router));

    /* Cloudinary */

    hbs.registerHelper('cloudinary', helpers.cloudinary);

    /* Localization */

    app.use((req, res, next) => {
        hbs.registerHelper('i18n', helpers.localize(res));
        next();
    });

    /* Checkers */

    app.use((req, res, next) => {
        hbs.registerHelper('isCurrentLocale', helpers.isCurrentLocale(req));
        next();
    });

    app.use((req, res, next) => {
        hbs.registerHelper('isCurrentRoute', helpers.isCurrentRoute(req));
        next();
    });

    /* Getters */

    app.use((req, res, next) => {
        hbs.registerHelper('getAbsoluteURL', helpers.getAbsoluteURL(req));
        next();
    });

    /* Blocks */

    hbs.registerHelper('blockLangs', helpers.blockLangs());
    hbs.registerHelper('blockMenu', helpers.blockMenu());
    hbs.registerHelper('blockSocials', helpers.blockSocials());
    hbs.registerHelper('blockRelativeIndex', helpers.blockRelativeIndex());
    hbs.registerHelper('blockNavigation', helpers.blockNavigation());

    /* Borrowed helpers */

    hbs.registerHelper('times', helpers.times);
    hbs.registerHelper('compare', helpers.compare);
};

const registerPartials = async () => {
    return new Promise((resolve, reject) => {
        hbs.registerPartials(
            partialsPath, err => (err) ? reject(err) : resolve());
    });
};

module.exports = configure;
