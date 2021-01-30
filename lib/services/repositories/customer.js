const BaseRepository = require('./base-repository');
const CustomerModel = require('../../db-models/customer');

module.exports = class CustomerRepository extends BaseRepository {
    async create(customerInfo) {
        const { cosmosORMService } = this.server.services();
        const result = await cosmosORMService.create({ model: CustomerModel, itemBody: customerInfo });
        return result;
    }

    async findByFields(params) {
        params.model = CustomerModel;
        return super.findByFields(params);
    }
};
