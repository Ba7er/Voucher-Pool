const Schemrvice = require('schmervice');
const { CosmosClient } = require('@azure/cosmos');

module.exports = class CosmosService extends Schemrvice.Service {
    constructor(server, options) {
        super(server, options);
        const { cosmosDB } = options;
        this.databaseId = cosmosDB.databaseId;
        this.client = new CosmosClient({
            endpoint: cosmosDB.endpoint,
            key: cosmosDB.key,
        });
    }

    async container({ containerId }) {
        const { container } = await this.client
            .database(this.databaseId)
            .containers.createIfNotExists({ id: containerId });
        return container;
    }

    async query({ containerId, querySpec }) {
        const { resources } = await this.client
            .database(this.databaseId)
            .container(containerId)
            .items.query(querySpec)
            .fetchAll();
        return resources;
    }

    async create({ containerId, itemBody }) {
        const { item } = await this.client
            .database(this.databaseId)
            .container(containerId)
            .items.create(itemBody);
        const { resource } = await item.read();

        return resource;
    }

    async replace({ containerId, itemBody, partitionKeyValue }) {
        const { resource } = await this.client
            .database(this.databaseId)
            .container(containerId)
            .item(itemBody.id, partitionKeyValue)
            .replace(itemBody, { accessCondition: { type: 'IfMatch', condition: itemBody._etag } });

        return resource;
    }
};
