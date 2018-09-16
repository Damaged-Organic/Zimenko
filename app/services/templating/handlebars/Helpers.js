const path = require('path');
const moment = require('moment');

const cloudinary = require('cloudinary');

const configureLocalization = require('@config/middleware/localization');
const configureRoutes = require('@config/website/routes');
const configureSocials = require('@config/website/socials');

const _publicPath = Symbol();

class Helpers
{
    constructor(publicPath) {
        this[_publicPath] = publicPath;
    }

    // Console data from hbs context
    dump(obj){
        console.log(obj);
    }

    // Static assets path
    staticPath() {
        let publicPath = this[_publicPath];

        return function(directory, filename) {
            return path.join(publicPath, directory, filename);
        }
    }

    // Date formatter
    formatDate(date, format) {
        let validDate = moment(date);

        if( !validDate.isValid() )
            throw new Error('Invalid date.');

        return validDate.format(format);
    }

    // Upper case transformers
    toUpper(text) {
        return text.toUpperCase();
    }

    // Lower case transformers
    toLower(text) {
        return text.toLowerCase();
    }

    // Localization translator
    localize(res) {
        return (...args) => {
            let name = args.shift();

            if (name === undefined)
                throw new Error('i18n helper received `undefined` translation key');

            return res.__(name);
        };
    }

    isCurrentLocale(req) {
        return (locale, options) => {
            return (locale === configureLocalization.instance.getLocale(req))
                ? options.fn(this)
                : options.inverse(this);
        };
    }

    isCurrentRoute(req) {
        return (route, options) => {
            return (route === req.route.name) ? options.fn(this) : options.inverse(this);
        }
    }

    // Hotfix to make named-routes helper work
    // due to route arguments handling error
    getURL(router) {
        return (name, params, method) => {
            let paramsHash = params.hash;

            return router.namedRoutes.build(name, paramsHash, method);
        };
    }

    // Absolute URL builder
    getAbsoluteURL(req) {
        return (subdomain) => {
            const domain = process.env.ORIGIN;

            let checkedSubdomain = subdomain ? subdomain + '.' : null;

            return `${req.protocol}://${checkedSubdomain}${domain}${req.path}`;
        };
    }

    blockLangs() {
        return (options) => {
            return options.fn(configureLocalization.instance.getLocales());
        }
    }

    blockMenu() {
        return (options) => {
            return options.fn(configureRoutes());
        }
    }

    blockSocials() {
        return (options) => {
            return options.fn(configureSocials());
        }
    }

    blockRelativeIndex() {
      return (model, index, options) => {
          if (!options)
            throw new Error('This block helper should have exactly two arguments');

          if (!model.getRelativeIndex)
            throw new Error('Model with pagination plugin expected');

          const shiftedIndex = model.getRelativeIndex(index + 1);

          let pad = "00";
          let str = "" + shiftedIndex;

          const paddedNumber = pad.substring(0, pad.length - str.length) + str;

          return options.fn(paddedNumber.split(''));
      }
    }

    blockNavigation() {
        return (model, route, category, options) => {

            if (!options)
              throw new Error('This block helper should have exactly two argument');

            if (!model.pagination)
                throw new Error('Model with pagination plugin expected');

            const probablyPrev = model.pagination.currentPage - 1;
            const probablyNext = model.pagination.currentPage + 1;
            const adjacentPages = {
                prev: (probablyPrev > 0) ? probablyPrev : null,
                next: (probablyNext <= model.pagination.pagesAmount) ? probablyNext : null,
            }

            return options.fn({
                adjacentPages, pagination: model.pagination, route: route, category,
            });
        }
    }

    cloudinary(...args) {
        let public_id, transforms, options;

        if (args.length == 2) {
            [ public_id, options ] = args;
        } else {
            [ public_id, transforms, options ] = args;
        }

        let jsonTransforms = {};
        try {
            jsonTransforms = (transforms) ? JSON.parse(transforms.replace(/\\"/g, '"')) : null;
        } catch(err) {
            throw new Error("Invalid transform JSON passed to Cloudinary helper");
        }

        const url = cloudinary.url(public_id, Object.assign({}, jsonTransforms, { secure: true }));

        if (!url)
          throw new Error(`Media file ${public_id} doesn't exist in Cloudinary`);

        return url;
    }

    /* @author: Eric Howe, Mike Mellor */
    times(n, block) {
        let accum = '';

        // Shifted index
        for(let i = 1; i <= n; ++i) {
            block.data.index = i;
            accum += block.fn(i);
        }

        return accum;
    }

    /* @author: Mike Griffin */
    compare(lvalue, operator, rvalue, options) {
        let operators, result;

        if (arguments.length < 4) {
            throw new Error("Handlerbars Helper 'compare' needs 3 parameters");
        }

        operators = {
            '==':     (l, r) => l == r,
            '===':    (l, r) => l === r,
            '!=':     (l, r) => l != r,
            '!==':    (l, r) => l !== r,
            '<':      (l, r) => l < r,
            '>':      (l, r) => l > r,
            '<=':     (l, r) => l <= r,
            '>=':     (l, r) => l >= r,
            'typeof': (l, r) => typeof l == r,
        };

        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue, rvalue);

        return (result)
            ? options.fn(this)
            : options.inverse(this);
    }
}

module.exports = Helpers;
