const http = require('http');
const app = require('./app');/* import of the application Express (the app.js file) */

// Function returning a valid port, provided either with a number or with a chain of caracters
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '3000');/* defining the 'port' as either the default one provided by the platform, either port '3000' */
app.set('port', port);/* defining where the application will turn */

// Function looking for and dealing with the errors
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);/* giving the application 'app' to the server */

server.on('error', errorHandler);/* Error in case something goes wrong when starting the server */

// Message in console to confirm the connection when starting the server
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);/* the server is configurated to listen to 'port' see above */
