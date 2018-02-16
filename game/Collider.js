const Point = require("./Point");
class Collider extends Point {
    size;
    id;
    actionId;
    onCollide;
    constructor(loc, size, id, actionId){
        super(loc.x, loc.y);
        this.size = size;
    }
    onUpdate(lastTime, currentTime){
        //To Be filled in by child
    }
}