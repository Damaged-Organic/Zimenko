var path = require('path');
var moduleAlias = require('module-alias');

/* Application path aliases definition */

var appPath = path.resolve(process.env.DIR_BASE, process.env.DIR_APP);

var aliases = {
    '@root': '',
    '@config': 'config',
    '@middleware': 'middleware',
    '@services': 'services',
    '@models': 'models',
    '@routes': 'routes',
    '@views': 'views'
};

for( var alias in aliases ) {
    moduleAlias.addAlias(alias, path.join(appPath, aliases[alias]));
}
