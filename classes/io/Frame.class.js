'use strict';

const render = SYS.module('render');
const $ = SYS.get('jquery');
const Stream = SYS.use('stream/Stream');
const Element = SYS.use('io/Element');

module.exports = class Frame extends Element {

  constructor(name) {
    super();
    this._name = name;

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

    if (SYS.isStream(content)) {
      var that = this;

      content.pipe(function(vars) {
        $('> .frame-region.frame-' + name, that.element()).html(vars.output);
      });
    } else {
      $('> .frame-region.frame-' + name, this.element()).html(content);
    }
    return this;
  }

}