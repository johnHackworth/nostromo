window.boot = window.boot || {};
window.boot.ui = window.boot.ui || {};

(function() {
  var button = function(options) {

    pixEngine.utils.extend.call(this, pixEngine.utils.Eventable);
    this.stage = options.stage;
    this.action = this.action || options.action;
    this.width = options.width || this.width;
    this.height = options.height || this.height;
    this.fontSize = options.fontSize || this.fontSize;
    this.x = options.x;
    this.y = options.y;
    this.marginY = options.marginY || this.marginY;
    this.container = options.container;
    this.text = options.text || this.text;
    this.baseTint = options.baseTint || this.baseTint;
    this.buttonImage = options.buttonImage || this.buttonImage;
    this.init();
  };
  button.prototype = {
    text: null,
    baseTint: 0xFFFFFF,
    overTint: 0xFFDDDD,
    fontName: 'specialElite',
    fontSize: '16px',
    width: 120,
    height: 30,
    marginX: 25,
    marginY: 6,
    fontColor: '#555555',
    buttonImage: '',
    init: function() {
      this.addButton();
    },
    clear: function() {
      if (this.button) {
        if (this.container) {
          this.container.removeChild(this.button);
        } else {
          this.stage.removeView(this.button);
        }
        this.button = null;
      }
      if (this.renderedText) {
        if (this.container) {
          this.container.removeChild(this.textContainer);
        } else {
          this.stage.removeView(this.textContainer);
        }
        this.renderedText = null;
      }
    },
    addButton: function() {
      this.clear();
      this.button = new PIXI.Sprite.fromImage(this.buttonImage);
      this.button.x = this.x;
      this.button.y = this.y;
      this.button.height = this.height;
      this.button.width = this.width;
      this.button.interactive = true;
      this.button.buttonMode = true;
      this.button.tint = this.baseTint;
      if (this.container) {
        this.container.addChild(this.button);
      } else {
        this.stage.addVisualEntity(this.button);
      }
      this.button.click = this.action.bind(this);
      this.button.tap = this.action.bind(this);
      this.button.mouseover = this.illuminateButton.bind(this);
      this.button.mouseout = this.obscureButton.bind(this);
      if (this.text) {
        this.addText();
      }
    },
    illuminateButton: function() {
      this.button.tint = this.overTint;
    },
    obscureButton: function() {
      this.button.tint = this.baseTint;
    },
    addText: function() {
      if (this.baseTint) {
        this.button.tint = this.baseTint;
      }
      this.textContainer = new PIXI.DisplayObjectContainer();
      this.renderedText = this.stage.addTextToContainer(this.textContainer,
        this.text, {
          x: this.x + this.width / 2,
          y: this.y + this.marginY,
          fontSize: this.fontSize,
          fontName: this.fontName,
          color: this.fontColor,
          centered: true
        });
      if (this.container) {
        this.container.addChild(this.textContainer);
      } else {
        this.stage.addVisualEntity(this.textContainer);
      }

    },
  };
  window.boot.ui.Button = button;
})();