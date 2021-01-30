const Schemrvice = require('schmervice');
const ErrorUtility = require('../utilities/error');

module.exports = class RuleExpressionService extends Schemrvice.Service {
    async create({ ruleInfo }) {
        const { ruleExpressionRepository } = this.server.services();
        return ruleExpressionRepository.create(ruleInfo);
    }

    async findRule({
        id, skipSoftDelete,
    }) {
        const { ruleExpressionRepository } = this.server.services();
        const [rule] = await ruleExpressionRepository.findByFields({
            id, skipSoftDelete,
        });

        if (!rule) {
            throw ErrorUtility.ruleNotFound(id);
        }

        return rule;
    }
};
