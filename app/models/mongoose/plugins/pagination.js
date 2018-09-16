const paginate = (perPage) => {
    const requestParameter = 'page';

    function validateCurrentPage(page) {
        if (page === undefined)
            return 1;

        const currentPage = Number(page);

        return (currentPage !== 0 && Number.isInteger(currentPage))
            ? currentPage
            : false;
    }

    function setModelPagination(pagination) {
        this.pagination = pagination;
    }

    return async function(req, conditions, projection, options, callback) {
        const currentPage = validateCurrentPage.call(this, req.params[requestParameter]);

        if (!currentPage)
            return false;

        const recordsAmount = await this.count(conditions);
        const pagesAmount = Math.ceil(recordsAmount / perPage);

        if ( currentPage !== 1 && currentPage > pagesAmount)
            return false;

        setModelPagination.call(this, {
            perPage, pagesAmount, currentPage, recordsAmount,
        });

        if (options) {
            delete options.skip;
            delete options.limit;
        }
        
        return this.find(conditions, projection, options, callback)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);
    }
};

const getRelativeIndex = function (index) {
    if (!this.pagination)
        throw new Error('Model is not yet paginated!');

    return index + (this.pagination.perPage * (this.pagination.currentPage - 1));
};

module.exports = (schema, pluginOptions) => {
    const { perPage } = pluginOptions;

    schema.statics.paginate = paginate(perPage);
    schema.statics.getRelativeIndex = getRelativeIndex;
};
