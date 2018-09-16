const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const modelName = 'ArticleBlock';
const I18nStringField = { type: I18nString, modelName: modelName };

const quoteObject = {
    text: I18nStringField,
    author: {
        name: I18nStringField,
        surname: I18nStringField,
    },
};

const articleBlockSchema = new I18nSchema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
    },
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
    video: String,
    content: I18nStringField,
    quote: quoteObject,
    order: Number,
});

articleBlockSchema.virtual('notEmpty').get(function() {
    return (this.content || (this.quote && this.quote.text) || (this.image && this.image.public_id));
});

const ArticleBlock = mongoose.model(modelName, articleBlockSchema);

module.exports = ArticleBlock;
