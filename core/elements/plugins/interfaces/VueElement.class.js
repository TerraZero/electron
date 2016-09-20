'use strict';

/**
  * @Interface("VueElement")
  */
module.exports = class VueElement {

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