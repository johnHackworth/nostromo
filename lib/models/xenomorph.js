window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

( function() {
    var xeno = function(options) {
        pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
        this.init(options);
    };
    xeno.prototype = {
        xeno: true,
        assets: boot.assets.person,
        speed: 5,
        damage: 60,
        health: 100,
        damageResitance: 1.5,
        init: function(options) {
            options = options || {};
        },
    };

    window.boot.dataModels.Xenomorph = xeno;
} )();