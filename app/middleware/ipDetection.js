const ipware = require('ipware');

let getClientIp = (req) => {
    let clientIp = ipware().get_ip(req).clientIp;

    if( !clientIp )
        return false;

    return clientIp;
};

let processDependentModules = (ipware, req) => {
    req.app.ipDetection = {};

    let clientIp;
    if( (clientIp = getClientIp(req)) )
        req.app.ipDetection.clientIp = clientIp;
};

module.exports = (req, res, next) => {
    processDependentModules(ipware, req, res);

    next();
};
