// const hbs = require('hbs');
//
// const configureLocalization = require('@config/middleware/localization');
// const configureRoutes = require('@config/website/routes');
// const configureSocials = require('@config/website/socials');
//
// class Partials
// {
//     langsHolder(template) {
//         return () => {
//             const partial = hbs.handlebars.compile(template);
//             return partial({
//                 locales: configureLocalization.instance.getLocales() });
//         };
//     }
//
//     menuHolder(template) {
//         return () => {
//             const partial = hbs.handlebars.compile(template);
//             return partial({
//                 routes: configureRoutes() });
//         }
//     }
//
//     socialsHolder(template) {
//         return () => {
//             const partial = hbs.handlebars.compile(template);
//             return partial({
//                 socials: configureSocials() });
//         }
//     }
// }
//
// module.exports = Partials;
