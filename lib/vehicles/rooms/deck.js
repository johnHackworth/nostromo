window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.init(options);
  };
  room.prototype = {
    isExterior: true,
    positionAmount: 5,
    type: 'deck',
    assets: {
      background: 'assets/rooms/deck.png'
    },

  };

  window.boot.models.DeckRoom = room;
})();