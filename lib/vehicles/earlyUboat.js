window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var ship = function(options) {
        pixEngine.utils.extend.call(this, window.boot.models.ship, true, options);
    };
    ship.prototype = {
        sinkingSpeed: 5,
        maxSpeed: 90,
        maxSpeedUnderwater: 50,
        topRoom: -140,
        leftRoom: -600 + Math.floor(boot.config.width / 2),
        assets: {
            layout: 'assets/vehicles/sub1.png'
        },
        layoutMap: [{
            rooms: [
                {
                    type: 'stairs',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, null, null, null, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'stairs',
                    doors: ['down', 'right'],
                    open: true
                }
            ]
        }, {
            rooms: [
                {
                    type: 'stairs',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'stairs',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, null, {
                    type: 'stairs',
                    doors: ['left'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'stairs',
                    doors: ['down', 'right'],
                    open: true
                }
            ]
        }, {
            rooms: [{
                type: 'empty',
                doors: ['left', 'right'],
                open: false
            }, {
                type: 'stairs',
                doors: ['left', 'right'],
                open: false
            }, {
                type: 'empty',
                doors: ['left', 'right'],
                open: false
            }, {
                type: 'empty',
                doors: ['left', 'right'],
                open: false
            }, {
                type: 'stairs',
                doors: ['left', 'right'],
                open: false
            }, {
                type: 'empty',
                doors: ['left'],
                open: false
            }]
        }, {
            rooms: [
                null, {
                    type: 'stairs',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'stairs',
                    doors: ['down', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }
            ]
        }, {
            rooms: [
                null, {
                    type: 'stairs',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'stairs',
                    doors: ['down', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }
            ]
        }, {
            rooms: [
                null, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }, {
                    type: 'stairs',
                    doors: ['down', 'right'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left'],
                    open: true
                }, {
                    type: 'empty',
                    doors: ['left', 'right'],
                    open: true
                }
            ]
        },],
        getRooms: function() {
            var rooms = [];
            for (var i in this.layout.rooms) {
                for (var j in this.layout.rooms[i]) {
                    if (this.layout.rooms[i][j]) {
                        rooms.push(this.layout.rooms[i][j]);
                    }
                }
            }
            return rooms;
        }
    };
    window.boot.models.EarlyUboat = ship;
} )();