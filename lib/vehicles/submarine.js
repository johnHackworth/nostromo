window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var ship = function(options) {
        pixEngine.utils.extend.call(this, window.boot.models.Boat, true, options);
    };
    ship.prototype = {
        type: 'ship',
        assets: {
            layout: 'assets/vehicles/sub1.png'
        },
        applyRedLighting: function() {
            for (var i in this.layout.rooms) {
                for (var j in this.layout.rooms[i]) {
                    if (this.layout.rooms[i][j]) {
                        this.layout.rooms[i][j].applyRedLighting();
                    }
                }
            }
        },
        applyWhiteLighting: function() {
            for (var i in this.layout.rooms) {
                for (var j in this.layout.rooms[i]) {
                    if (this.layout.rooms[i][j]) {
                        this.layout.rooms[i][j].applyWhiteLighting();
                    }
                }
            }
        }
    };

    window.boot.models.ship = ship;
} )();