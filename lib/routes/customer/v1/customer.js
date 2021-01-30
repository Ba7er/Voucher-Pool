const Controller = require('../../../controllers/customer/customer');
const Schemas = require('../../../validators');
const { requestValidationFailAction: failAction } = require('../../../utilities/index');

module.exports = [
    {
        method: 'POST',
        path: '/customers',
        options: {
            id: 'create-customer',
            description: 'Create Customer to be linked to a voucher',
            tags: ['customer', 'api'],
            auth: false,
            validate: {
                payload: Schemas.createCustomerRequestModel,
                failAction,
            },
            handler: Controller.createCustomer,
        },
    },
    {
        method: 'GET',
        path: '/customers/{email}',
        options: {
            id: 'get-customer-voucher',
            description: 'Get customers available vouchers',
            tags: ['customer', 'api'],
            auth: false,
            validate: {
                params: Schemas.getCustomerVouhcersRequestModel,
                query: Schemas.getCustomerVouhcersQueryModel,
                failAction,
            },
            handler: Controller.getCustomerVouchers,
        },
    },

];
