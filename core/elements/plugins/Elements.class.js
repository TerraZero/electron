'use strict';

const $ = SYS.route('lib.jquery');
const Vue = SYS.route('lib.vue');

/**
  * @SysRoute(
  *   value="elements",
  *   description="Master class for elements."
  * )
  */
module.exports = class Elements {

  static initRoute() {
    this._count = 0;
  }

  static getID() {
    return this._count++;
  }

  static init() {
    $('.vue').each(this.eachVue);
  }

  static eachVue() {
    const element = $(this);
    const id = 'v-' + Elements.getID();
    var vue = Elements.vueData(element);

    element.attr('id', id);
    vue.el = '#' + id;
    new Vue(vue);
  }

  static vueData(element) {
    return Elements.load(element.data('vue'));
  }

  static load(string) {
    return Elements.loading.apply(Elements, string.split(':'));
  }

  static loading(route, func) {
    var args = TOOLS.args(arguments, 2);
    const loader = SYS.route(route);

    return loader[func].apply(loader, args);
  }

}