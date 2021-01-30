const Schemrvice = require('schmervice');
const moment = require('moment');
const Utility = require('../utilities/index');
const ErrorUtility = require('../utilities/error');
const Constants = require('../constants');

module.exports = class VoucherService extends Schemrvice.Service {
    async create({ customerEmail, ruleExpressionId, voucherInfo }) {
        const { voucherRepository, ruleExpressionService, customerService } = this.server.services();
        if (customerEmail) {
            const customer = await customerService.findByEmail({ email: customerEmail });
            if (!customer) {
                throw ErrorUtility.customerNotFound(customerEmail);
            }
            voucherInfo.customerEmail = customerEmail;
        }

        const {
            id, object, name, conditions, event,
        } = await ruleExpressionService.findRule({ id: ruleExpressionId });
        voucherInfo.ruleExpression = {
            id, object, name, conditions, event,
        };
        const { codeConfig } = voucherInfo;
        const [code] = Utility.generateCodeByCodeConfig({ ...codeConfig });
        if (!code) {
            throw ErrorUtility.voucherCodeGenerationError(codeConfig);
        }
        voucherInfo.code = code.toUpperCase();
        const result = voucherRepository.create({ ...voucherInfo });
        return result;
    }

    async findVoucher({
        id, code, skipSoftDelete, status = undefined,
    }) {
        const { voucherRepository } = this.server.services();
        const [voucher] = await voucherRepository.findByFields({
            id, code, skipSoftDelete, status,
        });

        if (!voucher) {
            throw ErrorUtility.voucherNotFound(id || code);
        }

        return voucher;
    }

    async searchVoucher({
        code, skipSoftDelete, status = undefined, customerEmail,
    }) {
        const { voucherRepository } = this.server.services();
        const voucher = await voucherRepository.findByFields({
            code, skipSoftDelete, status, customerEmail,
        });

        if (!voucher) {
            throw ErrorUtility.voucherNotFound(code);
        }
        return voucher;
    }

    async update({ campaingInfo, updates }) {
        const { voucherRepository } = this.server.services();
        return voucherRepository.update({ campaingInfo, updates });
    }

    async validate({ campaign, customer }) {
        const { code } = campaign;
        const voucher = await this.findVoucher({ code });

        const {
            startDate, endDate, status, customerEmail, numberOfUsage, redemption, days,
        } = voucher;

        const date = new Date();

        // start and end date
        const isValidDateRange = moment(date).isBetween(startDate, endDate);
        if (!isValidDateRange) {
            throw ErrorUtility.invalidDateRange(startDate, endDate, code);
        }

        // If voucher has "days" as criteria
        if (days && days.length > 0) {
            const isValidDay = Utility.isApplicableWeekDay(days, date.getDay());
            if (!isValidDay) {
                throw ErrorUtility.invalidDay(days);
            }
        }

        // status = active
        if (status !== Constants.VOUCHER.STATUS.ACTIVE) {
            throw ErrorUtility.voucherNotActive({ status, code });
        }

        // if it is personalized voucher then allow for specific user only.
        if (customerEmail && customerEmail !== customer.email) {
            throw ErrorUtility.customerRulesViolated(customer.email, code);
        }

        // number of usage
        if (numberOfUsage && redemption && redemption.redeemedCount >= numberOfUsage) {
            throw ErrorUtility.voucherUsageLimitExeeded();
        }

        return voucher;
    }
};
