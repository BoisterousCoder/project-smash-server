const handlers = require("./handlers");
module.exports = function(io) {
    io.on('connection', function(socket) {
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
                            console.warn('Person accessed game data of a game they weren\'t in that game.')
                        }
                    }else if(!isGameRequired){
                        callback(res);
                    }else{
                        console.warn('Person accessed game data of a game they weren\'t in that game.')
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
                handlers[handler](res, game, socket, io);
            });
        }
        for (const handler in handlers.postgame) {
            on(handler, (res) =>{
                handlers[handler](res, game, socket, io);
            }, true);
        }
    });
};