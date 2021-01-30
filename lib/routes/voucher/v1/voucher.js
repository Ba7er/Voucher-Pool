const Controller = require('../../../controllers/voucher/voucher');
const Schemas = require('../../../validators');
const { requestValidationFailAction: failAction } = require('../../../utilities/index');

module.exports = [
    {
        method: 'POST',
        path: '/vouchers',
        options: {
            id: 'create-voucher',
            description: 'Generate Voucher',
            tags: ['voucher', 'api'],
            auth: false,
            validate: {
                payload: Schemas.createVoucherRequestModel,
                failAction,
            },
            handler: Controller.createVoucher,
        },
    },

];
