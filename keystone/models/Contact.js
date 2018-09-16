var keystone = require('keystone');

/**
 * Contact Model
 * ==========
 */
var Contact = new keystone.List('Contact', {
    map: { name: 'fullName.en' },
    singular: 'Contact',
    plural: 'Contacts',
    // Enable these operations on initial database fill
    // nocreate: true,
    // nodelete: true,
});

Contact.add({
    fullName: {
        en: { type: String, required: true, initial: true },
        ru: { type: String, required: true, initial: true },
        ua: { type: String, required: true, initial: true },
    },
    phone: { type: String, required: true, initial: true },
    role: {
        en: { type: String },
        ru: { type: String },
        ua: { type: String },
    },
});

Contact.defaultColumns = 'fullName.en, phone';
Contact.register();

module.exports = Contact;
