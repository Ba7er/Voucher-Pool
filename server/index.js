
const Glue = require('@hapi/glue');
const Manifest = require('./manifest');

exports.init = async () => {
    const manifest = Manifest.get('/');
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    await server.initialize();
    return server;
};

exports.deployment = async (start) => {
    const server = await exports.init();
    if (!start) {
        return server;
    }

    await server.start();

    server.log(`Server started at ${server.info.uri}`);

    return server;
};

if (!module.parent) {
    exports.deployment(true);

    process.on('unhandledRejection', (err) => {
        throw err;
    });
}
