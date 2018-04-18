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
        this.grav = new Point(0, 0.1);
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
        this.__mapSize = 800;
        
        Matter.Composite.add(this.engine.world, 
            Matter.Bodies.rectangle(-1*this.__mapSize, -1*this.__mapSize, this.__mapSize, this.__mapSize))
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
        if(this.players.length <= this.maxPlayers){
            return false;
        }
        this.players.splice(this.getPlayerId(socketId), 1)
        return false;
    }
    __genWorld(){
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
        this.staticPolys = this.__genWorld();
        let staticData = [];
        //this.runner = Matter.Runner.create();
        this.lastUpdateTime = Date.now();
        this.lastDelta = 0;

        for(let staticPoly of this.staticPolys){
            this.add(staticPoly);
            let verts = [];
            for(let vert of staticPoly.vertices){
                staticData.push({x:vert.x, y:vert.y});
            }
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
    //Matter.Runner.tick(game.runner, game.engine, Date.now())
    game.currentTime = Date.now();
    game.currentDelta = game.currentTime - game.lastUpdateTime;

    if(game.lastDelta == 0) Matter.Engine.update(game.engine, game.currentDelta);
    else Matter.Engine.update(game.engine, game.currentDelta, game.currentDelta/game.lastDelta);

    game.lastDelta = game.currentDelta;
    game.lastUpdateTime = game.currentTime;

    console.log("game update at "+ game.currentTime);
    
    game.players.map((player)=>{
        this.emit("charecter", JSON.stringify(player.charecter.toDisplay()));
    })

    if(game.players.length < 1){
        game.reset();
        console.log("The game is empty. Doing a reset...")
    }
}

function readJSON(filename){
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
}