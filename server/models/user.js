var Helpers = require('../modules/helpers');
var Debug = require('../modules/debug');
var Constants = require("../../server/modules/constants");
var _ = require('lodash');

var inactiveDelay = 1000; // ms

function User( name ) {

    this._id = Helpers.idGenerator();
    this.name = name || Helpers.randomName();

    this.socket = null;

    this.position = [0,0,0];
    this.rotation = [0,0,0,"XYZ"];

    this.heartTime = null;

    this.bot = false;

    this.size = 1;
    this.speed = 10;
}

User.prototype.toPublic = function() {
    var publicUser = {};
    publicUser._id = this._id;
    publicUser.name = this.name;
    publicUser.bot = this.bot;
    publicUser.position = this.position;
    publicUser.rotation = this.rotation;
    publicUser.size = this.size;

    return publicUser;
};

User.prototype.isInactive = function() {
    if(!this.heartTime) return false;

    var now = new Date().getTime();
    return (now - this.heartTime) > inactiveDelay;
};

User.prototype.heartBeat = function() {
    this.heartTime = new Date().getTime();
};

User.prototype.move = function(newState) {

    if(!this.isCorrectMove(newState.position)) {
        Debug.log("Incorrect move detected for player " + this._id);
        return;
    }

    this.position = newState.position;
    this.rotation = newState.rotation;
};

// TODO Quand les sizes et vitesse fonctionneront
User.prototype.isCorrectMove = function(newPos) {
    return true;

    var distance = Helpers.distanceBetween(this.position, newPos);

    return (distance < this.speed);
};

User.prototype.canEat = function(userToEat) {
    if(!userToEat) return false;

    if(userToEat.size > this.size) return false;

    var distance = Helpers.distanceBetween(userToEat.position, this.position);

    // TODO Quand l'interface acceptera de se faire manger
    return userToEat.bot && (distance < Constants.eatPerimeter);
};

User.prototype.eat = function(userToEat) {
    this.size += userToEat.size;
};

module.exports = User;
