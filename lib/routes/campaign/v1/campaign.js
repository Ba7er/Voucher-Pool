const Controller = require('../../../controllers/campaign/campaign');
const Schemas = require('../../../validators');
const { requestValidationFailAction: failAction } = require('../../../utilities');

module.exports = [
    {
        method: 'POST',
        path: '/campaigns/validation',
        options: {
            id: 'cart validation',
            description: 'to validate the cart details against the voucher pool ',
            tags: ['campaign', 'api'],
            auth: false,
            validate: {
                payload: Schemas.cartValidationPayload,
                failAction,
            },
            handler: Controller.validate,
        },

    },
];
