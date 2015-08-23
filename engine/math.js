Math.randInt = function(limit) {
  limit = typeof(limit) != 'undefined' ? limit : 100;
  return Math.floor(Math.random() * limit);
};

Math.aproximate = function(origin, destination, increment) {
  increment = increment || 1;
  var diference = origin - destination;
  if (diference > 0) {
    var diff1 = origin - increment;
    if (diff1 > destination) {
      return diff1;
    } else {
      return destination;
    }
  }
  if (diference < 0) {
    var diff2 = origin + increment;
    if (diff2 < destination) {
      return diff2;
    } else {
      return destination;
    }
  }
  return origin;
};