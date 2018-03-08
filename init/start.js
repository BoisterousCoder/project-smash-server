const port = normalizePort(process.env.PORT || '3000');
const address = 'localhost';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('views', __dirname);
app.set('view engine', 'pug');
app.all('/*', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.render('test');
});

io.set('transports', [ 'websocket' ]);
require("./socket.js")(io);

http.listen(port, address, function(){
  console.log('listening on '+address+':'+port);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

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