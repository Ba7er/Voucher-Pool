
const Confidence = require('confidence');
const Config = require('../lib/config');

module.exports = new Confidence.Store({
    server: {
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 3001,
    },
    register: {
        plugins: [
            {
                plugin: '../lib', // Main plugin
                options: {
                    ...Config,
                },
            },
        ],
    },
});
