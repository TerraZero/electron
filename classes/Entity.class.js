'use strict';

var render = sys.module('render');

module.exports = class Entity {

  constructor() {
    this.type = 'Entity';
    this.id = null;
    this.fields = {};
  }

  isSave() {
    return this.id != null;
  }

  view(mode) {
    return render.view(this, mode);
  }

}