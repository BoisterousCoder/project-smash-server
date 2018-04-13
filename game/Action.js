class Action{
    constructor(id){
        this.__onUpdate = [];
        this.__onCollide = [];
        this.isActive = false;
        this.colliders = [];
        this.id = id;
    }
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
    set onUpdate(func){
        this.__onUpdate.push(func);
    }
    set onCollide(func){
        this.__onCollide.push(func);
    }
    translate(direction, lastTime, currentTime){
        let distance = (currentTime - lastTime) * speed;
        let vect = new Point();
        vect.r = distance;
        vect.deg = direction;
        this.combine(vect);
    }
}
module.exports = Action;