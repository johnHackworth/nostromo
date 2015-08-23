window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

( function() {
    var hudLayout = function(options) {
        this.options = options || {};
        this.stage = options.stage;
        this.world = this.stage.world;
        this.sector = options.sector;
        this.init();
    };
    hudLayout.prototype = {
        init: function() {
            this.addPlayerBoat();
            this.addSeaView();
            this.isRaining();
        },
        addPlayerBoat: function() {
            this.playerView = new window.boot.ui.ShipView({
                stage: this.stage,
                sector: this.sector,
                world: this.world,
                assault: this.options.assault
            });
        },
        addSeaView: function() {},
        isRaining: function() {}
    };
    window.boot.ui.HudLayout = hudLayout;
} )();