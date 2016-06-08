'use strict';

const render = SYS.module('render');
const $ = SYS.get('jquery');

module.exports = class Frame {

  static root() {
    var frame = new Frame('root');
    if (frame.isNew()) frame.attach($('#root'));
    return frame;
  }

  static renderFrame(name, id) {
    return render.execute(render.path('frame', name), {id: id, name: name});
  }

  constructor(name) {
    this._name = name;
    this._element = null;
    this._new = true;

    this.init();
  }

  init() {
    var search = $('.frame-id-' + this.name());

    if (search.length) {
      this._element = search;
      this._new = false;
    }
  }

  name() {
    return this._name;
  }

  isNew() {
    return this._new;
  }

  element() {
    return this._element;
  }

  attach(element) {
    if (!this.isNew()) SYS.context(this, 'attach', 'Frame is not new! Only attach new Frame to elements!').error();

    element.addClass('frame frame-id-' + this.name());
    this._element = element;
    this._new = false;
    return this;
  }

  setLayout(name, id) {
    if (this.isNew()) SYS.context(this, 'setLayout', 'Frame is not attached! Change only layout of attached frames!').error();

    this._element.html(Frame.renderFrame(name, id));
    return this;
  }

  region(name, content) {
    if (this.isNew()) SYS.context(this, 'region', 'Frame is not attached! Change only region content of attached frames!').error();

    $('> .frame-region.frame-' + name, this.element()).html(content);
    return this;
  }

}