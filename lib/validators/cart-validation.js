const Joi = require('joi');
const { app: { emailRegex } } = require('../config');

const cartItemsBaseFields = {
    itemId: Joi.string().required(),
    name: Joi.string(),
    sku: Joi.string().required(),
    unitPrice: Joi.number().precision(2),
    specialPrice: Joi.number().precision(2),
    isScalableProduct: Joi.boolean().default(false),
    quantity: Joi.number().integer().min(1),
    category: Joi.string(),
    brand: Joi.string().allow(null).allow(''),
};
const cartCampaigns = Joi.array().items(Joi.object({
    object: Joi.string().required(),
    code: Joi.string().uppercase().required(),
    id: Joi.string(),
}));
const cartItems = Joi.array().items(Joi.object(cartItemsBaseFields));

const cartValidationPayload = Joi.object({
    order: Joi.object({
        orderId: Joi.string(),
        createdAt: Joi.date().iso(),
        customer: Joi.object({
            email: Joi.string().trim().lowercase().regex(emailRegex)
                .required(),
            metaData: Joi.object({}),
        }),
        isCustomerFirstOrder: Joi.boolean(),
        items: cartItems,
        subtotal: Joi.number().precision(2),
        payment: Joi.object({
            method: Joi.string().default('COD'),
            bin: Joi.string().min(6).max(8),
        }),
    }).required(),
    campaigns: cartCampaigns,
});

module.exports = {
    cartItemsBaseFields,
    cartValidationPayload,
    cartCampaigns,
    cartItems,
};
