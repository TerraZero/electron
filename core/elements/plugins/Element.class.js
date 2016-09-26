'use strict';

const $ = use('lib.jquery');
const Vue = use('lib.vue');
const Stream = use('stream');

/**
  * @SysRoute(
  *   value="element",
  *   description="Master class for element."
  * )
  */
module.exports = class Element {

  static initRoute() {
    this._count = 0;
    this._register = {};
  }

  static getID() {
    return this._count++;
  }

  static init() {
    $('.vue:not(.e-inited)').each(this.eachVue);
  }

  static eachVue() {
    const element = new Element($(this).addClass('e-inited'));

    element.init();
    Element._register[element.loadID()] = element;
  }

  static element(id) {
    return this._register[id];
  }

  static getLoading(element) {
    const data = element.data('vue').split(':');

    return {
      route: data[0],
      func: data[1],
      args: TOOLS.args(data, 2),
      load: data.join(':'),
    };
  }

  constructor(element) {
    this._element = element;
    this._id = Element.getID();
    this._loading = null;
    this._object = null;
    this._vue = null;
  }

  init() {
    this._loading = Element.getLoading(this.element());

    new Stream(this)
      .pipe(this._loading.func, this._loading.route)
      .pipe(this.receiveData)
      .pipe(this.createVue)
      .executeArgs(this._loading.args);
  }

  receiveData(stream, object) {
    this._object = object;
    stream.next();
  }

  createVue(stream) {
    this.element().attr('id', 'v-' + this.id());
    const data = this.object().view();

    data.el = '#v-' + this.id();
    this._vue = new Vue(data);
    stream.next();
  }

  element() {
    return this._element;
  }

  loadID() {
    return this._loading.load;
  }

  id() {
    return this._id;
  }

  object() {
    return this._object;
  }

}
