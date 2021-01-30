const Controller = require('../../../controllers/redemption/redemption');
const Schemas = require('../../../validators');
const { requestValidationFailAction: failAction } = require('../../../utilities/index');

module.exports = [
    {
        method: 'POST',
        path: '/campaign/redemption',
        options: {
            id: 'create-redemption',
            description: 'Create campaign/voucher redemption document',
            tags: ['redemption', 'api'],
            auth: false,
            validate: {
                payload: Schemas.cartValidationPayload,
                failAction,
            },
            handler: Controller.createRedemption,
        },
    },

];
