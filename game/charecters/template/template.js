const Charecter = require("../../Charecter");
const Action = require("../../Action");
const Point = require("../../Point");
const Collider = require("../../Collider");

class Template extends Charecter{
    actions = [
        new TemplateAction(0)
    ]
    resistance = 2;//the charecter's resistance to damage
    speed = 1;//the movement speed of the charecter
    name = "Template";//The name of the charecter
}

class TemplateAction extends Action{
    size = 2;
    img = "TemplateAttack.png"
    onCollide(casterChar, collidedChar, colliderId){
        collidedChar.multiplier += 10/collidedChar.resistance;
        this.colliders[colliderId] = undefined;
    }
    cast(caster){
        let colliderId = this.colliders.length;
        this.colliders[colliderId] = new Collider(caster, size, colliderId, this.id);
    }
}
module.exports = Template;