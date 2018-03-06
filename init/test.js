// const Game = require('../game/Game.js');
const port = normalizePort(process.env.PORT || '3000');
const address = 'localhost';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send('<h1>Hello world</h1>');
  next();
});
app.get('/test', function(req, res){
  res.send(`
  <h1>Hello world</h1>
  <script src='https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js'></script>
  <script>
  window.onload=function(){
        var connectionOptions =  {
            "force new connection" : true,
            "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
            "timeout" : 10000, //before connect_error and connect_timeout are emitted.
            "transports" : ["websocket"], 
            "reconnect": true
        };
        socket = io.connect("localhost:3000", connectionOptions);
        socket.emit("ping");
    }
  </script>
  `);
});

//Allow Cross Domain Requests
io.set('transports', [ 'websocket' ]);
// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.emit("ping");
//   socket.on('ping', function(){
//     socket.emit('pong');
//     console.log('pong');
//   });
// });
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