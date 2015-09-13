function UserAction (userInput) {

    this.userInput = userInput;

    this.actions = {
        'MOVE': {
            active: false,
            value: '',
            keys: ['UP', 'DOWN']
        },
        'POO': {
            active: false,
            value: '',
            keys: ['POO']
        }
    };
}

UserAction.prototype.updateActions = function() {

    var keys = this.userInput.KEYS;

    for(var actionName in this.actions) {

        if(this.actions.hasOwnProperty(actionName)) {

            var action = this.actions[actionName];

            var lastKey = null;
            for (var i = 0; i < action.keys.length; i++) {
                var key = action.keys[i];
                if(keys[key].active && (!lastKey || (keys[key].eventTimestamp - keys[lastKey].eventTimestamp  > 0))) {
                    lastKey = key;
                }
            }
            if(lastKey) {
                if(!action.active) {
                    this.runListeners(actionName, true);
                }
                action.active = true;
                action.value = lastKey;
            }
            else {
                if(action.active) {
                    this.runListeners(actionName, false);
                }
                action.active = false;
                action.value = '';
            }
        }
    }
};


UserAction.prototype.registerListener = function(action, listener) {
    if(this.actions[action]) {
        if(!this.actions[action].listeners) {
            this.actions[action].listeners = [];
            this.actions[action].listeners.push(listener);
        }
    }
};

UserAction.prototype.runListeners = function(actionName, pressed) {
    var action = this.actions[actionName];
    var listeners = action.listeners;

    if(listeners) {
        for (var i = 0; i < listeners.length; i++) {
            var listener = listeners[i];

            listener(action.value, pressed);
        }
    }
};
