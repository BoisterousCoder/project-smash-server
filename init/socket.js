const handlers = require("./handlers");
module.exports = function(io) {
    let activeConnections = 0;
    function printActiveConnections(){
        console.log('there are '+activeConnections+" conections active");
    }

    io.on('connection', function(socket) {
        activeConnections += 1;
        printActiveConnections();
        let game;

        function on(title, callback, isGameRequired){
            socket.on(title, function(res){
                try{
                    if(game){
                        if(game.isPlayerInGame(socket.id)){
                            callback(res);
                        }else if(!isGameRequired){
                            callback(res);
                        }else{
                            console.warn('Person attempted to access game data of a game they weren\'t in.')
                        }
                    }else if(!isGameRequired){
                        callback(res);
                    }else{
                        console.warn('Person attempted to access game data of a game they weren\'t in.')
                    }
                }catch(err){
                    console.error(err);
                    socket.emit('serverError', 'An error has occured server side. This is probably a bug. Please file a bug report on this program\'s github page with the following text:\n\n' + err.stack);
                    callOnFunc(title, callback, isGameRequired);
                }
            });
        }
        function callOnFunc(title, callback, isGameRequired){
            on(title, callback, isGameRequired);
        }

        for (const handler in handlers.pregame) {
            on(handler, (res) =>{
                handlers.pregame[handler](socket, res);
            });
        }
        for (const handler in handlers.postgame) {
            on(handler, (res) =>{
                handlers.postgame[handler](socket, res);
            }, true);
        }
        on("disconnect", function(){
            activeConnections -= 1;
            printActiveConnections();
        });
    });
};