window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.bootStage = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
};


window.boot.stages.bootStage.prototype = {
    init: function(options) {
        if (window.boot.currentStage) {
            window.boot.currentStage.destroy();
        } else {
            window.boot.currentStage = new pixEngine.Stage({
                fps: null,
                width: window.boot.config.width,
                height: window.boot.config.height,
                assets: [
                    'assets/vehicles/warship1.png',
                    'assets/vehicles/sub1.png'
                ],
                init: function(stage) {
                    var self = this;

                    // document.getElementById('loader').remove();
                }
            });
            window.boot.currentStage.init();
        }
        window.boot.currentStage.initHud = function(options) {


            this.sound = new Howl({
                urls: ['assets/sounds/bso.mp3', 'assets/sounds/bso.ogg', 'assets/sounds/bso.wav'],
                autoplay: true,
                loop: true,
                volume: 0.5,
            });

            this.sound.play();

            this.sector = options.sector;
            this.firstAmbient = null;
            this.playerBoat = options.world.playerBoat;
            this.addNotVisualEntity(this.playerBoat);

            this.world = options.world;
            this.hudLayout = new window.boot.ui.HudLayout({
                stage: this,
                world: this.world,
                sector: this.sector,
                assault: options.assault
            });

        };

    }
};