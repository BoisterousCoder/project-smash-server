let Action = require("./Action");
let Point = require("./Point");
const Matter = require("matter-js");

class Charecter extends Point{
    constructor(game, width, height){
        super();
        this.__width = width;
        this.__height = height
        this.multiplier = 0;
        this.__onMove = [];
        this.matter = Matter.Bodies.rectangle(this.x, this.y, this.width, this.height);
        game.add(this.matter);
    }
    get width(){
        return this.__width;
    }
    get height(){
        return this.__height;
    }
    get onMove(){
        let self = this;
        return function(direction, lastTime, currentTime){
            __move(direction, lastTime, currentTime)
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
        return function(game, lastTime, currentTime){
            for(let func in self.__onUpdate){
                func(lastTime, currentTime);
            }
        }
    }
    __move(direction, lastTime, currentTime){
        let distance = (currentTime - lastTime) * speed;
        let vect = new Point();
        vect.r = distance;
        vect.deg = direction;
        this.combine(vect);
    }
    set onUpdate(func){
        this.__onUpdate.push(func);
    }
}
module.exports = Charecter;