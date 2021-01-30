
const Joi = require('joi');
const Constants = require('../constants/index');
const Config = require('../config/index');
const BaseModel = require('./base-model');

const itemsSchema = Joi.array().items(
    Joi.object({
        itemId: Joi.string(),
        name: Joi.string(),
        sku: Joi.string().required(),
        unitPrice: Joi.number().precision(2),
        specialPrice: Joi.number().precision(2),
        isScalableProduct: Joi.boolean().default(false),
        quantity: Joi.number().integer().min(1),
        category: Joi.string(),
        brand: Joi.string().allow(null).allow(''),
    }),
);

module.exports = class Redemption extends BaseModel {
    static collectionName() {
        return Config.cosmosDB.containers.redemptions;
    }

    static idField() {
        return 'id';
    }

    static partitionKeyField() {
        return 'id';
    }

    static isAutoCreationTimestamp() {
        return true;
    }

    static isAutoUpdationTimestamp() {
        return false;
    }

    static softDelete() {
        return true;
    }

    static objectName() {
        return Constants.OBJECTS.REDEMPTION;
    }

    static joiSchema() {
        return Joi.object({
            id: Joi.string(),
            parentId: Joi.string(),
            object: Joi.string().required().valid(Constants.OBJECTS.REDEMPTION, Constants.OBJECTS.REDEMPTION_ROLLBACK),

            status: Joi.string()
                .valid(
                    Constants.REDEMPTION.STATUS.REDEEM_SUCCESS,
                    Constants.REDEMPTION.STATUS.REDEEM_FAILED,
                    Constants.REDEMPTION.STATUS.REDEEM_ROLLBACK_SUCCESS,
                    Constants.REDEMPTION.STATUS.REDEEM_ROLLBACK_FAILED,
                )
                .default(Constants.REDEMPTION.STATUS.REDEEM_SUCCESS),
            order: Joi.object({
                orderId: Joi.string().required(),
                createdAt: Joi.date().iso(),
                customer: Joi.object({
                    email: Joi.string(),
                    metaData: Joi.object({}),
                }),
                isCustomerFirstOrder: Joi.boolean(),
                subtotal: Joi.number().precision(2),
                items: itemsSchema,
                payment: Joi.object({
                    method: Joi.string(),
                    bin: Joi.number(),
                }),
            }),
            discount: {
                name: Joi.string(),
                code: Joi.string(),
                totalDiscountAmount: Joi.number().precision(2),
                subtotal: Joi.number().precision(2),
            },
        }).unknown();
    }
};
