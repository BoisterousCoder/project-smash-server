const EMPTINESS_UPDATE_DELAY = 1000;
const Matter = require("matter-js");
const Point = require("./../game/Point");
const fs = require("fs");
/*
    Matter.js Demo
    http://brm.io/matter-js/demo/#airFriction
*/  

module.exports = class Game{
    constructor(){
        // id, io, reset, maxPlayers
        this.grav = new Point(0, 0.1);
        this.staticPolys = [];
        this.players=[];
        this.charecters=[];
        this.owner={};
        this.mapFile = "./game/maps/map.json";
        // this.id=id;
        // this.name = 'Game ' + (id + 1)
        // this.io=io;

        // this.reset = reset;
        this._destroyFunc = false;
        // this.maxPlayers = maxPlayers;
        this.engine = Matter.Engine.create();

        this.mapOffSet = {
            x:0,
            y:0
        }
        this.mapSize = 800;
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
    __genStatics(){
        let statics = [];
        let mapData = readJSON(this.mapFile);
        for(let staticData of mapData.statics){
            for(let parameter in staticData){
                staticData[parameter] /= 100;
            }
            let staticPoly = Matter.Bodies.rectangle(
                staticData.x*this.mapSize+this.mapOffSet.x, 
                staticData.y*this.mapSize+this.mapOffSet.y, 
                staticData.width*this.mapSize, 
                staticData.height*this.mapSize, 
                { isStatic: true }
            );
            statics.push(staticPoly);
        }
        return statics;
    }
    onInput(input, playerId){
        
    }
    onStart(){
        console.log('starting..');
        // charecters
        // this.charecters = charecters;
        this.lastUpdateTime = Date.now();
        this.staticPolys = this.__genStatics();
        for(let staticPoly of this.staticPolys){
            this.add(staticPoly);
        }

        this.engine = Matter.Engine.create();
        console.log(this.engine);

        setInterval(()=>onUpdate(this), 10);
    }
    add(item){
        Matter.World.add(this.engine.world, [item]);
    }
}
function onUpdate(game){
    let currentTime = Date.now();
    Matter.Engine.update(game.engine, currentTime - game.lastUpdateTime);
    game.lastUpdateTime = game.currentTime;
}

function readJSON(filename){
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}