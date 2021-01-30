const createRedemption = async (request) => {
    // helpers and serices
    const { formatter } = request.helpers;
    const { campaignService, redemptionService } = request.services();
    const { order, campaigns } = request.payload;
    const {
        customer, orderId, subtotal,
    } = order;

    const {
        campaingInfo, totalDiscountAmount,
    } = await campaignService.processCampaigns({
        order, campaigns, customer,
    });

    const result = await redemptionService.redeem({
        campaingInfo, order, totalDiscountAmount,
    });

    return formatter.prepareResponse({
        success: true,
        data: result,
    });
};

module.exports = {
    createRedemption,
};
