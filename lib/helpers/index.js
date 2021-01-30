
const Helpers = require('require-dir')(null, { camelcase: true });

exports.register = (server) => {
    server.decorate('server', 'helpers', Helpers);
    server.decorate('request', 'helpers', Helpers);
    // server.decorate('toolkit', 'helpers', Helpers);
};

exports.pkg = {
    name: 'helpers',
};
