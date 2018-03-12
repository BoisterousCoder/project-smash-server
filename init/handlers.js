const publicGames = 5;

const crypto = require('crypto');
const Game = require("../game/Game");

function hash(input){
    return crypto.createHash('md5').update(input).digest('hex');
}
class GameContainer{
    constructor(){
        this.pregame = pregame;
        this.postgame = postgame;
        this.publicGames = [];
        this.privateGames = {};
    }
}
let games = new GameContainer();

let pregame = {
    ping(socket){
        console.log("The Server was pinged");
        socket.emit("pong");
    },
    getPublicListings(socket){
        let gameListings = [];
        games.publicGames.map(game => {
            gameListings.push({
                name:"Game "+game.id,
                players:game.players+"/"+game.maxPlayers,
                id:game.id
            });
        });
        socket.emit("gameListings", JSON.parse(gameListings));
    },
    requestPublic(socket, gameId){
        gameId = Number(gameId);
        if(!games.privateGames[gameId]){
            socket.emit("warn", "There is no public game with that id");
            return;
        }
        let game = games.privateGames[gameId].join(socket);
        if(game){
            socket.emit("joinSuccess", gameId);
            return gameId, true;
        }else{
            socket.emit("warn", "You can't join a full game");
        }
    },
    requestPrivate(socket, gameId){
        if(gameId){
            let game = games.privateGames[gameId].join(socket);
            if(game){
                socket.emit("joinSuccess", gameId);
                return gameId;
            }else{
                socket.emit("warn", "You can't join a full game");
            }
        }else if(games.privateGames[gameId]){
            socket.emit("warn", "You can't overright an already existing game");
        }else{
            gameId = hash(socket.id);
            let game = new Game(gameId, socket.io);
            games.privateGames[gameId] = game;
            return gameId, true;
        }
    }
}
let postgame = {
    
}

module.exports = games;