
const createVoucher = async (request) => {
    const { formatter } = request.helpers;
    const { voucherService } = request.services();
    const { customerEmail, ruleExpressionId, ...voucherInfo } = request.payload;

    const result = await voucherService.create({ customerEmail, ruleExpressionId, voucherInfo });
    return formatter.prepareResponse({ success: true, data: result });
};

module.exports = {
    createVoucher,
};
