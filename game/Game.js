class Game{
    constructor(id, io, reset, maxPlayers){
        this.id=id;
        this.name = 'Game ' + (id + 1)
        this.io=io;
        this.players=[];
        this.charecters=[];
        this.owner={};
        this.reset = reset;
        this._destroyFunc = false;
        this.maxPlayers = maxPlayers;
        this.genBoard();
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
}