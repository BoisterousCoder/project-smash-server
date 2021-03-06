let Action = require("./Action");
let Point = require("./Point");
const Matter = require("matter-js");

class Charecter extends Point{
    constructor(game, x, y, width, height){
        super(x, y);
        this.__width = width;
        this.__height = height
        this.multiplier = 0;
        this.matter = Matter.Bodies.rectangle(this.__x, this.__y, this.width, this.height);
        game.add(this.matter);
    }
    get x(){
        return this.matter.position.x;
    }
    set x(x){
        let point = new Point(x, this.y);
        Matter.Body.setPosition(this.matter, point.vect);
        let self = this;
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
    onUpdate(game){
        game.emit("charecter", JSON.stringify(this.toDisplay()));
    }
    applyForce(force){
        Matter.Body.applyForce(this.matter, this.vect, force);
        let self = this;
    }
    __move(direction, lastTime, currentTime){
        let distance = (currentTime - lastTime) * speed;
        let vect = new Point();
        vect.r = distance;
        vect.deg = direction;
        this.combine(vect);
    }
    toDisplay(){
        let verts = [];
        for(let vert of this.matter.vertices){
            verts.push({
                x:vert.x,
                y:vert.y
            })
        }
        return {
            name:this.name,
            verts:verts,
            x:this.x,
            y:this.y
        }
    }
}
module.exports = Charecter;