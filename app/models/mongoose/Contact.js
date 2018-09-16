const mongoose = require('mongoose');

const I18nSchema = require('@models/mongoose/extensions/schema');
const { I18nString } = require('@models/mongoose/extensions/schemaType');

const modelName = 'Contact';
const I18nStringField = { type: I18nString, modelName: modelName };

const contactSchema = new I18nSchema({
    fullName: I18nStringField,
    phone: String,
    role: I18nStringField,
});

contactSchema.virtual('phoneClean').get(function () {
    return this.phone.replace(/[\s\-]/g, '');
});

const Contact = mongoose.model(modelName, contactSchema);

module.exports = Contact;
