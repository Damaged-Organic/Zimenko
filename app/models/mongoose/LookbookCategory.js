const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const modelName = 'LookbookCategory';
const I18nStringField = { type: I18nString, modelName: modelName };

const lookbookCategorySchema = new I18nSchema({
    slug: String,
    title: I18nStringField,
    lookbooks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lookbook',
    },
});

const LookbookCategory = mongoose.model(modelName, lookbookCategorySchema);

module.exports = LookbookCategory;
