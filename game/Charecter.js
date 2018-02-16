let Action = require("./Action");
let Point = require("./Point")

class Charecter extends Point{
    socketId;
    isPremium;
    name;
    actions;
    multiplier = 0;
    resistance;
    img;
    playerName;
    speed;
    onMove(direction, lastTime, currentTime){
        let distance = (currentTime - lastTime) * speed;
        let vect = new Point();
        vect.r = distance;
        vect.deg = direction;
        this.combine(vect);
    }
    onUpdate;

    constructor(socketId){
        this.socketId = socketId;
    }
}
module.exports = Charecter;