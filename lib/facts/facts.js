module.exports = {
    category: {
        async handler(params, almanac) {
            const { items } = await almanac.factValue('orderDetails');
            const itemInCategory = items.filter((item) => item.category === params.value);
            if (itemInCategory.length > 0) {
                return params.value;
            }
            return false;
        },
    },
    totalItem: {
        async handler(params, almanac) {
            const { items } = await almanac.factValue('orderDetails');
            const categoryItems = items.filter((item) => item.category === params.value);
            let itemsSubTotal = 0;
            categoryItems.forEach((item) => {
                const itemTotal = item.unitPrice * item.quantity;
                itemsSubTotal += itemTotal;
            });
            return itemsSubTotal;
        },
    },
};

