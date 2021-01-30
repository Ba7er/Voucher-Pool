const mapCustomerVoucher = (voucherList) => {
    const mappedVoucher = voucherList.map((voucher) => {
        const {
            name, code, startDate, endDate, status, type, redemption,
        } = voucher;
        return {
            name, code, startDate, endDate, status, type, redemption,
        };
    });
    return mappedVoucher;
};

module.exports = {
    mapCustomerVoucher,
};
