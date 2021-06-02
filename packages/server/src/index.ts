import app from './app';
import ssl from './config/ssl';
import { createServer } from 'https';

const server = createServer(ssl.options, app);

server.listen(app.get('port'));
server.on('listening', () => console.log('Server listening on ' + app.get('port') + ' in ' + app.get('env') + ' mode.'));
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const port = app.get('port');
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
    }});

