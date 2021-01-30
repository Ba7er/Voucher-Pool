const BaseRepository = require('./base-repository');
const { RedemptionModel } = require('../../db-models');

module.exports = class RedemptionRepository extends BaseRepository {
    async findRedemptionByOrderId({ orderId }) {
        const { cosmosORMService } = this.server.services();
        const querySpec = {
            query: 'SELECT * FROM  c where c["order"]["orderId"] = @orderId',
            parameters: [
                {
                    name: '@orderId',
                    value: orderId,
                },
            ],
        };
        return cosmosORMService.query({
            model: RedemptionModel,
            querySpec,
        });
    }

    async create(redemptionObj) {
        const { cosmosORMService } = this.server.services();
        const result = await cosmosORMService.create({
            model: RedemptionModel,
            itemBody: redemptionObj,
        });
        return result;
    }
};
