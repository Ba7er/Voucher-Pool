const { Service } = require('schmervice');

module.exports = class BaseRepository extends Service {
    async findByFields({ model, skipSoftDelete = false, ...fields }) {
        const { cosmosORMService } = this.server.services();
        return cosmosORMService.queryByFields({
            model,
            whereProps: fields,
            skipSoftDelete,
        });
    }
};
