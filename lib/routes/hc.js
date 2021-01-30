const Package = require('../../package.json');

const { name, version, description } = Package;

module.exports = () => [
    {
        method: 'GET',
        path: '/hc',
        options: {
            id: 'hc',
            description: 'Health Check',
            auth: false,
            handler: () => ({
                success: true,
                name,
                version,
                description,
            }),
        },
    },
];
