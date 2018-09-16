var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Lookbook Model
 * ==========
 */
var Lookbook = new keystone.List('Lookbook', {
	map: { name: 'title.en' },
	autokey: { path: 'slug', from: 'title.en', unique: true },
	singular: 'Lookbook',
	plural: 'Lookbooks',
	defaultSort: '-updatedAt',
});

var imageDirectory = 'images/lookbook';

Lookbook.add({
	lookbookCategory: {
		type: Types.Relationship, ref: 'LookbookCategory', required: true, initial: true,
	},
	slug: { type: String, readonly: true, initial: false },
	title: {
		en: { type: String, required: true, initial: true },
		ru: { type: String, required: true, initial: true },
		ua: { type: String, required: true, initial: true },
	},
	style: {
		en: { type: String, required: true, initial: true },
		ru: { type: String, required: true, initial: true },
		ua: { type: String, required: true, initial: true },
	},
	story: {
		en: { type: Types.Html, wysiwyg: true, height: 400 },
		ru: { type: Types.Html, wysiwyg: true, height: 400 },
		ua: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	images: {
		type: Types.CloudinaryImages,
		whenExists: 'overwrite',
		folder: imageDirectory,
		autoCleanup: true,
		required: true,
		initial: true,
	},
	isPreview: { type: Boolean, default: false },
	createdAt: { type: Date, hidden: true },
	updatedAt: { type: Date, hidden: true },
});

Lookbook.schema.pre('save', function (next) {
	var currentDate = new Date();

	this.updatedAt = currentDate;

	if (!this.createdAt) {
		this.createdAt = currentDate;
	}

	next();
});

Lookbook.defaultColumns = 'title.en|40%, lookbookCategory, isPreview, updatedAt';
Lookbook.register();

module.exports = Lookbook;
