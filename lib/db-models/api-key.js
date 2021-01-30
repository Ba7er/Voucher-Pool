const Joi = require('joi');
const BaseModel = require('./base-model');
const Config = require('../config');

module.exports = class ApiKeyModel extends BaseModel {
    static collectionName() {
        return Config.cosmosDB.containers.apiKeys;
    }

    static idField() {
        return 'id';
    }

    static partitionKeyField() {
        return 'name';
    }

    static uniqueConstraintFields() {
        return [
            ['/name'],
            ['/key'],
        ];
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

    static joiSchema() {
        return Joi.object({
            id: Joi.string(),
            name: Joi.string().required(),
            key: Joi.string().required(),
            countries: Joi.array().items(Joi.string()).required(),
            scopes: Joi.array().items(Joi.string()).required(),
            createdAt: Joi.date().iso(),
            updatedAt: Joi.date().iso(),
            deletedAt: Joi.date().iso(),
            expiredAt: Joi.date().iso(),
        }).unknown();
    }
};
