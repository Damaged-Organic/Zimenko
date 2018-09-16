const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const pagination = require('@models/mongoose/plugins/pagination');
const timestamps = require('@models/mongoose/plugins/timestamps');

const modelName = 'Lookbook';
const I18nStringField = { type: I18nString, modelName: modelName };

const lookbookSchema = new I18nSchema({
    slug: String,
    title: I18nStringField,
    style: I18nStringField,
    story: I18nStringField,
    images: [{
        public_id: String,
        version: Number,
        signature: String,
        width: Number,
        height: Number,
        format: String,
        resource_type: String,
        url: String,
        secure_url: String,
    }],
    lookbookCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LookbookCategory',
    },
    isPreview: Boolean
});
lookbookSchema.perPage = 10;

lookbookSchema.plugin(timestamps);
lookbookSchema.plugin(pagination, { perPage: lookbookSchema.perPage });

const Lookbook = mongoose.model(modelName, lookbookSchema);

module.exports = Lookbook;
