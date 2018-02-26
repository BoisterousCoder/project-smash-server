let Action = require("./Action");
let Point = require("./Point")

class Charecter extends Poly{
    socketId;
    isPremium;
    name;
    actions;
    multiplier = 0;
    resistance;
    img;
    playerName;
    vel;
    speed;
    __onMove = [];
    __onUpdate = [];
    get onMove(){
        let self = this;
        return function(direction, lastTime, currentTime){
            let distance = (currentTime - lastTime) * speed;
            let vect = new Point();
            vect.r = distance;
            vect.deg = direction;
            self.combine(vect);
            for(let func in self.__onMove){
                func(direction, lastTime, currentTime);
            }
        }
    }
    set onMove(func){
        this.__onMove.push(func);
    }
    get onUpdate(){
        let self = this;
        return function(lastTime, currentTime){
            for(let func in self.__onUpdate){
                func(lastTime, currentTime);
            }
        }
    }
    set onUpdate(func){
        this.__onUpdate.push(func);
    }

    constructor(socketId){
        this.socketId = socketId;
    }
}
module.exports = Charecter;