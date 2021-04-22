const app = require('./server/app');
const ssl = require('./server/config/ssl');
const socket = require('./server/config/socket');

const server = require('https').createServer(ssl.options, app);

socket(server);

server.listen(app.get('port'));
server.on('listening', onListening);

function onListening() {
    console.log('Server listening on ' + app.get('port') + ' in ' + app.get('env') + ' mode.');
}
