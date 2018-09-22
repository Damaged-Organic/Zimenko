const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const modelName = 'Meta';
const I18nStringField = { type: I18nString, modelName: modelName };

let metaSchema = new I18nSchema({
    route: String,
    title: I18nStringField,
    keywords: I18nStringField,
    description: I18nStringField,
    canonical: I18nStringField,
    robots: String,
});

let Case = mongoose.model(modelName, metaSchema);

module.exports = Case;
