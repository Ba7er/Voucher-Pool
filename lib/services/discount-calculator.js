const Schemrvice = require('schmervice');
const Constants = require('../constants');

module.exports = class DiscountCalculatorService extends Schemrvice.Service {
    calculateDiscount({ discount, subtotal }) {
        let discountAmount = 0;
        subtotal = Math.max(subtotal, 0);
        const { type, value, maxAmount } = discount;
        if (type === Constants.VOUCHER.DISCOUNT.PERCENTAGE) {
            const percentageDiscount = (subtotal * value) / 100;
            discountAmount = parseFloat((percentageDiscount).toFixed(Constants.DEFAULT_PRECISION));
            if (maxAmount) {
                discountAmount = Math.min(discountAmount, maxAmount);
            }
        }

        if (discount.type === Constants.VOUCHER.DISCOUNT.FIXED) {
            discountAmount = Math.min(subtotal, value);
        }

        return discountAmount;
    }
};
