const Joi = require('joi');
const Constants = require('../constants');
const Utility = require('../utilities/index');

const ruleConditionParams = Joi.object({
    fact: Joi.string().required(),
    path: Joi.string(),
    operator: Joi.string().required(),
    value: Joi.any().custom(Utility.convertToBoolean), // Convert to boolean as hapijs changing native values coming from payload to 'string'.
    params: Joi.object({
        value: Joi.string(),
        error: Joi.object({
            code: Joi.string().required(),
            message: Joi.string().required(),
        }),
    }),
});

const ruleConditions = Joi.object({
    all: Joi.array().items(ruleConditionParams),
});

const ruleExpressionModel = Joi.object({
    name: Joi.string().required(),
    errors: Joi.object(),
    conditions: ruleConditions,
    event: Joi.object({
        type: Joi.string().valid(...Object.values(Constants.RULE_EXPRESSION)).required(),
        params: Joi.object({
            message: Joi.string(),
        }),
    }),
});

module.exports = {
    ruleConditionParams,
    ruleConditions,
    ruleExpressionModel,
};
