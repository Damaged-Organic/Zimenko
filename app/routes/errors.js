exports.asyncHandler = (route) => {
    return (req, res, next) => {
        const routePromise = route(req, res, next);
        if( routePromise.catch ) {
            routePromise.catch(err => next(err));
        }
    }
}

exports.handler400 = (err, req, res, next) => {
    if (err.isJoi) {
        const error = {
            statusCode: 400,
            error: 'Bad Request',
            message: res.__('error_joi'),
        };

        return res.status(400).send(error);
    }

    next(err);
};

exports.handler404Soft = (req, res, next) => {
    const error = new Error();
    error.status = 404;
    error.message = res.__('error_404');

    next(error);
};

exports.handler404Hard = (err, req, res, next) => {
    if( err.status === 404 && req.app.get('env') === 'production' ) {
        err.message = res.__('error_404');
    }

    next(err);
};

exports.handler500 = (err, req, res, next) => {
    res.locals.message = err.message || res.__('error_500');
    res.locals.status = err.status || 500;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
};
