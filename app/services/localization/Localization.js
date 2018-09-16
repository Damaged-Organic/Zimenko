const i18n = require('i18n');

const _defaultLocale = Symbol();
const _localizations = Symbol();
const _cookie = Symbol();

class Localization
{
    constructor(locales, localizations, directory, cookie) {
        Object.assign(this, i18n);

        this[_defaultLocale] = locales[0];
        this[_localizations] = localizations;
        this[_cookie] = cookie;

        this.configure({
            locales: locales,
            defaultLocale: locales[0],
            cookie: cookie,
            directory: directory,
        });
    }

    setLocaleToResponse(res, locale) {
        return res.cookie(this[_cookie], locale);
    }

    getLocaleFromRequest(req) {
        return req.cookies[this[_cookie]];
    }

    setRequestResponseLocale(req, res, locale) {
        let currentLocale;

        // New user without locale cookie set
        if( !this.getLocaleFromRequest(req) ) {
            switch(true) {
                case this[_localizations].ua.countries.includes(locale):
                    currentLocale = this[_localizations].ua.language;
                    break;
                case this[_localizations].ru.countries.includes(locale):
                    currentLocale = this[_localizations].ru.language;
                    break;
                default:
                    currentLocale = this[_defaultLocale];
            }

            // Set cookie
            this.setLocaleToResponse(res, currentLocale);

            // Set global locale for current cycle
            this.setLocale(req, currentLocale);
        }
    }
}

module.exports = Localization;
