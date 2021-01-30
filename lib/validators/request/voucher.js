const Joi = require('joi');
const { app: { emailRegex } } = require('../../config');
const Constants = require('../../constants');

const createVoucherRequestModel = Joi.object({
    name: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    days: Joi.array().items(Joi.string().valid(...Object.values(Constants.DAYS))),
    status: Joi.string()
        .valid(
            Constants.VOUCHER.STATUS.ACTIVE,
            Constants.VOUCHER.STATUS.INACTIVE,
            Constants.VOUCHER.STATUS.PAUSED,
            Constants.VOUCHER.STATUS.COMPLETED,
        )
        .default(Constants.VOUCHER.STATUS.ACTIVE),
    customerEmail: Joi.string().trim().lowercase().regex(emailRegex),
    numberOfUsage: Joi.number().integer().min(1).default(9999999),
    numberOfUsagePerCustomer: Joi.number().integer().min(1).default(100),
    codeConfig: Joi.object({
        prefix: Joi.string(),
        postfix: Joi.string(),
        pattern: Joi.string(),
        charset: Joi.string(),
    }),
    numberOfVouchers: Joi.number().min(1).max(250)
        .default(1)
        .required(),
    type: Joi.string()
        .valid(
            Constants.VOUCHER.TYPE.DISCOUNT_VOUCHER,
            Constants.VOUCHER.TYPE.REFUND_VOUCHER,
            Constants.VOUCHER.TYPE.REFERRAL_VOUCHER,
        ).required(),
    ruleExpressionId: Joi.string().required(),
    discount: Joi.object({
        type: Joi.string().valid(
            Constants.VOUCHER.DISCOUNT.PERCENTAGE,
            Constants.VOUCHER.DISCOUNT.FIXED,
        ).required(),
        value: Joi.number().precision(2).required(),
        maxAmount: Joi.number().precision(2),
    }),
    redemption: Joi.object({
        redeemedCount: Joi.number().required(),
        redeemedAmount: Joi.number().required(),
        redemptionIds: Joi.array().items(Joi.string()),
        redemptionRollbackIds: Joi.array().items(Joi.string()),
    }),
});

module.exports = {
    createVoucherRequestModel,
};
