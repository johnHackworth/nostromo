window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var ship = function(options) {
        pixEngine.utils.extend.call(this, window.boot.models.Boat, true, options);
    };
    ship.prototype = {
        type: 'ship',
        assets: {
            layout: 'assets/vehicles/ship.png'
        },

    };

    window.boot.models.ship = ship;
} )();