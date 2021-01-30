const vouhcer = require('./voucher');
const customer = require('./customer');

module.exports = {
    ...vouhcer,
    ...customer,
};
