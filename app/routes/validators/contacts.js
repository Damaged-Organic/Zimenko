const Joi = require('joi');

const contactsPostValidator = {
    headers: Joi.object({
        'content-type': Joi.string().regex(/application\/x-www-form-urlencoded*/).required(),
    }).unknown(),
    body: Joi.object().keys({
        name: Joi.string().alphanum().min(1).max(200).required(),
        email: Joi.string().email().required(),
        message: Joi.string().min(1).max(1000).required(),
    }),
};

module.exports = { contactsPostValidator };
