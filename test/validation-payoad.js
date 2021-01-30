module.exports = {
    order: {
        orderId: null, // To be gemnerated while running the test
        createdAt: '2021-01-26',
        customer: {
            email: null,
            metaData: {},
        },
        isCustomerFirstOrder: true,
        items: [
            {
                itemId: '424441',
                name: 'coca cola',
                sku: 'string',
                unitPrice: 2.5,
                specialPrice: 2,
                isScalableProduct: false,
                quantity: 10,
                category: 'F&B',
                brand: 'SODA',
            },
            {
                itemId: '424442',
                name: 'pepse',
                sku: 'string',
                unitPrice: 5,
                specialPrice: 3,
                isScalableProduct: false,
                quantity: 5,
                category: 'F&B',
                brand: 'SODA',
            },
        ],
        subtotal: 50,
        payment: {
            method: 'COD',
            bin: '232651',
        },
    },
    campaigns: [
        {
            object: 'voucher',
            code: null, // voucher code  value will be assigned while validation endpoint
            id: null, // voucher id  value will be assigned while validation endpoint
        },
    ],
};
