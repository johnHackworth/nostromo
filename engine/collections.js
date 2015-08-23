Object.defineProperty(Array.prototype, "removeElement", {
  value: function(element) {
    var found = [];
    var i = this.length;
    while (i) {
      if (this[i - 1] === element) {
        found.push(i - 1);
      }
      i--;
    }
    for (var j = 0, l = found.length; j < l; j++) {
      this.splice(found[j], 1);
    }
    return;
  },
  writable: false,
  enumerable: false,
  configurable: true
});

Object.defineProperty(Array.prototype, "lookFor", {
  value: function(property, value) {
    var i = this.length;
    while (i) {
      if (this[i - 1][property] === value) {
        return this[i - 1];
      }
      i--;
    }
    return;
  },
  writable: false,
  enumerable: false,
  configurable: true
});

Object.defineProperty(Array.prototype, "getRandom", {
  value: function(property, value) {
    var i = this.length;
    if (!i) {
      return null;
    }
    return this[Math.floor(Math.random() * i)];
  },
  writable: false,
  enumerable: false,
  configurable: true
});

Object.defineProperty(Array.prototype, "getLast", {
  value: function(property, value) {
    var i = this.length;
    if (!i) {
      return null;
    }
    return this[i - 1];
  },
  writable: false,
  enumerable: false,
  configurable: true
});