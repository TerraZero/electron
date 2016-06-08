'use strict';

const render = SYS.module('render');
const $ = SYS.get('jquery');

module.exports = class Runner {

  static root() {
    return new Runner().element($('#root'));
  }

  constructor(selector = null, context) {
    this._element = null;
    this._context = null;

    this.context(context);
    if (selector) {
      this.select(selector, context);
    }
  }

  context(context = null) {
    if (context) {
      if (SYS.is(context, Runner)) {
        this._context = context.context();
      } else {
        this._context = context;
      }
      return this;
    }
    return this._context;
  }

  select(selector, context = null) {
    context = context || this._context;
    this._element = $(selector, context);
    return this;
  }

  element(element) {
    this._element = element;
    return this;
  }

  setLayout(name, id) {
    this._element.html(render.layout(name, id));
    return this;
  }

  region(name, content) {
    $('> .layout-wrapper > .layout-region.layout-' + name, this._element).html(content);
    return this;
  }

}