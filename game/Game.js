const EMPTINESS_UPDATE_DELAY = 1000;
const Matter = require("matter-js");
const Point = require("./../game/Point");
const fs = require("fs");

const updateInterval = 10;

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
    getPlayerId(socketId){
        for(let i in this.players){
            if(this.players[i].socket.id == socketId) return i;
        }
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
            console.log("player has joined game "+this.id);
            return this;
        }
    }
    leave(socketId){
        if(this.players.length <= this.maxPlayers){
            return false;
        }
        this.players.splice(this.getPlayerId(socketId), 1)
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
    emit(title, msg){
        this.players.map((player) => {
            player.socket.emit(title, msg);
        });
    }
    onStart(){
        console.log('starting..');
        this.lastUpdateTime = Date.now();
        this.staticPolys = this.__genStatics();
        for(let staticPoly of this.staticPolys){
            this.add(staticPoly);
        }

        this.engine = Matter.Engine.create();
        console.log(this.engine);
        game.emit("statics", JSON.stringify(game.staticPolys))

        setInterval(()=>onUpdate(this), updateInterval);
    }
    add(item){
        Matter.World.add(this.engine.world, [item]);
    }
    get allPlayersReady(){
        for(let player of this.players){
            if(!player.charecter){
                return false;
            }
        }
        return true;
    }
}
function onUpdate(game){
    let currentTime = Date.now();
    Matter.Engine.update(game.engine, currentTime - game.lastUpdateTime);
    game.lastUpdateTime = game.currentTime;
    game.players.map((player)=>{
        game.emit("charecter", JSON.stringify(player.charecter))
    })
}

function readJSON(filename){
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}