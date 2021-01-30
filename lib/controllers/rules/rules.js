// const ErrorUtility = require('../../utilities/error');

const createRuleExpression = async (request) => {
    const { formatter } = request.helpers;
    const ruleInfo = request.payload;
    const { ruleExpressionService } = request.services();
    const result = await ruleExpressionService.create({ ruleInfo });
    return formatter.prepareResponse({
        success: true,
        data: result,
    });
};

const getRuleExpression = async (request) => {
    const { formatter } = request.helpers;
    const { ruleExpressionService } = request.services();
    const { id } = request.params;
    const rule = await ruleExpressionService.findRule({ id });
    return formatter.prepareResponse({ success: true, data: rule });
};

module.exports = {
    createRuleExpression,
    getRuleExpression,
};
