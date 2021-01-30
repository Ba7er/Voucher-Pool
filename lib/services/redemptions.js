const Schemrvice = require('schmervice');
const Constants = require('../constants');
const Utility = require('../utilities');
const ErrorUtility = require('../utilities/error');

module.exports = class RedemptionService extends Schemrvice.Service {
    async findRedemptionByOrderId({ orderId }) {
        const { redemptionRepository } = this.server.services();
        const redemptions = await redemptionRepository.findRedemptionByOrderId({
            orderId,
        });
        return redemptions;
    }

    static prepareRedemptionObject({
        campaingInfo, order, totalDiscountAmount,
    }) {
        const { name, code } = campaingInfo;
        const { subtotal } = order;
        const redemptionObj = { order: { ...order } };
        redemptionObj.discount = {
            name, code, totalDiscountAmount, subtotal,
        };
        return redemptionObj;
    }

    async redeem({
        campaingInfo, order, totalDiscountAmount,
    }) {
        const {
            redemptionRepository,
            voucherService,
        } = this.server.services();
        const { customer, orderId } = order;
        const { email } = customer;
        // Fetch order, and throw error if already existes.
        const existedOrder = await this.findRedemptionByOrderId({ orderId });
        if (existedOrder.length > 0) {
            throw ErrorUtility.orderIdExisted(orderId);
        }

        const redemptionObj = RedemptionService.prepareRedemptionObject({
            campaingInfo, order, totalDiscountAmount,
        });
        // create redemption object
        const redemptionInfo = await redemptionRepository.create(redemptionObj);

        // Update voucher redemptions
        const { numberOfUsage } = campaingInfo;
        let { status } = campaingInfo;
        const redemption = campaingInfo.redemption || {};
        let redeemedCount = redemption.redeemedCount || 0;
        let redeemedAmount = redemption.redeemedAmount || 0;
        const redeemedBy = redemption.redeemedBy || [];
        let redeemedOn = redemption.redeemedOn || '';
        const redemptionIds = redemption.redemptionIds || [];

        redeemedCount += 1;
        redeemedAmount += totalDiscountAmount;
        redeemedBy.push(email);
        redeemedOn = Utility.currentDate();
        redemptionIds.push(redemptionInfo.id);

        if (redeemedCount === numberOfUsage) {
            status = Constants.VOUCHER.STATUS.COMPLETED;
        }
        await voucherService.update({
            campaingInfo,
            updates: {
                redemption: {
                    redeemedBy,
                    redeemedOn,
                    redeemedCount,
                    redeemedAmount,
                    redemptionIds,
                },
                status,
            },
        });
        return redemptionInfo;
    }
};
