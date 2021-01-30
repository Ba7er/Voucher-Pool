
module.exports = {
    name: 'promotion voucher',
    startDate: '2021-01-20T12:46:04Z',
    endDate: '2021-10-22T12:46:05Z',
    days: [],
    status: 'active',
    customerEmail: null,
    codeConfig: {
        prefix: 'PROMO-',
        postfix: '-TR',
        pattern: '#####',
    },
    numberOfVouchers: 1,
    numberOfUsagePerCustomer: 1,
    numberOfUsage: 1,
    ruleExpressionId: null, // Rul expression ID value will be assigned while generating the coupon
    type: 'DISCOUNT_VOUCHER',
    discount: {
        type: 'PERCENTAGE',
        value: 10,
        maxAmount: 50,
    },
};
