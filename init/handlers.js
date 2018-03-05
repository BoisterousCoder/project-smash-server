const crypto = require('crypto');
function hash(input){
    return crypto.createHash('md5').update(input).digest('hex');
}
let privateGames = {};
let publicGames = [];

let pregame = {
    joinGame(game, s){
        console.log('test');
    }
}
let postgame = {

}

module.exports = {pregame, postgame}