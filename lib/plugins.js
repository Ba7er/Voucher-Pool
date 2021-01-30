const schmervice = require('schmervice');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const helpers = require('./helpers');

module.exports = {
    plugins: [
        {
            plugin: schmervice,
        },
        {
            plugin: helpers,
        },
        {
            plugin: Inert,
        },
        {
            plugin: Vision,
        },
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Voucher Pool API Documentation',
                    version: '1.0',
                },
                sortEndpoints: 'ordered',
                grouping: 'tags',
            },
        },
    ],
};

