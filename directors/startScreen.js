window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.startStage = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
};


window.boot.stages.startStage.prototype = {
    assets: [
        'assets/vehicles/ship.png',
        'assets/sounds/bso.ogg'
    ],
    init: function(options) {
        window.boot.currentStage = new pixEngine.Stage({
            fps: null,
            width: window.boot.config.width,
            height: window.boot.config.height,
            assets: [
                'assets/people/hair.sheet.png',
                'assets/people/head.sheet.png',
                'assets/people/person.sheet.png',
                'assets/people/xeno.png',
                'assets/rooms/hatchStairs.png',
                'assets/rooms/hatchStairs2.png',
                'assets/rooms/hatchStairs3.png',
                'assets/rooms/room.png',
                'assets/rooms/room2.png',
                'assets/rooms/room3.png',
                'assets/rooms/room4.png',
                'assets/rooms/room5.png',
                'assets/rooms/room6.png',
                'assets/rooms/room7.png',
                'assets/rooms/room8.png',
                'assets/rooms/room9.png',
                'assets/rooms/lighting.png'
            ],
            init: function(stage) {
                var self = this;
                setTimeout(function() {
                    boot.mainDirector.startBoatView();
                }, 500);
            }
        });
        window.boot.currentStage.init();
    },

};