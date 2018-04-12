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
                        if(game.getPlayerId(socket.id)){
                            callback(res);
                        }else if(!isGameRequired){
                            callback(res);
                        }else{
                            console.warn('A person attempted to access game data of a game they weren\'t in.');
                            socket.emit("warn", "You aren't in game " + gameId);
                        }
                    }else if(!isGameRequired){
                        callback(res);
                    }else{
                        console.warn('A person attempted to access game data of a game they weren\'t in.')
                        socket.emit("warn", "You aren't in game any game");
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
        function setGame(game){
            if(isPublicGame){
                handlers.publicGames[gameId] = game;
            }else{
                handlers.privateGames[gameId] = game;
            }
        }

        for (const handler in handlers.pregame) {
            on(handler, (res) =>{
                let gameInfo = handlers.pregame[handler](socket, res);
                if(gameInfo){
                    gameId = gameInfo[0];
                    isPublicGame = gameInfo[1];
                } 
            }, false);
        }
        for (const handler in handlers.postgame) {
            on(handler, (res) =>{
                let _game = handlers.postgame[handler](socket, getGame(), res);
                if(_game) setGame(_game);
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