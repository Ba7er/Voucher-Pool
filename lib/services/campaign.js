const { Promise } = require('mongoose');
const Schemrvice = require('schmervice');
const Constants = require('../constants');
const ErrorUtility = require('../utilities/error');

module.exports = class CampaignService extends Schemrvice.Service {
    getCampaignService({ object }) {
        const { voucherService } = this.server.services();
        if (object === Constants.OBJECTS.VOUCHER) {
            return voucherService;
        }

        throw ErrorUtility.noValidCampaignServiceExist(object);
    }

    async processCampaign({ order, campaign, customer }) {
        const { engineService, discountCalculatorService } = this.server.services();
        const { object } = campaign;
        const campaignService = this.getCampaignService({ object });
        const campaingInfo = await campaignService.validate({ campaign, customer });
        const {
            ruleExpression, discount,
        } = campaingInfo;

        const facts = { customer, order };
        const { subtotal } = order;
        const { result: ruleEvaluationResult, failedConditions } = await engineService.evaluate({
            ruleExpression, facts,
        });
        if (!ruleEvaluationResult) {
            const { params: { error } } = failedConditions[0];
            const { code: errorCode, message: errorMessage } = error;
            throw ErrorUtility[`${errorCode}`](errorMessage);
        }
        const totalDiscountAmount = await discountCalculatorService.calculateDiscount({ subtotal, discount });
        return {
            campaingInfo, totalDiscountAmount,
        };
    }

    async processCampaigns({ order, campaigns, customer }) {
        const voucherCampaigns = campaigns.filter(
            (campaign) => campaign.object === Constants.OBJECTS.VOUCHER,
        );

        if (voucherCampaigns.length > 1) {
            throw ErrorUtility.multipleVoucherssNotAllowedToRedeem();
        }

        const discountPromises = [];
        campaigns.forEach((campaign) => {
            discountPromises.push(this.processCampaign({
                order, campaign, customer,
            }));
        });
        const [processedDiscounts] = await Promise.all(discountPromises);
        return processedDiscounts;
    }
};

