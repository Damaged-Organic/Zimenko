const subdomain = require('express-subdomain');

let getUserSubdomain = (req) => {
    // To avoid multi-level domain collision in express-subdomain
    // See https://github.com/bmullan91/express-subdomain/issues/17
    let domain_parts = process.env.ORIGIN.split('.').length - 1;
    if( domain_parts > req.subdomains.length )
        return false;

    let userSubdomain = req.subdomains.pop();
    if( !userSubdomain )
        return false;

    let availableSubdomains = [
        process.env.LOCALE_EN, process.env.LOCALE_UA, process.env.LOCALE_RU
    ];

    if( !availableSubdomains.includes(userSubdomain) )
        throw new Error('Subdomain not found');

    return userSubdomain;
};

let processDependentModules = (subdomain, req) => {
    req.app.subdomains = {};

    let userSubdomain;
    if( (userSubdomain = getUserSubdomain(req)) )
        req.app.subdomains.userSubdomain = userSubdomain;
};

module.exports = subdomain('*', (req, res, next) => {
    try {
        processDependentModules(subdomain, req, res);
    } catch(err) {
        err.status = 404;
        return next(err);
    }

    next();
});
