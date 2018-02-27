const EMPTINESS_UPDATE_DELAY = 1000;
/*
    Matter.js Demo
    http://brm.io/matter-js/demo/#airFriction
*/  

class Game{
    id;
    name;
    io;
    gravVect = new Point(0, 0.1);
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
        setTimeout(this.onUpdate, 10);
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