const BaseRepository = require('./base-repository');
const { RuleExpresionModel } = require('../../db-models');

module.exports = class RuleExpressionRepository extends BaseRepository {
    async findByFields(params) {
        params.model = RuleExpresionModel;
        return super.findByFields(params);
    }

    async create(ruleInfo) {
        const { cosmosORMService } = this.server.services();
        const result = await cosmosORMService.create({ model: RuleExpresionModel, itemBody: ruleInfo });
        return result;
    }
};
