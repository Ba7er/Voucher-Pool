
const Joi = require('joi');
const Constants = require('../constants/index');
const Config = require('../config');
const BaseModel = require('./base-model');
const RuleExpressionModel = require('./rule-expression');

module.exports = class Voucher extends BaseModel {
    static collectionName() {
        return Config.cosmosDB.containers.vouchers;
    }

    static idField() {
        return 'id';
    }

    static partitionKeyField() {
        return 'code';
    }

    static uniqueConstraintFields() {
        return [
            ['/code'],
        ];
    }

    static isAutoCreationTimestamp() {
        return true;
    }

    static isAutoUpdationTimestamp() {
        return true;
    }

    static softDelete() {
        return true;
    }

    static objectName() {
        return Constants.OBJECTS.VOUCHER;
    }

    static joiSchema() {
        return Joi.object({
            id: Joi.string(),
            name: Joi.string().required(),
            startDate: Joi.date().iso(),
            endDate: Joi.date().iso(),
            days: Joi.array().items(Joi.string().valid(...Object.values(Constants.DAYS))),
            createdAt: Joi.date().iso(),
            updatedAt: Joi.date().iso(),
            status: Joi.string()
                .valid(
                    Constants.VOUCHER.STATUS.ACTIVE,
                    Constants.VOUCHER.STATUS.INACTIVE,
                    Constants.VOUCHER.STATUS.PAUSED,
                    Constants.VOUCHER.STATUS.COMPLETED,
                )
                .default(Constants.VOUCHER.STATUS.ACTIVE),
            createdBy: Joi.object({
                id: Joi.string().required(),
                email: Joi.string().trim().lowercase().regex(Config.app.emailRegex),
                name: Joi.string().required(),
            }),
            customerEmail: Joi.string().trim().lowercase().regex(Config.app.emailRegex),
            numberOfUsage: Joi.number().integer().min(1).default(1),
            numberOfUsagePerCustomer: Joi.number().integer().min(1).default(1),
            code: Joi.string().required(),
            codeConfig: Joi.object({
                length: Joi.number(),
                prefix: Joi.string(),
                postfix: Joi.string(),
                pattern: Joi.string(),
                charset: Joi.string(),
            }),
            type: Joi.string()
                .valid(
                    Constants.VOUCHER.TYPE.DISCOUNT_VOUCHER,
                ),
            ruleExpression: RuleExpressionModel.joiSchema(),
            discount: Joi.object({
                type: Joi.string().valid(
                    Constants.VOUCHER.DISCOUNT.PERCENTAGE,
                    Constants.VOUCHER.DISCOUNT.FIXED,
                ),
                value: Joi.number().precision(2),
                maxAmount: Joi.number().precision(2),
            }),
            redemption: Joi.object({
                redeemedBy: Joi.array().items(Joi.string()),
                redeemedOn: Joi.date().iso(),
                redeemedCount: Joi.number(),
                redeemedAmount: Joi.number(),
                redemptionIds: Joi.array().items(Joi.string()),
                redemptionRollbackIds: Joi.array().items(Joi.string()),
            }),
        }).unknown();
    }
};
