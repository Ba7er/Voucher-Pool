
const Toys = require('toys');

module.exports = Toys.onPreResponse((request, h) => {
    const { response } = request;

    if (!response.isBoom) {
        return h.continue;
    }
    const { formatter } = request.helpers;

    const { responseBody, responseCode } = formatter.handleError({ err: response });
    response.output.payload = responseBody;
    response.output.statusCode = responseCode;
    return h.continue;
}, {
    sandbox: 'plugin',
});
