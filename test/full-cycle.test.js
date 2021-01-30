// Load env variables.
require('dotenv').config();
// Load modules
const Faker = require('faker');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { init } = require('../server');
const Utility = require('../lib/utilities');
const voucherPayload = require('./voucherPayload');
const ruleExpressionPayload = require('./rule-expression-payload');
const validationPayload = require('./validation-payoad');

// Variables to used across the test cases
let RuleExpressionId;
let voucherCode;
let voucherId;
let orderID;
const fakeCustomerEmail = Faker.internet.email();
const customerName = Faker.name.findName();
const {
    describe, it, beforeEach, afterEach,
} = (exports.lab = Lab.script());
const { expect } = Code;

describe('Full cycle test Create Customer - Generate voucher - Validate - Redeem', () => {
    let server;
    beforeEach(async () => {
        server = await init();
    });
    afterEach(async () => {
        await server.stop();
    });

    it('Should create customer to be linked to a voucher ', { timeout: 5000, retry: 1 }, async () => {
        const injectOpt = {
            method: 'POST',
            url: '/customers',
            payload: {
                name: customerName,
                email: fakeCustomerEmail,
            },
        };
        const res = await server.inject(injectOpt);
        expect(res.statusCode).to.equal(200);
    });

    it('Should generate a rule expression doc', { timeout: 5000, retry: 1 }, async () => {
        const injectOpt = {
            method: 'POST',
            url: '/validation-rules',
            payload: ruleExpressionPayload,
        };
        const res = await server.inject(injectOpt);
        expect(res.statusCode).to.equal(200);

        const {
            id, name, conditions, event, object,
        } = res.result.data;
        expect(name).to.be.string();
        expect(conditions).to.be.an.object();
        expect(event).to.be.object();
        expect(object).to.be.string();

        // assign the generate rule expression id to be used in voucher generation test
        RuleExpressionId = id;
    });

    it('Should Generate a voucher for a customer', { timeout: 5000, retry: 1 }, async () => {
        voucherPayload.ruleExpressionId = RuleExpressionId;
        voucherPayload.customerEmail = fakeCustomerEmail;
        const injectOpt = {
            method: 'POST',
            url: '/vouchers',
            payload: voucherPayload,
        };
        const res = await server.inject(injectOpt);
        expect(res.statusCode).to.equal(200);
        const {
            id, code, object, status, type,
        } = res.result.data;
        expect(code).to.be.string();
        expect(object).to.be.string().equal('voucher');
        expect(status).to.be.string().equal('active');
        expect(type).to.be.string().equal('DISCOUNT_VOUCHER');

        // assigning voucher code to be used in next test
        voucherCode = code;
        voucherId = id;
    });

    it('Should validate the voucher sent in the cart', { timeout: 5000, retry: 1 }, async () => {
        orderID = Utility.generateUUID();
        validationPayload.campaigns[0].code = voucherCode;
        validationPayload.campaigns[0].id = voucherId;
        validationPayload.order.orderId = orderID;
        validationPayload.order.customer.email = fakeCustomerEmail;
        const injectOpt = {
            method: 'POST',
            url: '/campaigns/validation',
            payload: validationPayload,
        };
        const res = await server.inject(injectOpt);
        expect(res.statusCode).to.equal(200);
        const {
            order, discount, subtotal,
        } = res.result.data;
        const { orderId } = order;
        const {
            code, customerEmail, totalDiscountAmount, message,
        } = discount;
        expect(orderId).to.be.string().equal(orderID);
        expect(discount).to.be.an.object();
        expect(code).to.be.string().equal(voucherCode);
        expect(customerEmail).to.be.string();
        expect(totalDiscountAmount).to.a.number().equal(5); // @TODO testin total discount amount should be done dynamically not by hardcoding the value
        expect(subtotal).to.be.a.number().equal(validationPayload.order.subtotal);
        expect(message).to.be.a.string().equal('Voucher %s applied successfully!');
    });

    it('Should Redeem the voucher sent in the cart', { timeout: 5000, retry: 1 }, async () => {
        validationPayload.campaigns[0].code = voucherCode;
        validationPayload.campaigns[0].id = voucherId;
        validationPayload.order.orderId = orderID;
        const injectOpt = {
            method: 'POST',
            url: '/campaign/redemption',
            payload: validationPayload,
        };
        const res = await server.inject(injectOpt);
        expect(res.statusCode).to.equal(200);
        const {
            discount, object, status,
        } = res.result.data;

        const {
            code, subtotal,
        } = discount;
        expect(discount).to.be.an.object();
        expect(code).to.be.string().equal(voucherCode);
        expect(object).to.be.a.string().equal('redemption');
        expect(subtotal).to.be.a.number().equal(50);
        expect(status).to.be.string('REDEEM_SUCCESS');
    });

    it('Should retive available vouchers based on filters', { timeout: 5000, retry: 1 }, async () => {
        const injectOpt = {
            method: 'GET',
            url: `/customers/${fakeCustomerEmail}?status=completed`,
        };
        const res = await server.inject(injectOpt);
        expect(res.statusCode).to.equal(200);
        const vouchers = res.result.data;
        vouchers.forEach((voucher) => {
            const { status, type, redemption } = voucher;
            expect(type).to.be.a.string().equal('DISCOUNT_VOUCHER');
            expect(status).to.be.string('completed');
            expect(redemption).to.be.an.object();
            if (redemption) {
                const { redeemedCount, redeemedAmount, redemptionIds } = redemption;
                expect(redeemedCount).to.be.a.number();
                expect(redeemedAmount).to.be.a.number();
                expect(redemptionIds).to.be.an.array();
            }
        });
    });
});
