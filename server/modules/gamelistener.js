var GameListener = function(game) {
    this.game = game;
    this.io = game.io;

};

GameListener.prototype.register = function(user) {

    var self = this;

    self.welcomePlayer(user, function() {
        self.diffuseGameState(user);
        self.announcePlayer(user);

        user.socket.on('player update', self.listenUpdatePosition(self.io, user));
        user.socket.on('heartbeat', function() {
            user.heartBeat.call(user);
        });
    });
};

GameListener.prototype.deregister = function(user) {
    this.io.emit('player leave', user._id);

};

GameListener.prototype.listenUpdatePosition = function(io, user) {

    var self = this;
    return function(position) {
        user.move(position);

        var options = user.toPublic();
        self.game.users.getAll(function(userList) {
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
                user.socket.volatile.emit('player update', options);
            }
        });
    };
};

GameListener.prototype.diffuseGameState = function(user) {
    var self = this;
    self.game.users.getAllPublic(function(users) {
        var state = {
            users: users
        };
        for (var i = 0; i < self.game.bots.bots.length; i++) {
            var bot = self.game.bots.bots[i];
            state.users.push(bot.toPublic());
        }
        user.socket.emit('game state', state);
    });
};

GameListener.prototype.welcomePlayer = function(user, welcomed) {
    var welcomeMessage = {};
    welcomeMessage._id = user._id;
    welcomeMessage.name = user.name;
    user.socket.emit('welcome', welcomeMessage, welcomed);
};


GameListener.prototype.announcePlayer = function(user) {
    user.socket.broadcast.emit('player new', user.toPublic());
};

module.exports = GameListener;