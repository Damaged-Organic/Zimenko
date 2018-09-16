const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const pagination = require('@models/mongoose/plugins/pagination');
const timestamps = require('@models/mongoose/plugins/timestamps');

const modelName = 'Article';
const I18nStringField = { type: I18nString, modelName: modelName };

const articleSchema = new I18nSchema({
    articleBlocks: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ArticleBlock',
    },
    slug: String,
    title: I18nStringField,
    image: {
        public_id: String,
        version: Number,
        signature: String,
        width: Number,
        height: Number,
        format: String,
        resource_type: String,
        url: String,
        secure_url: String,
    },
    content: I18nStringField,
});
articleSchema.perPage = 10;

articleSchema.plugin(timestamps);
articleSchema.plugin(pagination, { perPage: articleSchema.perPage });

const Article = mongoose.model(modelName, articleSchema);

module.exports = Article;
