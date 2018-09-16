var keystone = require('keystone');
var routes = require('../../app/config/website/routes')();

var Types = keystone.Field.Types;

/**
 * Meta Model
 * ==========
 */
var Meta = new keystone.List('Meta', {
	map: { name: 'route' },
	singular: 'Meta',
	plural: 'Meta',
	defaultSort: 'id',
	defaultColumns: 'route, title',
	// Enable these operations on initial database fill
	// nocreate: true,
	// nodelete: true,
});

Meta.add({
	route: { type: Types.Select, unique: true, initial: true, options: routes.map(route => {
		return { value: route.route, label: route.title };
	}) },
	title: {
		en: { type: String, required: true, initial: true },
		ru: { type: String, required: true, initial: true },
		ua: { type: String, required: true, initial: true },
	},
	keywords: {
		en: { type: Types.Textarea, height: 70 },
		ru: { type: Types.Textarea, height: 70 },
		ua: { type: Types.Textarea, height: 70 },
	},
	description: {
		en: { type: Types.Textarea },
		ru: { type: Types.Textarea },
		ua: { type: Types.Textarea },
	},
	robots: { type: String },
});

Meta.defaultColumns = 'route, title.en, robots';
Meta.register();

module.exports = Meta;
