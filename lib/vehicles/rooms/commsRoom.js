window.boot = window.boot || {};
window.boot.models = window.boot.models || {};

(function() {
  var room = function(options) {
    pixEngine.utils.extend.call(this, window.boot.models.Room, true, options);
    this.init(options);
  };
  room.prototype = {
    positionAmount: 2,
    hasStairs: true,
    type: 'controlRoom',
    assets: {
      background: 'assets/rooms/commsRoom.png'
    },
    getPosition: function(person, next) {
      var size = {
        x: person.viewWidth ? person.viewWidth / 2 : 0,
        y: person.viewHeight || 0
      };

      var xPosition = 0;
      if (this.people.indexOf(person) === 0 && person.view && this.view && person.view.y >= this.view.y) {
        xPosition = this.viewX + 15;
      } else if (this.people.indexOf(person) === 1 && person.view && this.view && person.view.y >= this.view.y) {
        xPosition = this.viewX + 80;
      } else {
        xPosition = Math.floor(this.viewX + this.roomWidth / 2) - 5;
      }
      return {
        x: xPosition,
        y: this.viewY + this.roomHeight - size.y
      };
    },

  };

  window.boot.models.CommsRoom = room;
})();