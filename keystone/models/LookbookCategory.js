var keystone = require('keystone');

/**
 * LookbookCategory Model
 * ==========
 */
var LookbookCategory = new keystone.List('LookbookCategory', {
	map: { name: 'slug' },
	autokey: { path: 'slug', from: 'title.en', unique: true },
	singular: 'LookbookCategory',
	plural: 'LookbookCategories',
    // Enable these operations on initial database fill
	// nocreate: true,
	// nodelete: true,
});

LookbookCategory.add({
	slug: { type: String, readonly: true, initial: false },
	title: {
		en: { type: String, required: true, initial: true },
		ru: { type: String, required: true, initial: true },
		ua: { type: String, required: true, initial: true },
	},
});

LookbookCategory.defaultColumns = 'slug, title.en';
LookbookCategory.register();

module.exports = LookbookCategory;
