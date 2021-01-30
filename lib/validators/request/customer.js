const Joi = require('joi');
const { app: { emailRegex } } = require('../../config');

const createCustomerRequestModel = Joi.object({

    id: Joi.string(),
    name: Joi.string().required(),
    email: Joi.string().trim().lowercase().regex(emailRegex),

});

const getCustomerVouhcersRequestModel = Joi.object({
    email: Joi.string().trim().lowercase().regex(emailRegex),
});

const getCustomerVouhcersQueryModel = Joi.object({
    status: Joi.string(),
    voucher: Joi.string(),
});
module.exports = {
    createCustomerRequestModel,
    getCustomerVouhcersRequestModel,
    getCustomerVouhcersQueryModel,
};
