window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.init(options);
  };
  room.prototype = {
    isExterior: true,
    positionAmount: 3,
    type: 'deckGun',
    positionCorrection: -15,
    assets: {
      background: 'assets/rooms/deckGun.png'
    },

  };

  window.boot.models.DeckGunRoom = room;
})();