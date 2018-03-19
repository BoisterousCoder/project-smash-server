const EMPTINESS_UPDATE_DELAY = 1000;
const Matter = require("matter-js");
const Point = require("./../game/Point");
const fs = require("fs");
/*
    Matter.js Demo
    http://brm.io/matter-js/demo/#airFriction
*/  

module.exports = class Game{
    constructor(id, maxPlayers = 4){
        // id, io, reset, maxPlayers
        this.grav = new Point(0, 0.1);
        this.staticPolys = [];
        this.players=[];
        this.charecters=[];
        this.owner={};
        this.mapFile = "./game/maps/map.json";
        this.id=id;

        // this.reset = reset;
        this._destroyFunc = false;
        this.maxPlayers = maxPlayers;
        this.engine = Matter.Engine.create();

        this.__mapOffSet = {
            x:0,
            y:0
        }
        this.__mapSize = 800;
    }
    set destroyFunc(func){
        this._destroyFunc = func;
        setTimeout(this.destroyIfEmpty(), EMPTINESS_UPDATE_DELAY);
    }
    destroyIfEmpty(){      
        if(this.players.length > 0){
            console.log('Private game ' + this.name + ' will not be destroyed for now, as there are still players inside');
            setTimeout(this.destroyIfEmpty(), EMPTINESS_UPDATE_DELAY);
        }else{
            this._destroyFunc(this.id);
        }
    }
    join(socket){
        if(this.players.length >= this.maxPlayers){
            return false;
        }else{
            this.players.push({
                socket:socket
            });
            console.log("player has joined game")
            return this;
        }
    }
    leave(socketId){
        if(this.players.length <= this.maxPlayers){
            return false;
        }
        for(let i in this.players){
            if(this.players[i].socket.id == socketId){
                this.players.splice(i, 1)
                return true;
            }
        }
        return false;
    }
    __genStatics(){
        let statics = [];
        let mapData = readJSON(this.mapFile);
        for(let staticData of mapData.statics){
            for(let parameter in staticData){
                staticData[parameter] /= 100;
            }
            let staticPoly = Matter.Bodies.rectangle(
                staticData.x*this.__mapSize+this.__mapOffSet.x, 
                staticData.y*this.__mapSize+this.__mapOffSet.y, 
                staticData.width*this.__mapSize, 
                staticData.height*this.__mapSize, 
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