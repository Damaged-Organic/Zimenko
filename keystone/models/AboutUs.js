var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * AboutUs Model
 * ==========
 */
var AboutUs = new keystone.List('AboutUs', {
    map: { name: 'cleanTitle' },
    singular: 'About Us',
    plural: 'About Us',
    // Enable these operations on initial database fill
    // nocreate: true,
    // nodelete: true,
});

var imageDirectory = 'images/about';
var visualEditorTitle = {
    type: Types.Html,
    wysiwyg: true,
    height: 50,
    required: true,
    initial: true,
};
var visualEditorContent = {
    type: Types.Html,
    wysiwyg: true,
    height: 400,
};

AboutUs.add({
    title: {
        en: visualEditorTitle,
        ru: visualEditorTitle,
        ua: visualEditorTitle,
    },
    image: {
        type: Types.CloudinaryImage,
        whenExists: 'overwrite',
        folder: imageDirectory,
        autoCleanup: true,
        required: true,
        initial: true,
    },
    content: {
        en: visualEditorContent,
        ru: visualEditorContent,
        ua: visualEditorContent,
    },
    cleanTitle: { type: String, hidden: true, initial: false, required: false },
});

AboutUs.schema.pre('save', function (next) {
    if (!this.title.en) {
        return next();
    }

    for (const index in this.title) {
        if (['en', 'ua', 'ru'].includes(index)) {
            this.title[index] = (
                this.title[index].replace(/<(?!\/?strong(?=>|\s.*>))\/?.*?>/ig, ''));
        }
    }

    this.cleanTitle = this.title.en.replace(/(<([^>]+)>)/ig, '');

    next();
});

AboutUs.defaultColumns = 'cleanTitle';
AboutUs.register();

module.exports = AboutUs;
