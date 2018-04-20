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
        this.init(id, maxPlayers);
    }
    init(id, maxPlayers){
        this.grav = new Point(0, 1);
        this.staticPolys = [];
        this.players=[];
        this.charecters=[];
        this.owner={};
        this.mapFile = "../game/maps/map.json";
        this.id=id;

        this.maxPlayers = maxPlayers;

        this.__mapOffSet = {
            x:0,
            y:0
        }
        this.engine = Matter.Engine.create();
        this.__mapSize = 100;
    }
    reset(){
        if(this.loop)clearInterval(this.loop);
        init(this.id, this.maxPlayers);
    }
    getPlayerId(socketId){
        for(let i in this.players){
            if(this.players[i].socket.id == socketId) return i;
        }
        return false;
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
        // if(this.players.length <= this.maxPlayers){
        //     return false;
        // }
        this.players.splice(this.getPlayerId(socketId), 1)
        console.log("there are now only " + game.players.length +" left in a game");
        if(game.players.length < 1){
            game.reset();
            console.log("The game is empty. Doing a reset...")
        }
        return true;
    }
    __genWorld(){
        let statics = [];
        let mapData = readJSON(this.mapFile);
        for(let staticData of mapData.statics){
            for(let parameter in staticData){
                staticData[parameter] /= 100;
                staticData[parameter] *= this.__mapSize;
            }
            let staticPoly = Matter.Bodies.rectangle(
                staticData.x+this.__mapOffSet.x, 
                staticData.y+this.__mapOffSet.y, 
                staticData.width, 
                staticData.height
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
        this.staticPolys = this.__genWorld();
        let staticData = [];
        this.lastUpdateTime = Date.now();
        this.lastDelta = 0;

        for(let staticPoly of this.staticPolys){
            this.add(staticPoly);
            Matter.Body.setStatic(staticPoly, true);
            let verts = [];
            for(let vert of staticPoly.vertices){
                verts.push({x:vert.x, y:vert.y});
            }
            staticData.push(verts);
        }
        this.emit("statics", JSON.stringify(staticData));

        console.log(this.engine);

        this.loop = setInterval(()=>onUpdate(this), updateInterval);
        this.emit("start");
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
    game.currentTime = Date.now();
    game.currentDelta = game.currentTime - game.lastUpdateTime;

    if(game.lastDelta == 0) Matter.Engine.update(game.engine, game.currentDelta);
    else Matter.Engine.update(game.engine, game.currentDelta, game.currentDelta/game.lastDelta);

    game.lastDelta = game.currentDelta;
    game.lastUpdateTime = game.currentTime;

    console.log("game update at "+ game.currentTime);
    
    for(let player of game.players){
        if(player) player.charecter.onUpdate(game);
    }
}

function readJSON(filename){
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}