'use strict';

const Render = SYS.route('render');

/**
  * @Interface("VueElement")
  */
module.exports = class VueElement {

  static load(id) {
    SYS.throw('AbstractError', 'method', 'load', 'VueElement');
  }

  static vue(type, id) {
    SYS.throw('AbstractError', 'method', 'vue', 'VueElement');
  }

  static render(template, data) {
    return Render.render(template, data);
  }

  loadID() {
    SYS.throw('AbstractError', 'method', 'loadID', this);
  }

  view() {
    SYS.throw('AbstractError', 'method', 'view', this);
  }

  render(mode) {
    var view = this.view();

    view.vue = this.loadID();
    return SYS.route('render').render(mode, view);
  }

};