function Player(game) {
    this.game = game;
    this._id = Helpers.idGenerator();
    this.name = "";
    this.tyranosaur = new Tyranosaur(this.game);
    this.size = 1;
}

Player.prototype.createFromServer = function(serverPlayer) {
    this._id = serverPlayer._id;
    this.name = serverPlayer.name;

    if(serverPlayer.bot)  {
        this.tyranosaur.setType('bot');
    }
};


Player.prototype.updateFromServer = function(serverPlayer) {

    if(serverPlayer.position.length !== 3 || serverPlayer.rotation.length !== 4) {
        console.error("Invalid server data for player");
    }

    var object = this.tyranosaur.object;
    object.position.fromArray(serverPlayer.position);
    object.rotation.fromArray(serverPlayer.rotation);

    //this.size = serverPlayer.size;

    object.scale.set(this.size, this.size, this.size);
};



function Players(game) {
    this.game = game;

    this._playerList = [];
}

Players.prototype.new = function() {
    var player = new Player(this.game);

    this._playerList.push(player);

    return player;
};

Players.prototype.delete = function(player) {
    var id;
    if(player instanceof Player) {
        id = player._id;
    }
    else {
        id = player;
    }

    var index  = _.findIndex(this._playerList, {_id: id});
    this._playerList.splice(index, 1);
};

Players.prototype.getById = function(id) {
    return _.find(this._playerList, {_id: id});
};


Players.prototype.getAll = function() {
    return this._playerList;
};
