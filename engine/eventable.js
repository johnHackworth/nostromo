window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.Eventable = function() {
  this.subscriptions = {};
};

window.pixEngine.utils.Eventable.prototype = {
  on: function(event, callback) {
    if(!this.subscriptions[event]) {
      this.subscriptions[event] = [callback];
      return 0;
    } else {
      this.subscriptions[event].push(callback);
      return this.subscriptions[event].length -1;
    }
  },
  off: function(event, id) {
    if(id) {
      this.subscriptions[event][id] = null;
    } else {
      this.subscriptions[event] = [];
    }
  },
  trigger: function(event, params) {
    for(var n in this.subscriptions[event]) {
      if(this.subscriptions[event][n]) {
        this.subscriptions[event][n](params);
      }
    }
  }
}
