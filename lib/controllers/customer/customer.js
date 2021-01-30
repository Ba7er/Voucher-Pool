const ErrorUtility = require('../../utilities/error');

const createCustomer = async (request) => {
    const { formatter } = request.helpers;
    const { customerService } = request.services();
    const customerInfo = request.payload;

    const existedCustomer = await customerService.findByEmail({ email: customerInfo.email });
    if (existedCustomer) {
        throw ErrorUtility.customerAlreadyExist({ email: customerInfo.email });
    }
    const result = await customerService.create({ customerInfo });
    return formatter.prepareResponse({ success: true, data: result });
};

const getCustomerVouchers = async (request) => {
    const { formatter } = request.helpers;
    const { customerService } = request.services();
    const { email } = request.params;
    const { voucher, status } = request.query;
    const result = await customerService.findVouchers({ email, voucher, status });
    return formatter.prepareResponse({ success: true, data: result });
};

module.exports = {
    createCustomer,
    getCustomerVouchers,
};
