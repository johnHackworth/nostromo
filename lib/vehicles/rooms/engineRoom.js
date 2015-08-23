window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.init(options);
  };
  room.prototype = {
    positionAmount: 4,
    type: 'engineRoom',
    assets: {
      background: 'assets/rooms/engine.png'
    },
  };

  window.boot.models.EngineRoom = room;
})();