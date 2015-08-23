window.pixEngine = window.pixEngine || {};
window.pixEngine.utils = window.pixEngine.utils || {};

window.pixEngine.utils.Viewported = function() {
};

window.pixEngine.utils.Viewported.prototype = {

  baseUITick: function(counter) {
    this.view.x = this.stage.viewport.getX(this.x);
    this.view.y = this.stage.viewport.getY(this.y);
    this.stage.viewport.hideIfNotInViewPort(this.view);
  },
  uiTick: function(counter) {
    this.baseUITick(counter);
  }
}
