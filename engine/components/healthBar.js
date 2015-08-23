window.pixEngine = window.pixEngine || {};
window.pixEngine.components = window.pixEngine.components || {};

window.pixEngine.components.HealthBar = function(options) {
  this.posX = options.x;
  this.posY = options.y;
  this.width = options.width;
  this.height = options.height;
  this.attr = options.attribute;
  this.origin = options.origin;
  this.stage = options.stage;
  this.color = options.color || 0x55CC88;
  this.alwaysVisible = options.alwaysVisible;
  this.alwaysHidden = false;
  this.initHealthBar(options);
};

window.pixEngine.components.HealthBar.prototype = {

  initHealthBar: function(options) {
    if (options.container) {
      this.container = options.container;
      this.background = this.stage.addBackgroundToContainer(options.container, this.posX, this.posY, this.width, this.height, 0x111111, 1);
      this.progress = this.stage.addBackgroundToContainer(options.container, this.posX, this.posY, this.width, this.height, this.color, 1);
    } else {
      this.background = this.stage.addBackground(this.posX, this.posY, this.width, this.height, 0x111111, 1);
      this.progress = this.stage.addBackground(this.posX, this.posY, this.width, this.height, this.color, 1);
    }
    if (!this.alwaysVisible) {
      this.background.visible = false;
      this.progress.visible = false;
      this.visible = false;
    }
    this.updateHealthBar();
  },
  setHealthBarVisibility: function(value) {
    if (this.visible === value || this.alwaysVisible) {
      return;
    }
    if (this.alwaysHidden) {
      value = false;
    }
    this.visible = value;
    this.background.visible = value;
    this.progress.visible = value;
  },
  clear: function() {
    if (this.container) {
      this.container.removeChild(this.background);
      this.container.removeChild(this.progress);
    } else {
      this.stage.removeView(this.background);
      this.stage.removeView(this.progress);
    }
  },
  updateHealthBar: function() {
    var width = null;
    if (this.value != this.origin[this.attr]) {
      this.value = this.origin[this.attr];
      if (this.value < 100) {

        width = Math.floor(this.width * this.value / 100);
        width = width > 0 ? width : 1;
        this.clear();
        if (this.container) {
          this.background = this.stage.addBackgroundToContainer(this.container, this.posX, this.posY, this.width, this.height, 0x111111, 1);
          this.progress = this.stage.addBackgroundToContainer(this.container, this.posX, this.posY, width, this.height, this.color, 1);
        } else {
          this.background = this.stage.addBackground(this.posX, this.posY, width, this.height, 0x111111, 1);
          this.progress = this.stage.addBackground(this.posX, this.posY, width, this.height, this.getBarColor(), 1);
        }
        this.setHealthBarVisibility(true);
      } else {
        this.setHealthBarVisibility(false);
      }
    }
  },
  getBarColor: function() {
    if (this.color != 0x55CC88) {
      return this.color;
    }
    var redPercentage = Math.floor(255 * (1 - this.origin[this.attr] / 100)).toString(16);
    var greenPercentage = Math.floor(255 * (this.origin[this.attr] / 100)).toString(16);
    return 1 * ('0x' + redPercentage + greenPercentage + '00');
  },
  hide: function() {
    this.alwaysHidden = true;
    this.setHealthBarVisibility(false);
  }
};