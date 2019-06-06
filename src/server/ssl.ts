/**
 * Module dependencies.
 */

import * as fs from 'fs';
import * as https from 'https';
import * as app from './app/app';

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '443');
// tslint:disable-next-line:no-backbone-get-set-outside-model
app.set('port', port);

const privateKey  = fs.readFileSync('./ssl/server.key', 'utf8');
const certificate = fs.readFileSync('./ssl/server.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

/**
 * Create HTTPS server.
 */
const server = https.createServer(credentials, app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: any) {
    const radix = 10;
    // tslint:disable-next-line:no-shadowed-variable
    const port = parseInt(val, radix);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

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
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    // tslint:disable-next-line:no-unused-variable
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    // tslint:disable-next-line:no-unused-expression
    bind;
}
