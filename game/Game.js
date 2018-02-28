const EMPTINESS_UPDATE_DELAY = 1000;
const Matter = require("matter-js");
/*
    Matter.js Demo
    http://brm.io/matter-js/demo/#airFriction
*/  

class Game{
    id;
    name;
    io;
    grav = new Point(0, 0.1);
    engine;
    staticPolys = [];
    players=[];
    charecters=[];
    lastUpdateTime;
    owner={};
    reset;
    _destroyFunc;
    maxPlayers;
    constructor(id, io, reset, maxPlayers){
        this.id=id;
        this.name = 'Game ' + (id + 1)
        this.io=io;

        this.reset = reset;
        this._destroyFunc = false;
        this.maxPlayers = maxPlayers;
    }
    set destroyFunc(func){
        this._destroyFunc = func;
        setTimeout(this.destroyIfEmpty(), EMPTINESS_UPDATE_DELAY);
    }
    destroyIfEmpty(){
        let self = this;
        return function(){        
            if(self.players.length > 0){
                console.log('Private game ' + self.name + ' will not be destroyed for now, as there are still players inside');
                setTimeout(self.destroyIfEmpty(), EMPTINESS_UPDATE_DELAY);
            }else{
                self._destroyFunc(self.id);
            }
        }
    }
    onInput(input, playerId){
        
    }
    onStart(charecters, staticPolys){
        this.staticPolys = staticPolys;
        this.charecters = charecters;
        this.lastUpdateTime = Date.now();

        this.engine = Matter.Engine.create();

        Engine.run(this.engine);

        setTimeout(this.onUpdate, 10);
    }
    add(item){
        Matter.add(this.engine.world, [item]);
    }
    onUpdate(){
        let currentTime = Date.now();
        let game = this;
        this.charecters.forEach(charecter => {
            charecter.onUpdate(game, game.lastUpdateTime, game.currentTime);
        });
        this.lastUpdateTime = this.currentTime;
    }
}