const Schemrvice = require('schmervice');
const { mapCustomerVoucher } = require('../mappers/response/customer-voucher');

module.exports = class CustomerService extends Schemrvice.Service {
    async create({ customerInfo }) {
        const { customerRepository } = this.server.services();
        const result = await customerRepository.create({ ...customerInfo });
        return result;
    }

    async findByEmail({ email }) {
        const { customerRepository } = this.server.services();
        const [result] = await customerRepository.findByFields({ email });
        return result;
    }

    async findVouchers({ email, voucher, status }) {
        const { voucherService } = this.server.services();
        const result = await voucherService.searchVoucher({ customerEmail: email, code: voucher, status });
        const mappedVoucherList = mapCustomerVoucher(result);
        return mappedVoucherList;
    }
};
