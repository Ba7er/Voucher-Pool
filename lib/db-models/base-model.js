const ErrorUtility = require('../utilities/error');
const Constants = require('../constants');
const Utiltity = require('../utilities');

module.exports = class DBModel {
    static async schemaValidate(obj) {
        try {
            const schema = this.joiSchema();
            return await schema.validateAsync(obj);
        } catch (err) {
            throw ErrorUtility.dbSchemaValidationError(err.message);
        }
    }

    static isAutoCreationTimestamp() {
        return true;
    }

    static isAutoUpdationTimestamp() {
        return false;
    }

    static createdAtAttribute() {
        return 'createdAt';
    }

    static updatedAtAttribute() {
        return 'updatedAt';
    }

    static softDeleteAttribute() {
        return 'deletedAt';
    }

    static softDelete() {
        return false;
    }

    static subSchema() {

    }

    static autoTimeStamp(itemBody) {
        this.autoCreationTimestamp(itemBody);
        this.autoUpdationTimestamp(itemBody);
        const subSchema = this.subSchema();
        if (subSchema) {
            const keys = Object.keys(subSchema);
            keys.forEach((key) => {
                const subItemBody = itemBody[key];
                const subModel = subSchema[key];
                if (Array.isArray(subItemBody)) {
                    subItemBody.forEach((subItem) => {
                        subModel.autoCreationTimestamp(subItem);
                        subModel.autoUpdationTimestamp(subItem);
                    });
                } else if (subItemBody) {
                    subModel.autoCreationTimestamp(subItemBody);
                    subModel.autoUpdationTimestamp(subItemBody);
                }
            });
        }
    }

    static autoCreationTimestamp(itemBody) {
        const isEnabled = this.isAutoCreationTimestamp();
        if (isEnabled && !itemBody[this.createdAtAttribute()]) {
            itemBody[this.createdAtAttribute()] = new Date().toISOString();
        }
    }

    static autoUpdationTimestamp(itemBody) {
        const isEnabled = this.isAutoUpdationTimestamp();
        if (isEnabled) {
            itemBody[this.updatedAtAttribute()] = new Date().toISOString();
        }
    }

    static softDeleteTimeStamp(itemBody) {
        const softDeleteAttribute = this.softDeleteAttribute();
        itemBody[softDeleteAttribute] = new Date().toISOString();
    }

    static setObjectName(itemBody) {
        const objectName = this.objectName();
        itemBody[Constants.DB_ATTRIBUTES.OBJECT] = objectName;
    }

    static setId(itemBody) {
        itemBody.id = Utiltity.generateUUID();
    }
};
