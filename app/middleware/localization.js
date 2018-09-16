const configureLocalization = require('@config/middleware/localization');

const processDependentModules = (localization, req, res) => {
    // Subdomain-defined locale has highest priority.
    // If not defined, trying to use geolocation locale,
    // and doing nothing for localization default fallback
    let currentLocale =
        req.app.subdomains.userSubdomain ||
        req.app.geolocation.userCountryCode
    ;

    if( currentLocale )
        localization.setRequestResponseLocale(req, res, currentLocale);
};

module.exports = (req, res, next) => {
    let localization = configureLocalization();

    localization.init(req, res);

    processDependentModules(localization, req, res);

    next();
};
