const Controller = require('../../../controllers/rules/rules');
const Schemas = require('../../../validators');
const { requestValidationFailAction: failAction } = require('../../../utilities/index');

module.exports = [
    {
        method: 'POST',
        path: '/validation-rules',
        options: {
            id: 'create-validation-rules',
            description: 'Create Rule Expression',
            tags: ['rules', 'api'],
            auth: false,
            validate: {
                payload: Schemas.ruleExpressionModel,
                failAction,
            },
            handler: Controller.createRuleExpression,
        },
    },
];
