const publicGames = 5;

const crypto = require('crypto');
const Game = require("../game/Game");

function hash(input){
    return crypto.createHash('md5').update(input).digest('hex');
}

function stripInvalid(input){
    return input.replace(/[^A-Za-z0-9]/g, '');
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
        if(!games.publicGames[gameId]){
            socket.emit("warn", "There is no public game with the id of "+gameId);
            return null;
        }
        let game = games.publicGames[gameId];
        game.join(socket);
        if(game){
            socket.emit("joinSuccess", gameId);
            return [gameId, true];
        }else{
            socket.emit("warn", "You can't join a full game");
            return null;
        }
    },
    requestPrivate(socket, gameId){
        if(gameId){
            let game = games.privateGames[gameId];
            game.join(socket);
            if(game){
                socket.emit("joinSuccess", gameId);
                return [gameId, false];
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
            return [gameId, false];
        }
    }
}
let postgame = {
    requestCharecter(socket, game, charecterName){
        charecterName = stripInvalid(charecterName);
        const playerId = game.getPlayerId(socket.id);
        if(game.players[playerId].charecter){
            socket.emit("warn", "You already have a charecter")
        }else{
            let charClass = require(`../game/charecters/${charecterName}/${charecterName}.js`)
            game.players[playerId].charecter = new charClass(game);
            socket.emit("log", "You have selected the "+charecterName+" charecter successfully");
        }
        if(game.allPlayersReady) game.onStart();
        else socket.emit("log", "not all players are ready");
        return game;
    },
    move(socket, game, direction){
        let id = game.getPlayerId(socket);
        let charecter = game.players[id].charecter;
        let force = new Point();
        force.r = charecter.speed;
        force.deg = Number(direction);
        Matter.Body.applyForce(charecter, charecter.vect, force);
    }
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