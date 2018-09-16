exports.throwBadRequestException = (message) => {
    let err = new Error(message || 'Bad Request');
    err.status = 400;
    throw err;
}

exports.throwForbiddenException = (message) => {
    let err = new Error(message || 'Forbidden');
    err.status = 403;
    throw err;
};

exports.throwNotFoundException = (message) => {
    let err = new Error(message || 'Not Found');
    err.status = 404;
    throw err;
};

exports.throwInternalServerErrorException = (message) => {
    let err = new Error(message || 'Internal Server Error');
    err.status = 500;
    throw err;
};
