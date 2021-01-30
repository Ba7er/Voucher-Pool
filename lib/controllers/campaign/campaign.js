const validate = async (request) => {
    // helpers and serices
    const { formatter } = request.helpers;
    const { campaignService } = request.services();
    const { order, campaigns } = request.payload;
    const {
        customer, orderId, subtotal,
    } = order;

    const {
        campaingInfo, totalDiscountAmount,
    } = await campaignService.processCampaigns({
        order, campaigns, customer,
    });
    const {
        ruleExpression, object, code, customerEmail, name,
    } = campaingInfo;
    const { event } = ruleExpression;
    const { params: message } = event;

    // Build review object and return it as a response
    const reviewObj = {};
    reviewObj.order = { orderId, customer };
    reviewObj.discount = {
        code, customerEmail, object, name, totalDiscountAmount, ...message,
    };
    reviewObj.subtotal = subtotal;
    reviewObj.totalDiscountAmount = totalDiscountAmount;

    return formatter.prepareResponse({
        success: true,
        data: { ...reviewObj },
    });
};

module.exports = {
    validate,
};
