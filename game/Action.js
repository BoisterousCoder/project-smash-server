class Action{
    colliderSize;
    colliders = [];
    damage;
    id;
    isActive = false;
    img;
    cast(caster){
        //To Be filled in by child
    }
    onCollide(casterChar, collidedChar, colliderId){
        //To Be filled in by child
    }
    onUpdate(lastTime, currentTime){
        //To Be filled in by child
    }
    translate(direction, lastTime, currentTime){
        let distance = (currentTime - lastTime) * speed;
        let vect = new Point();
        vect.r = distance;
        vect.deg = direction;
        this.combine(vect);
    }
    constructor(id){
        this.id = id;
    }
}
module.exports = Action;