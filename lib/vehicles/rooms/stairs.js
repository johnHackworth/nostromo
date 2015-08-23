window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var room = function(options) {
        pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
        this.init(options);
    };
    room.prototype = {
        hasStairs: true,
        positionAmount: 1,
        type: 'stairs',
        assets: {
            backgrounds: [
                'assets/rooms/hatchStairs.png',
                'assets/rooms/hatchStairs2.png',
                'assets/rooms/hatchStairs3.png'
            ]
        },
        getPosition: function(person, next) {
            var size = {
                x: person.viewWidth ? person.viewWidth / 2 : 0,
                y: person.viewHeight || 0
            };
            if (next && next.length > 0) {
                return {
                    x: this.viewX + Math.floor(this.roomWidth / 2),
                    y: this.viewY + this.roomHeight - size.y
                };
            }
            return {
                x: this.viewX + Math.floor(this.roomWidth / 2) - 20,
                y: this.viewY + this.roomHeight - size.y
            };
        },

    };

    window.boot.models.StairsRoom = room;
} )();