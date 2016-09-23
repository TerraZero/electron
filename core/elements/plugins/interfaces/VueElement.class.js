'use strict';

const Render = use('render');

/**
  * @Interface("VueElement")
  */
module.exports = class VueElement {

  static load(id) {
    throw err('AbstractError', this, 'load');
  }

  static vue(type, id) {
    throw err('AbstractError', this, 'vue');
  }

  static render(template, data) {
    return Render.render(template, data);
  }

  loadID() {
    throw err('AbstractError', this, 'loadID');
  }

  view() {
    throw err('AbstractError', this, 'view');
  }

  render(mode) {
    var view = this.view();

    view.vue = this.loadID();
    return use('render').render(mode, view);
  }

};