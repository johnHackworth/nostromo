window.boot = window.boot || {};
window.boot.stages = window.boot.stages || {};

window.boot.stages.startStage = function(options) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.options = options;
};


window.boot.stages.startStage.prototype = {
    init: function(options) {
        window.boot.currentStage = new pixEngine.Stage({
            fps: null,
            width: window.boot.config.width,
            height: window.boot.config.height,
            assets: [],
            init: function(stage) {
                var self = this;
                boot.mainDirector.startBoatView();
            }
        });
        window.boot.currentStage.init();
    },

};