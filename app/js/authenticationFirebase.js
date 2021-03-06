function Authentication_Firebase() {
  var _firebase = new Firebase(GameConfig.FireBaseUrl);
  var _auth = null;

  function addUser(auth) {
    var playersRef = _firebase.child("players");
    var myRef = playersRef.child(auth.uid);
    myRef.set({
      provider: auth.provider
    });

    myRef.onDisconnect().remove();
  }

  this.auth = function(callback) {
    _firebase.authAnonymously(function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        _auth = authData;
        addUser(_auth);
        callback && callback(true);
      }
    }, { remember: 'sessionOnly' });
  };

  this.unauth = function() {
    _firebase.unauth();
  };

  this.getFirebase = function() {
    if(!_auth) return null;
    var playersRef = _firebase.child("players");

    return {
      authId: _auth.uid,
      me: playersRef.child(_auth.uid),
      others: playersRef
    };
  };

}
