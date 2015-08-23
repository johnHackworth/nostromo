window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

( function() {
    var vehicle = function(options) {
        pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
        this.options = options;
        if (options.player) {
            this.player = options.player;
            this.sector = this.player.sector;
        }
    };
    vehicle.prototype = {
        type: 'vehicle',
        assets: [],
        init: function() {},
        addCurrentSector: function(sector) {
            this.sector = sector;
        },
        removeCurrentSector: function() {
            this.sector = null;
        },
        hitBy: function(projectile, zone) {
            var damage = Math.randInt(projectile.explosiveAmount);
            this.hullStrength -= damage;
            this.hitZone = zone;
        }
    };

    window.boot.models.Vehicle = vehicle;
} )();