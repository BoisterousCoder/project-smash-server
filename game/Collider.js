const Point = require("./Point");
class Collider extends Point {
    constructor(loc, size, id, actionId){
        super(loc.x, loc.y);
        this.size = size;
    }
    onUpdate(lastTime, currentTime){
        //To Be filled in by child
    }
    onCollide(casterChar, collidedChar, colliderId){
        //TODO
    }
}