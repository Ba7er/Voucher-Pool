
const Joi = require('joi');
const Config = require('../config');
const Constants = require('../constants');
const BaseModel = require('./base-model');

module.exports = class Voucher extends BaseModel {
    static collectionName() {
        return Config.cosmosDB.containers.customers;
    }

    static idField() {
        return 'id';
    }

    static partitionKeyField() {
        return 'email';
    }

    static uniqueConstraintFields() {
        return [
            ['/email'],
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

    static objectName() {
        return Constants.OBJECTS.CUSTOMER;
    }

    static joiSchema() {
        return Joi.object({
            id: Joi.string(),
            object: Joi.string().required().valid(Constants.OBJECTS.CUSTOMER),
            name: Joi.string().required(),
            email: Joi.string().trim().lowercase().regex(Config.app.emailRegex),

        }).unknown();
    }
};
