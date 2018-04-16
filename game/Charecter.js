let Action = require("./Action");
let Point = require("./Point");
const Matter = require("matter-js");

class Charecter extends Point{
    constructor(game, x, y, width, height){
        super(x, y);
        this.__width = width;
        this.__height = height
        this.multiplier = 0;
        this.__onMove = [];
        this.matter = Matter.Bodies.rectangle(this.__x, this.__y, this.width, this.height);
        game.add(this.matter);
    }
    get x(){
        return this.matter.position.x;
    }
    set x(x){
        let point = new Point(x, this.y);
        Matter.Body.setPosition(this.matter, point.vect);
    }
    get y(){
        return this.matter.position.y;
    }
    set y(y){
        let point = new Point(this.x, y);
        Matter.Body.setPosition(this.matter, point.vect);
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
    toDisplay(){
        return {
            name:this.name,
            x:this.x,
            y:this.y
        }
    }
    set onUpdate(func){
        this.__onUpdate.push(func);
    }
}
module.exports = Charecter;