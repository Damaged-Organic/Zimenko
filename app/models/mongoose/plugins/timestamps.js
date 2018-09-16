const moment = require('moment');

const datestamp = function () {
    return moment(this.createdAt).format('YYYY-MM-DD');
};

const humanstamp = function () {
    // Everything after year needs to be replaced with nothing ('г.', 'р.', etc.)
    const regex = new RegExp(`(${moment(new Date()).format('Y')}).*$`);

    // Dirty locale/language hack
    const locale = (this.schema.locale === 'ua') ? 'uk': this.schema.locale;

    return moment(this.createdAt).locale(locale).format('LL').replace(regex, '$1');
};

module.exports = (schema, pluginOptions) => {
    schema.add({
        createdAt: Date,
        updatedAt: Date,
    });

    schema.virtual('datestamp').get(datestamp);
    schema.virtual('humanstamp').get(humanstamp);
};
