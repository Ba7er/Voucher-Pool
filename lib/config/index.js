module.exports = {
    cosmosDB: {
        endpoint: process.env.COSMOS_DB_ENDPOINT,
        key: process.env.COSMOS_DB_KEY,
        databaseId: process.env.COSMOS_DB_DATABASEID,
        containers: {
            vouchers: 'vouchers',
            customers: 'customers',
            ruleExpressions: 'ruleExpressions',
            redemptions: 'redemptions',
        },
    },
    app: {
        emailRegex: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/i,
        charSet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789',
    },
};
