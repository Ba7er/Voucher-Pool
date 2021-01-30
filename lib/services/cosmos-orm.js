const Hoek = require('@hapi/hoek');
const CosmosService = require('./cosmos');

module.exports = class CosmosORMService extends CosmosService {
    softDelete({ model, querySpec, skipSoftDelete }) {
        let isSoftDelete = model.softDelete();
        if (skipSoftDelete) {
            isSoftDelete = false;
        }
        if (isSoftDelete) {
            const softDeleteAttribute = model.softDeleteAttribute();
            querySpec.query += ` AND IS_DEFINED(c.${softDeleteAttribute}) = false`;
        }
    }

    async query({ model, querySpec, skipSoftDelete }) {
        const containerId = model.collectionName();
        // Soft delete logic
        this.softDelete({ model, querySpec, skipSoftDelete });
        return super.query({ containerId, querySpec });
    }

    async queryByFields({
        model, selectProps, whereProps, skipSoftDelete,
    }) {
        const selectPropsMerged = selectProps && selectProps.length ? selectProps.join(', ') : '*';
        let wherePropsMerged = '';
        const parameters = [];
        let query = `SELECT ${selectPropsMerged} FROM c`;
        if (whereProps) {
            let count = 0;
            Object.keys(whereProps).forEach((key) => {
                if (whereProps[key]) {
                    const val = whereProps[key];
                    let value = val;
                    let operator = '=';
                    let condition = 'AND';
                    if (typeof val === 'object') {
                        ({ value, operator, condition } = val);
                    }
                    if (count > 0) {
                        wherePropsMerged += condition;
                    }
                    wherePropsMerged += ` c.${key} ${operator} @${key} `;
                    parameters.push({
                        name: `@${key}`,
                        value,
                    });

                    count++;
                }
            });
            if (parameters.length) {
                query += ` WHERE ${wherePropsMerged}`;
            }
        }

        const querySpec = {
            query,
            parameters,
        };
        // Soft delete logic
        this.softDelete({ model, querySpec, skipSoftDelete });

        const containerId = model.collectionName();
        return super.query({ containerId, querySpec });
    }

    async create({ model, itemBody }) {
        const containerId = model.collectionName();
        if (!itemBody.object) {
            model.setObjectName(itemBody);
        }
        const validatedItem = await model.schemaValidate(itemBody);
        model.autoTimeStamp(itemBody);
        const result = await super.create({
            containerId,
            itemBody: validatedItem,
        });
        return result;
    }

    async replace({ model, itemBody, updates }) {
        if (updates) {
            itemBody = Hoek.merge(itemBody, updates);
        }
        const containerId = model.collectionName();
        await model.schemaValidate(itemBody);
        const partitionKeyValue = itemBody[model.partitionKeyField()];
        const result = await super.replace({
            containerId,
            itemBody,
            partitionKeyValue,
        });
        return result;
    }

    async delete({ model, itemBody }) {
        const containerId = model.collectionName();
        const partitionKeyValue = itemBody[model.partitionKeyField()];
        const payload = { itemBody };

        // Soft delete logic
        const isSoftDelete = model.softDelete();
        if (isSoftDelete) {
            model.softDeleteTimeStamp(itemBody);
            await model.schemaValidate(itemBody);
            payload.isSoftDelete = isSoftDelete;
        }

        const result = isSoftDelete ? await super.replace({ containerId, itemBody, partitionKeyValue }) : await super.delete({ containerId, id: itemBody.id, partitionKeyValue });
        return result;
    }
};
