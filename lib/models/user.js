window.boot = window.boot || {};
window.boot.dataModels = window.boot.dataModels || {};

(function() {
  var user = function(options) {};
  user.prototype = {
    reputation: 0,
    influence: 0
  };

  window.boot.dataModels.User = user;
})();