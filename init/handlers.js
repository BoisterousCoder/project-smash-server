const crypto = require('crypto');
function hash(input){
    return crypto.createHash('md5').update(input).digest('hex');
}
class gameContainer{
    constructor(){
        this.pregame = pregame;
        this.postgame = postgame;
        this.publicGames = [];
        this.privateGames = {};
    }
}

let pregame = {
    ping(socket, msg){
        console.log('pong');
        socket.emit("pong");
    },
    getPublicListings(socket, msg){
        
    },
    joinGame(socket, msg){
        console.log('test');
    }
}
let postgame = {
    
}

module.exports = {pregame, postgame}