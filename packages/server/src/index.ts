import ssl from './config/ssl';
import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
import socketServer from '@tunji-web/server/src/sockets/socket';
import mongooseConnection from '@tunji-web/server/src/config/Mongoose';
import express from '@tunji-web/server/src/config/express';
import passportConfiguration from '@tunji-web/server/src/config/passportConfiguraton';
import { SocketIOAdapter } from '@tunji-web/server/src/models/SocketIOAdapterSchema';
import recordChangeLists from '@tunji-web/server/src/config/changeLists';

mongooseConnection().then(async (connection) => {
    const expressServer = express(connection);
    passportConfiguration();
    await recordChangeLists();
    expressServer.set('port', 8080);

    const useTls = process.env.USE_TLS !== 'false';
    const server = useTls
        ? createHttpsServer(ssl.options, expressServer)
        : createHttpServer(expressServer);

    // Should be a microservice
    SocketIOAdapter.createCollection()
        .then(collection => {
            socketServer(
                server,
                collection,
            );
        });

    server.listen(expressServer.get('port'));
    server.on('listening', () => console.log('Server listening on ' + expressServer.get('port') + ' in ' + expressServer.get('env') + ' mode.'));
    server.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const port = expressServer.get('port');
        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
});
