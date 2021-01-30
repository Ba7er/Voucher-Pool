const Schemrvice = require('schmervice');
const { Engine } = require('json-rules-engine');
const customFacts = require('../facts/facts');

module.exports = class EngineService extends Schemrvice.Service {
    async registerEvents(engine) {
        return new Promise((resolve) => {
            engine.on('success', async (event, almanac, ruleResult) => {
                resolve({
                    result: ruleResult.result,
                    event: ruleResult.event,
                });
            });

            engine.on('failure', async (event, almanac, ruleResult) => {
                const failedConditions = ruleResult.conditions.all.filter(
                    (condition) => !condition.result,
                );
                resolve({
                    result: ruleResult.result,
                    failedConditions,
                });
            });
        });
    }

    async evaluate({
        ruleExpression, facts,
    }) {
        const { order, customer } = facts;
        const orderDetails = order;
        const customerDetails = customer;
        const { conditions, event } = ruleExpression;
        const engine = new Engine([{ conditions, event }]);
        conditions.all.forEach((condition) => {
            engine.addFact(condition.fact, customFacts[`${condition.fact}`].handler);
        });
        engine.run({ orderDetails, customerDetails });
        const result = await this.registerEvents(engine);
        return result;
    }
};

