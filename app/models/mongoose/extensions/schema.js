const mongoose = require('mongoose');

const configureLocalization = require('@config/middleware/localization');
const {
    I18nStringSchemaType,
} = require('@models/mongoose/extensions/schemaType');

const _locale = Symbol();

// Could also accept the response argument
const i18nInit = function(req) {
    this.schema.locale = configureLocalization.instance.getLocale(req);

    return this;
}

class I18nSchema extends mongoose.Schema
{
    constructor(obj, options) {
        super(obj, options);

        this[_locale] = null;

        this.statics.i18nInit = i18nInit;
    }

    set locale(locale) {
        if( !(typeof locale === 'string') )
            return false;

        this[_locale] = locale;
    }

    get locale() {
        if( !this[_locale] )
            return configureLocalization.instance.defaultLocale;

        return this[_locale];
    }
}

I18nSchema.Types.I18nString = I18nStringSchemaType;

module.exports = I18nSchema;
