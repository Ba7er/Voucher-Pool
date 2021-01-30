
const Joi = require('joi');
const Config = require('../config/index');
const Constants = require('../constants');
const BaseModel = require('./base-model');

module.exports = class RuleExpresion extends BaseModel {
    static collectionName() {
        return Config.cosmosDB.containers.ruleExpressions;
    }

    static idField() {
        return 'id';
    }

    static partitionKeyField() {
        return 'id';
    }

    static isAutoCreationTimestamp() {
        return true;
    }

    static isAutoUpdationTimestamp() {
        return true;
    }

    static softDelete() {
        return true;
    }

    static objectName() {
        return Constants.OBJECTS.RULE_EXPRESSION;
    }

    static joiSchema() {
        return Joi.object({
            id: Joi.string(),
            name: Joi.string().required(),
            errors: Joi.object(),
            conditions: Joi.object({
                all: Joi.array().items(
                    Joi.object({
                        fact: Joi.string(),
                        path: Joi.string(),
                        operator: Joi.string(),
                        value: Joi.any(),
                        params: Joi.object({
                            value: Joi.string(),
                            error: Joi.object({
                                code: Joi.string().required(),
                                message: Joi.string().required(),
                            }),
                        }),
                    }),
                ),
            }),
            event: Joi.object({
                type: Joi.string().valid(...Object.values(Constants.RULE_EXPRESSION)).required(),
                params: Joi.object({
                    message: Joi.string(),
                }),
            }),
            createdAt: Joi.date().iso(),
            updatedAt: Joi.date().iso(),
        }).unknown();
    }
};
