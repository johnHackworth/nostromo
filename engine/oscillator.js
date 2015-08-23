window.pixEngine = window.pixEngine || {};

pixEngine.Oscillator = function(options) {
  this.stage = options.stage;
  this.width = options.width;
  this.color = options.color;
  this.particleWidth = options.particleWidth || 20;
  this.particleHeight = options.particleHeight || 20;
  this.origin = options.origin;
  this.originY = this.origin.y;
  this.oscillationHeight = options.oscillationHeight || 10;
  this.period = options.period || 10;
  this.after = options.after;
  this.before = options.before;
  this.container = options.container;
  this.init();
};
pixEngine.Oscillator.prototype = {
  init: function() {
    this.initParticles();
  },
  initParticles: function() {
    this.particleContainer = new PIXI.DisplayObjectContainer();
    this.view = [];
    var pointer = this.origin.x;
    var max = this.origin.x + this.width;
    while (pointer < max) {
      this.createParticle(pointer);
      pointer += this.particleWidth - Math.floor(this.particleWidth / 2);
    }

    this.stage.addNotVisualEntity(this);
    this.container.addChild(this.particleContainer);
  },
  createParticle: function(pointer) {
    var particle = new PIXI.Graphics();
    particle.clear();
    particle.beginFill(this.color);
    var center = {
      x: pointer - Math.floor(this.particleWidth / 2),
      y: this.origin.y + this.particleHeight / 2
    };
    this.createSquareParticle(particle);
    particle.aggregated = 0;
    particle.endFill();
    particle.viewType = 'particle';
    this.view.push(particle);
    this.particleContainer.addChild(particle);
    particle.x = center.x;
    particle.y = center.y;
  },
  createSquareParticle: function(particle) {
    var center = {
      x: 0,
      y: 0
    };
    particle.moveTo(center.x, center.y);
    particle.lineTo(center.x + this.particleWidth, center.y);
    particle.lineTo(center.x + this.particleWidth, center.y + this.particleHeight);
    particle.lineTo(center.x, center.y + this.particleHeight);
    particle.lineTo(center.x, center.y);
  },
  tick: function(counter) {
    if (counter % this.period === 0) {
      counter = counter / this.period;
      for (var l = this.view.length; l; l--) {
        this.view[l - 1].y = this.originY + Math.cos(counter + l) * this.oscillationHeight;
      }
    }
  },
  setInactive: function() {
    for (var l = this.view.length; l; l--) {
      this.view[l - 1].visible = false;
    }
  },
  setActive: function() {
    for (var l = this.view.length; l; l--) {
      this.view[l - 1].visible = true;
    }
  },
  moveTo: function(pos) {
    var pointer = pos.x;
    var max = pos.x + this.width;
    for (var i in this.view) {
      this.view[i].x = pointer;
      this.view[i].y = pos.y;
      pointer += this.particleWidth - Math.floor(this.particleWidth / 2);
    }
  }
};