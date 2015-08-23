window.pixEngine = window.pixEngine || {};
pixEngine.Viewport = function(options) {
  this.maxX = options.maxX;
  this.maxY = options.maxY;
  this.minX = options.minX;
  this.minY = options.minY;
  this.width = options.width;
  this.height = options.height;
  this.keyManager = options.keyManager;
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.mouseTrack = options.mouseTrack;
  this.target = [this.x, this.y];
};
pixEngine.Viewport.prototype = {
  _KEY_DISPLACEMENT: 10,
  getX: function(x) {
    return -1 * this.x + x + Math.floor(this.width / 2);
  },
  getY: function(y) {
    return -1 * this.y + y + Math.floor(this.height / 2);
  },
  getGraphicsX: function() {
    return -1 * (this.x) + this.width / 2;
  },
  getGraphicsY: function() {
    return -1 * (this.y) + this.height / 2;
  },
  panTo: function(x, y, panAmount) {
    this.panAmount = panAmount;
    this.target = [x, y];
  },
  isInsideViewPort: function(entity) {
    var x = (entity.x || entity.position.x || 1);
    var y = (entity.y || entity.position.y || 1);
    if (x + entity.width < 0 ||
      x > this.width ||
      y + entity.height < 0 ||
      y > this.height
    ) {
      return false;
    }
    return true;
  },
  hideIfNotInViewPort: function(entity) {
    if (this.isInsideViewPort(entity)) {
      if (!entity.hidden) {
        entity.visible = true;
      }
    } else {
      entity.visible = false;
    }
  },
  tick: function() {
    var difference = null;
    this.manageKeyPress();
    if (this.target[0] != this.x) {
      var orientationX = Math.abs(this.target[0] - this.x) / (this.target[0] - this.x);
      difference = Math.abs(this.x - this.target[0]);
      if (difference > this.panAmount) {
        difference = this.panAmount;
      }
      this.x += orientationX * difference;
    }
    if (this.target[1] != this.y) {
      var orientationY = Math.abs(this.target[1] - this.y) / (this.target[1] - this.y);
      difference = Math.abs(this.y - this.target[1]);
      if (difference > this.panAmount) {
        difference = this.panAmount;
      }
      this.y += orientationY * difference;
    }
  },
  trackMouse: function() {
    this.mouseTracker = new pixEngine.Mouse();
    this.mouseTracker.on('clickAndMove', this.trackMouseMovement.bind(this));
    this.mouseTracker.on('dblClick', this.panToMouse.bind(this));
  },
  trackMouseMovement: function(data) {
    this.panAmount = 100;
    this.target[0] += data.origX - data.x;
    this.target[1] += data.origY - data.y;
  },
  panToMouse: function(data) {
    var centerX = Math.floor(this.width / 2);
    var centerY = Math.floor(this.height / 2);
    var panX = centerX - data.x;
    var panY = centerY - data.y;

    this.panTo(this.target[0] - panX, this.target[1] - panY, 5);
  },
  manageKeyPress: function() {
    if (this.keyManager.isCharacterPressed('a') ||
      this.keyManager.isPressed(this.keyManager.LEFT_CURSOR)
    ) {
      this.target[0] -= this._KEY_DISPLACEMENT;
    }
    if (this.keyManager.isCharacterPressed('d') ||
      this.keyManager.isPressed(this.keyManager.RIGHT_CURSOR)) {
      this.target[0] += this._KEY_DISPLACEMENT;
    }
    if (this.keyManager.isCharacterPressed('w') ||
      this.keyManager.isPressed(this.keyManager.UP_CURSOR)) {
      this.target[1] -= this._KEY_DISPLACEMENT;
    }
    if (this.keyManager.isCharacterPressed('s') ||
      this.keyManager.isPressed(this.keyManager.DOWN_CURSOR)) {
      this.target[1] += this._KEY_DISPLACEMENT;
    }
  }
};