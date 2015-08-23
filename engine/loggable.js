window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.Loggable = function(size) {
  this.logElements = [];
  this.logSize = size || 50;
};

window.pixEngine.utils.Loggable.prototype = {
  log: function(text, type) {
    type = type || 'normal';
    this.logElements.push({
      time: this.counter,
      type: type,
      text: text
    });
    if (this.logElements.length > this.logSize) {
      this.logElements.shift();
    }
  },
  getLog: function() {
    return this.logElements;
  }
};