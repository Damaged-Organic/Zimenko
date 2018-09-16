const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const modelName = 'AboutUs';
const I18nStringField = { type: I18nString, modelName: modelName };

const aboutUsSchema = new I18nSchema({
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
    cleanTitle: String,
});

const AboutUs = mongoose.model(modelName, aboutUsSchema);

module.exports = AboutUs;
