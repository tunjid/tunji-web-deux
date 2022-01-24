import ssl from './config/ssl';
import { createServer } from 'https';
import socketServer from '@tunji-web/server/src/sockets/socket';
import mongooseConnection from '@tunji-web/server/src/config/Mongoose';
import express from '@tunji-web/server/src/config/express';
import passportConfiguration from '@tunji-web/server/src/config/passportConfiguraton';
import { SocketIOAdapter } from '@tunji-web/server/src/models/SocketIOAdapterSchema';

mongooseConnection().then((connection) => {
    const expressServer = express(connection);
    passportConfiguration();
    expressServer.set('port', 8080);

    const httpsServer = createServer(ssl.options, expressServer);

    SocketIOAdapter.createCollection()
        .then(collection => {
            socketServer(
                httpsServer,
                collection,
            );
        });

    httpsServer.listen(expressServer.get('port'));
    httpsServer.on('listening', () => console.log('Server listening on ' + expressServer.get('port') + ' in ' + expressServer.get('env') + ' mode.'));
    httpsServer.on('error', (error) => {
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
