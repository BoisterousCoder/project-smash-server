const Charecter = require("../../Charecter");
const Action = require("../../Action");
const Point = require("../../Point");
const Collider = require("../../Collider");

class Template extends Charecter{
    constructor(socketId){
        this.width = 0.5;
        this.height = 2;
        super(socketId);
        this.actions = [
            new TemplateAction(0)
        ]
        this.resistance =2;//the charecter's resistance to damage
        this.speed = 1;//the movement speed of the charecter
        this.name="Template";//The name of the charecter
    }
}

class TemplateAction extends Action{
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