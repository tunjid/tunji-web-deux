import app from './server/app';
import ssl from './server/config/ssl';
import https from 'https';

const server = https.createServer(ssl.options, app);

server.listen(app.get('port'));
server.on('listening', onListening);

function onListening() {
    console.log('Server listening on ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
}
