var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * LookbookIntro Model
 * ==========
 */
var LookbookIntro = new keystone.List('LookbookIntro', {
    map: { name: 'title' },
    singular: 'Lookbook Intro',
    plural: 'Lookbook Intro',
    // Enable these operations on initial database fill
    // nocreate: true,
    // nodelete: true,
});

var imageDirectory = 'images/lookbook/intro';

LookbookIntro.add({
    title: { type: String, default: 'Lookbook Intro', hidden: true },
    images: {
        type: Types.CloudinaryImages,
        whenExists: 'overwrite',
        folder: imageDirectory,
        autoCleanup: true,
        required: true,
        initial: true
    },
});

LookbookIntro.defaultColumns = 'title';
LookbookIntro.register();

module.exports = LookbookIntro;
