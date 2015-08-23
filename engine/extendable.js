window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.extend = function(object, keepExisting, options, debug) {

  for (var n in object.prototype) {
    if (!keepExisting) {
      if (debug) console.log('not existing', n, object.prototype[n]);
      this[n] = object.prototype[n];
    } else if (typeof this[n] === 'undefined') {
      if (debug) console.log('existing', n, object.prototype[n]);
      this[n] = object.prototype[n];
    }
  }
  object.call(this, options);
};