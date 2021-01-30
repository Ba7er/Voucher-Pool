const Boom = require('@hapi/boom');

const invalidDateRange = (startDate, endDate, campaigId) => Boom.badRequest(JSON.stringify({
    error: 'InvalidDateRange',
    error_description: `Campaign ${campaigId} is valid between ${startDate} and ${endDate}.`,
}));

const dbSchemaValidationError = (msg) => Boom.badRequest(JSON.stringify({
    error: 'DBSchemaValidationError',
    error_description: msg,
}));
const voucherCodeGenerationError = (codeConfig) => Boom.badRequest(JSON.stringify({
    error: 'VoucherCodeGenerationError',
    error_description: `voucher code generation failed for condeConfig: ${JSON.stringify(codeConfig)}`,
}));
const customerAlreadyExist = ({ email }) => Boom.badRequest(JSON.stringify({
    error: 'customerAlreadyExist',
    error_description: `Customer ${email} already exist`,
}));

const customerNotFound = (email) => Boom.notFound(JSON.stringify({
    error: 'customerNotFound',
    error_description: `Customer not found the email id '${email}'`,
}));
const voucherNotFound = (id) => Boom.notFound(JSON.stringify({
    error: 'voucherNotFound',
    error_description: `Voucher not found with ${id}`,
}));

const ruleNotFound = (id) => Boom.notFound(JSON.stringify({
    error: 'ruleNotFound',
    error_description: `Rule not found for [${id}]`,
}));

const noValidCampaignServiceExist = (object) => Boom.badRequest(JSON.stringify({
    error: 'NoValidCampaignServiceExist',
    error_description: `Campaign service does not exist for ${object}.`,
}));

const multipleVouchersNotAllowedToRedeem = () => Boom.badRequest(JSON.stringify({
    error: 'multipleVouchersNotAllowedToRedeem',
    error_description: 'Multiple vouchers are not allowed to redeem for current cart.',
}));

const invalidDay = (days) => Boom.badRequest(JSON.stringify({
    error: 'DaysRuleViolated',
    error_description: `Voucher can be redeemed only on following days: ${days.join(',')}.`,
}));
const voucherNotActive = ({ status, code }) => Boom.badRequest(JSON.stringify({
    error: 'voucherNotActive',
    error_description: `Voucher code ${code} status is ${status}`,
}));

const customerRulesViolated = (customerEmail, voucherCode) => Boom.badRequest(JSON.stringify({
    error: 'CustomerRulesViolated',
    error_description: `Voucher: ${voucherCode} is not valid for customer: ${customerEmail}`,
}));

const voucherUsageLimitExeeded = () => Boom.badRequest(JSON.stringify({
    error: 'voucherUsageLimitExeeded',
    error_description: 'Voucher is already consumed',
}));

const itemsSubTotalRulesViolated = () => Boom.badRequest(JSON.stringify({
    error: 'itemsSubTotalRulesViolated',
    error_description: 'Items subtotal is below 50',
}));
const itemRulesVoilated = () => Boom.badRequest(JSON.stringify({
    error: 'itemRulesVoilated',
    error_description: 'Items are not in correct category',
}));
const orderIdExisted = (id) => Boom.badRequest(JSON.stringify({
    error: 'OrderIdAlreadyExisted',
    error_description: `Order already found with id ${id}`,
}));
module.exports = {
    voucherCodeGenerationError,
    dbSchemaValidationError,
    customerAlreadyExist,
    customerNotFound,
    ruleNotFound,
    noValidCampaignServiceExist,
    multipleVouchersNotAllowedToRedeem,
    invalidDateRange,
    invalidDay,
    voucherNotFound,
    voucherNotActive,
    customerRulesViolated,
    voucherUsageLimitExeeded,
    itemsSubTotalRulesViolated,
    itemRulesVoilated,
    orderIdExisted,
};
