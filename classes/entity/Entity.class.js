'use strict';

const render = SYS.module('render');

module.exports = class Entity {

  constructor() {
    this.type = 'Entity';
    this.id = null;
    this.fields = {};
  }

  controller() {
    return null;
  }

  isSave() {
    return this.id != null;
  }

  view(mode) {
    return render.view(this, mode);
  }

}