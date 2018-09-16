var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * ArticleBlock Model
 * ==========
 */
var ArticleBlock = new keystone.List('ArticleBlock', {
	singular: 'Article Block',
	plural: 'Article Blocks',
	defaultSort: 'article order',
	defaultColumns: 'order, title.en, article',
});

var imageDirectory = 'images/articles/blocks';
var visualEditor = {
	type: Types.Html,
	wysiwyg: true,
	height: 200,
};
var quoteObject = {
	text: {
		en: { type: Types.Textarea },
		ru: { type: Types.Textarea },
		ua: { type: Types.Textarea },
	},
	author: {
		name: {
			en: { type: String },
			ru: { type: String },
			ua: { type: String },
		},
		surname: {
			en: { type: String },
			ru: { type: String },
			ua: { type: String },
		},
	},
};

ArticleBlock.add({
	article: {
		type: Types.Relationship, ref: 'Article', required: true, initial: true,
	},
	image: {
		type: Types.CloudinaryImage,
		whenExists: 'overwrite',
		folder: imageDirectory,
		autoCleanup: true,
	},
	video: { type: Types.Url },
	content: {
		en: visualEditor,
		ru: visualEditor,
		ua: visualEditor,
	},
	quote: quoteObject,
	order: { type: Number },
});

ArticleBlock.schema.pre('save', function (next) {
	if (this.order) {
		return next();
	}

	ArticleBlock.model.count({ article: this.article }, (err, count) => {
		this.order = count + 1;
		next();
	});
});

ArticleBlock.register();
