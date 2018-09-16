const mongoose = require('mongoose');

const locales = [
    process.env.LOCALE_EN, process.env.LOCALE_UA, process.env.LOCALE_RU,
];

class I18nString
{
    constructor(value) {
        // Maps set to existing locales only, skipping everything else
        locales.map((locale) => {
            this[locale] = (locale in value) ? value[locale] : null
        });
    }
}

class I18nStringSchemaType extends mongoose.SchemaType
{
    constructor(path, options, instance) {
        if( !options.modelName )
            throw new Error("modelName should be set in schemaType options!");

        super(path, options, instance);
    }

    cast(value) {
        let model = mongoose.model(this.options.modelName);

        if( !model || !model.schema )
            throw new Error("Schema hasn't been registered for modelName");

        let typeObject = new I18nString(value);

        return typeObject[model.schema.locale];
    }
}

module.exports = { I18nString, I18nStringSchemaType };
