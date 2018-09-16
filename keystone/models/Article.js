var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Article Model
 * ==========
 */
var Article = new keystone.List('Article', {
	map: { name: 'slug' },
	autokey: { path: 'slug', from: 'title.en', unique: true },
	singular: 'Article',
	plural: 'Articles',
	defaultSort: '-createdAt',
});

var imageDirectory = 'images/articles';
var visualEditor = {
	type: Types.Html,
	wysiwyg: true,
	height: 200,
};

Article.add({
	slug: { type: String, readonly: true, initial: false },
	title: {
		en: { type: String, required: true, initial: true },
		ru: { type: String, required: true, initial: true },
		ua: { type: String, required: true, initial: true },
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
		en: visualEditor,
		ru: visualEditor,
		ua: visualEditor,
	},
	createdAt: { type: Date, hidden: true },
	updatedAt: { type: Date, hidden: true },
});

Article.schema.pre('save', function (next) {
	var currentDate = new Date();

	this.updatedAt = currentDate;

	if (!this.createdAt) {
		this.createdAt = currentDate;
	}

	next();
});

Article.relationship({
	path: 'articleBlocks', ref: 'ArticleBlock', refPath: 'article',
});

Article.defaultColumns = 'title.en, slug|20%, updatedAt, createdAt';
Article.register();

module.exports = Article;
