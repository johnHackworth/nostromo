window.pixEngine = window.pixEngine || {};

(function() {
  var mouse = function(w, h, container) {
    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    if (!container) {
      container = document.getElementsByTagName('canvas')[0];
    }
    var self = this;
    var type = '';
    var eventPrefix = '';
    var originX = 0;
    var originY = 0;
    if (container.pixiStage) {
      type = 'pixi';
      this.element = new PIXI.Graphics();
      this.element.hitArea = new PIXI.Rectangle(0, 0, w, h);
      this.element.interactive = true;
      container.addVisualEntity(this.element);
    } else {
      eventPrefix = 'on';
      type = 'canvas';
      this.element = container;
    }
    this.element.lastClick = new Date();

    var prefix = function(event) {
      if (eventPrefix) {
        return eventPrefix + event.charAt(0).toUpperCase() + event.slice(1);
      } else {
        return event;
      }
    }
    this.element['click'] = function(mousedata) {
      self.trigger('click', mousedata);
      var now = new Date();
      if (now - self.lastClick < 300) {
        self.trigger('dblClick', mousedata);
      }
      self.lastClick = now;
    }
    if (type === 'canvas') {
      this.element.addEventListener('click', this.element.click);
    }
    this.element['mousedown'] = function(mousedata) {
      self.clicking = true;
      self.originY = mousedata.y;
      self.originX = mousedata.x;
    }
    if (type === 'canvas') {
      this.element.addEventListener('mousedown', this.element.mousedown);
    }
    this.element['mouseup'] = function(mousedata) {
      self.clicking = false;
    }
    if (type === 'canvas') {
      this.element.addEventListener('mouseup', this.element.mouseup);
    }
    this.element['mousemove'] = function(mousedata) {
      if (self.clicking) {
        var x = mousedata.x;
        var y = mousedata.y;

        self.trigger('clickAndMove', {
          x: x,
          y: y,
          origX: self.originX,
          origY: self.originY
        })
        self.originX = x;
        self.originY = y;
      }
    }
    if (type === 'canvas') {
      this.element.addEventListener('mousemove', this.element.mousemove);
    }
  }

  window.pixEngine.Mouse = mouse;
})()