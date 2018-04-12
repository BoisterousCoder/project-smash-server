const Charecter = require("../../Charecter");
const Action = require("../../Action");
const Point = require("../../Point");
const Collider = require("../../Collider");

class Template extends Charecter{
    actions;
    resistance;//the charecter's resistance to damage
    speed;//the movement speed of the charecter
    name;//The name of the charecter
    constructor(socketId){
        super(socketId);
        this.actions = [
            new TemplateAction(0)
        ]
        this.resistance =2;
        this.speed = 1;
        this.name="Template";
    }
}

class TemplateAction extends Action{
    size;
    constructor(id){
        super(id);
        size = 2;
        let self = this;
        this.onCollide = function(casterChar, collidedChar, colliderId){
            collidedChar.multiplier += 10/collidedChar.resistance;
            self.colliders[colliderId] = undefined;
        }
        this.cast = function(caster){
            let colliderId = self.colliders.length;
            self.colliders[colliderId] = new Collider(caster, size, colliderId, self.id);
        }
    }
}
module.exports = Template;