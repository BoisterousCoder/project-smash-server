const publicGames = 5;

const crypto = require('crypto');
const Game = require("../game/Game");

function hash(input){
    return crypto.createHash('md5').update(input).digest('hex');
}

let pregame = {
    ping(socket){
        console.log("The Server was pinged");
        socket.emit("pong");
        return null;
    },
    gameListings(socket){
        console.log("Sending Listings..");
        let gameListings = [];
        games.publicGames.map(game => {
            gameListings.push({
                name:"Game "+game.id,
                players:game.players+"/"+game.maxPlayers,
                id:game.id
            });
        });
        socket.emit("gameListings", JSON.stringify(gameListings));
        return null;
    },
    requestPublic(socket, gameId){
        gameId = Number(gameId);
        if(!games.privateGames[gameId]){
            socket.emit("warn", "There is no public game with that id");
            return null;
        }
        let game = games.privateGames[gameId].join(socket);
        if(game){
            socket.emit("joinSuccess", gameId);
            return gameId;
        }else{
            socket.emit("warn", "You can't join a full game");
            return null;
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
                return null;
            }
        }else if(games.privateGames[gameId]){
            socket.emit("warn", "You can't overright an already existing game");
            return null;
        }else{
            gameId = hash(socket.id);
            games.privateGames[gameId] = new Game(gameId);
            return gameId;
        }
    }
}
let postgame = {
    
}
class GameContainer{
    constructor(){
        this.pregame = pregame;
        this.postgame = postgame;
        this.publicGames = [];
        this.privateGames = {};

        for(let i = 0; i < publicGames; i++){
            this.publicGames[i] = new Game(i);
        }
    }
}
let games = new GameContainer();

module.exports = games;