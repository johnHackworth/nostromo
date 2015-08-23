window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.Keyboard = function(size) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.keys = {};
    this.bindEvents();
};

window.pixEngine.utils.Keyboard.prototype = {
    LEFT_CURSOR: 37,
    UP_CURSOR: 38,
    RIGHT_CURSOR: 39,
    DOWN_CURSOR: 40,
    ENTER: 13,
    SHIFT: 16,
    SPACE: 32,
    LEFT_CONTROL: 17,
    keysPressed: 0,
    bindEvents: function() {
        document.body.addEventListener('keydown', this.keydown.bind(this));
        document.body.addEventListener('keyup', this.keyup.bind(this));
    },
    whenPress: function(key, callback) {
        this.on('keyPress', function(code) {
            if (key === code) {
                callback();
            }
        });
    },
    keydown: function(ev) {
        var code = ev.keyCode;
        if (!this.keys[code]) {
            this.trigger('keyPress', code);
            this.keysPressed++;
        }
        this.keys[code] = true;
    },
    keyup: function(ev) {
        var code = ev.keyCode;
        this.keysPressed--;
        this.keys[code] = false;
    },
    isPressed: function(keyCode) {
        return this.keys[keyCode];
    },
    isCharacterPressed: function(char) {
        var code = char.toUpperCase().charCodeAt(0);
        return this.isPressed(code);
    },
    clear: function() {
        this.off('keyPress');
    }
};