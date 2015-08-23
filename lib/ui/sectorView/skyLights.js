window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

( function() {
    var skyLights = function(options) {
        this.init(options);
    };
    skyLights.prototype = {
        width: boot.config.width,
        height: boot.config.height,
        init: function(options) {
            this.view = [];
            this.container = options.container;
            this.stage = options.stage;
            this.x = options.x || 0;
            this.originX = this.x;
            this.y = options.y;
            this.originY = this.y || 0;
            this.addStars();
        },
        addStars: function() {
            var stasts = new pixEngine.ParticleGenerator({
                stage: this.stage,
                container: this.container,
                type: 'pixelCircle',
                origin: {
                    x: this.originX + Math.floor(boot.config.width / 2),
                    y: this.originY + Math.floor(boot.config.height / 2)
                },
                randomOrigin: {
                    x: this.originX + boot.config.width,
                    y: this.originY + boot.config.height
                },
                colors: [0xFFFFFF, 0xFFFFEE, 0xEEFFFF],
                size: 1,
                randomSize: 2,
                speed: 0,
                duration: 500,
                direction: 0, // Math.PI + Math.random() * Math.PI,
                spread: 0,
                delayRandom: 20,
                amount: 200,
                randomAmount: 100,
                randomDuration: 45000,
                brittle: 0.99,
                gravity: -0.00000001,
                opacity: 0.7,
                randomOpacity: 0.3
            });
        },
    };

    window.boot.ui.SkyLights = skyLights;
} )();