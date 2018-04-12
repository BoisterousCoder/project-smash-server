class Action{
    colliderSize;
    colliders;
    damage;
    id;
    isActive;
    img;
    __onColide;
    __onUpdate;
    cast(caster){
        //To Be filled in by child
    }
    get onCollide(){
        let self = this;
        return function(casterChar, collidedChar, colliderId){
            for(let func in self.__onUpdate){
                func(casterChar, collidedChar, colliderId);
            }
        }
    }
    get onUpdate(){
        let self = this;
        return function(lastTime, currentTime){
            for(let func in self.__onUpdate){
                func(lastTime, currentTime);
            }
        }
    }
    set onUpdate(lastTime, currentTime)
    translate(direction, lastTime, currentTime){
        let distance = (currentTime - lastTime) * speed;
        let vect = new Point();
        vect.r = distance;
        vect.deg = direction;
        this.combine(vect);
    }
    constructor(id){
        this.__onUpdate = [];
        this.__onColide = [];
        this.isActive = false;
        this.colliders = [];
        this.id = id;
    }
}
module.exports = Action;