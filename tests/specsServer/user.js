var expect = require("chai").expect;

var Helpers = require("../../server/modules/helpers");
var Constants = require("../../server/modules/constants");
var Users = require("../../server/models/users");
var User = require("../../server/models/user");

describe('User', function () {
    it('should create', function () {
        var user = new User();

        expect(user).to.exist;
        expect(user._id).to.exist;
        expect(user.name).to.exist;
        expect(user.bot).to.be.false;
        expect(user.speed).to.equal(10);
        expect(user.position).to.exist;
        expect(user.position.length).to.equal(3);
        expect(user.rotation).to.exist;
        expect(user.rotation.length).to.equal(4)
        expect(user.position[1]).to.equal(30);
        expect(user.rotation[3]).to.equal("XYZ");
    });

    it('should transform to public', function () {
        var user = new User();
        var pUser = user.toPublic();

        expect(pUser).to.exist;
        expect(pUser._id).to.be.equal(user._id);
        expect(pUser.name).to.be.equal(user.name);
        expect(user).to.exist;
        expect(user.position).to.exist;
        expect(user.position.length).to.be.equal(3);
        expect(user.rotation).to.exist;
        expect(user.rotation.length).to.be.equal(4);
    });

    it('tells inactivity', function() {
        var user = new User();
        var now = new Date().getTime();

        expect(user.isInactive()).to.be.false;
        user.heartTime = now - 50;
        expect(user.isInactive()).to.be.false;
        user.heartTime = now - 2000;
        expect(user.isInactive()).to.be.true;
    });

    it('receives heartBeat', function() {

        var user = new User();
        var t1 = new Date().getTime();
        user.heartBeat();
        var t2 = new Date().getTime();

        expect(user.heartTime).to.be.gte(t1);
        expect(user.heartTime).to.be.lte(t2);
    });

    it('moves tyranosaur', function() {
        var user = new User();
        var fntmp = User.prototype.isCorrectMove;
        User.prototype.isCorrectMove = function() { return true; };

        var newState = {
            position: [1,0,10],
            rotation: [2,0,20,'xyz']
        };
        user.move(newState);

        expect(user.position[2]).to.equal(10);
        expect(user.rotation[2]).to.equal(20);

        User.prototype.isCorrectMove = fntmp;

    });

    it('accepts correct move', function() {

        var user = new User();
        user.position = [ 0,0,0 ];
        var newPos = [1,0,0];
        user.speed = 2;

        expect(user.isCorrectMove(newPos)).to.be.true;
    });

    it('rejects incorrect move', function() {

        var user = new User();
        user.position = [ 0,0,0 ];
        var newPos = [5,0,0];
        user.speed = 2;

        expect(user.isCorrectMove(newPos)).to.be.false;
    });

    it('accepts correct eat', function() {

        var user1 = new User();
        var user2 = new User();
        var distance = Constants.eatPerimeter - 1;
        user1.position = [ 0,0,0 ];
        user2.position = [ 0,0,distance ];

        expect(user1.canEat(user2)).to.be.true;
    });

    it('rejects incorrect eat', function() {

        var user1 = new User();
        var user2 = new User();
        var distance = Constants.eatPerimeter + 1;
        user1.position = [ 0,0,0 ];
        user2.position = [ 0,0,distance ];

        expect(user1.canEat(user2)).to.be.false;
    });
});