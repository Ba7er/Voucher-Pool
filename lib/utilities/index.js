const UUID = require('uuid');

const Boom = require('@hapi/boom');
const VoucherCodeGenerator = require('voucher-code-generator');

const requestValidationFailAction = async (request, h, err) => {
    throw Boom.badRequest(err.message, err);
};

const generateCodeByCodeConfig = ({
    prefix, postfix, pattern,
}) => VoucherCodeGenerator.generate({

    prefix,
    postfix,
    pattern,
});
const generateUUID = () => UUID.v4();

const convertToBoolean = (value) => {
    // Replace value with a new value
    if (value === 'true' && typeof (value) === 'string') {
        return true;
    }
    if (value === 'false' && typeof (value) === 'string') {
        return false;
    }
    // Return the value unchanged
    return value;
};
const currentDate = () => new Date();

const isApplicableWeekDay = (applicableDays, currentDayInt) => {
    const currentDay = Constants.DAYS[currentDayInt];
    return applicableDays.includes(currentDay);
};
module.exports = {
    requestValidationFailAction,
    generateCodeByCodeConfig,
    convertToBoolean,
    isApplicableWeekDay,
    currentDate,
    generateUUID,
};
