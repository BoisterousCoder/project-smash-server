const handlers = require("./handlers");
module.exports = function(io) {
    let activeConnections = 0;
    function printActiveConnections(){
        console.log('there are '+activeConnections+" conections active");
    }

    io.on('connection', function(socket) {
        activeConnections += 1;
        printActiveConnections();
        let gameId;
        let isPublicGame;

        function on(title, callback, isGameRequired){
            socket.on(title, function(res){
                try{
                    let game = getGame();
                    
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
                    socket.emit('Error', 'An error has occured server side. This is probably a bug. Please file a bug report on this program\'s github page with the following text:\n\n' + err.stack);
                    callOnFunc(title, callback, isGameRequired);
                }
            });
        }
        function callOnFunc(title, callback, isGameRequired){
            on(title, callback, isGameRequired);
        }
        function getGame(){
            if(isPublicGame){
                return handlers.publicGames[gameId];
            }else{
                return handlers.privateGames[gameId];
            }
        }

        for (const handler in handlers.pregame) {
            on(handler, (res) =>{
                game = handlers.pregame[handler](socket, res);
            }, false);
        }
        for (const handler in handlers.postgame) {
            on(handler, (res) =>{
                game = handlers.postgame[handler](socket, res, game);
            }, true);
        }
        on("disconnect", () => {
            activeConnections -= 1;
            if(gameId){
                if(getGame().leave(socket.id)){
                    console.log("player removed from game "+gameId);
                }else{
                    console.error("error removing a player from game "+gameId);
                }
            }
            printActiveConnections();
        });
    });
};