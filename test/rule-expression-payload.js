module.exports = {
    name: 'Promotion Voucher Main',
    conditions: {
        all: [
            {
                fact: 'category',
                operator: 'equal',
                value: 'F&B',
                params: {
                    value: 'F&B',
                    error: {
                        code: 'itemRulesVoilated',
                        message: 'Items are not in correct category',
                    },
                },
            },
            {
                fact: 'totalItem',
                operator: 'equal',
                value: 50,
                params: {
                    value: 'F&B',
                    error: {
                        code: 'itemsSubTotalRulesViolated',
                        message: 'Items subtotal is below 50',
                    },
                },
            },
        ],
    },
    event: {
        type: 'addDiscount',
        params: {
            message: 'Voucher %s applied successfully!',
        },
    },
};
