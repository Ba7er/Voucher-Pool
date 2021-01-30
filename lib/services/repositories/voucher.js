const BaseRepository = require('./base-repository');
const VoucherModel = require('../../db-models/voucher');

module.exports = class VoucherRepository extends BaseRepository {
    async findByFields(params) {
        params.model = VoucherModel;
        return super.findByFields(params);
    }

    async create(voucherInfo) {
        const { cosmosORMService } = this.server.services();
        const result = await cosmosORMService.create({ model: VoucherModel, itemBody: voucherInfo });
        return result;
    }

    async update({ campaingInfo, updates }) {
        const { cosmosORMService } = this.server.services();
        const updatedItem = await cosmosORMService.replace({ model: VoucherModel, itemBody: campaingInfo, updates });
        return updatedItem;
    }
};
