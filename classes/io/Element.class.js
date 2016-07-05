'use strict';

const Arrays = SYS.module('arrays');
const Render = SYS.module('render');

module.exports = class Element {

  constructor() {
    this._tag = 'div';
    this._content = null;
    this._attributes = {};
    this._tpl = null;
    this._childs = [];
  }

  setgetAttr(attr, variable) {
    if (ISDEF(variable)) {
      this.setAttr(attr, variable);
      return this;
    } else {
      return this.getAttr(attr);
    }
  }

  tpl(tpl) {
    if (ISDEF(tpl)) {
      this._tpl = tpl;
      return this;
    } else {
      return this._tpl || 'element/default';
    }
  }

  tag(tag) {
    return SETGET(this, tag, '_tag');
  }

  addAttr(attr) {
    this._attributes[attr] = this._attributes[attr] || [];
    var values = SYS.args(arguments, 1);

    for (var i in values) {
      this._attributes[attr].push(values[i]);
    }
    return this;
  }

  removeAttr(attr) {
    if (!this._attributes[attr]) return this;
    var values = SYS.args(arguments, 1);

    if (values.length == 0) {
      delete this._attributes[attr];
      return this;
    }

    this._attributes[attr] = Arrays.remove(this._attributes[attr], values);
    if (this._attributes[attr].length == 0) {
      delete this._attributes[attr];
    }
    return this;
  }

  setAttr(attr, attributes) {
    if (attributes == null) {
      this.removeAttr(attr);
      return this;
    }

    this._attributes[attr] = attributes;
    return this;
  }

  getAttr(attr) {
    return this._attributes[attr] || null;
  }

  hasAttr(attr) {
    return this.getAttr(attr) != null;
  }

  childs(childs) {
    return SETGET(this, childs, '_childs');
  }

  addChild(child) {
    this._childs.push(child);
    return this;
  }

  removeChild(child) {
    Arrays.remove(this._childs, child);
    return this;
  }

  content(content) {
    return SETGET(this, content, '_content');
  }

  addClass() {
    var args = SYS.args(arguments);

    args.unshift('class');
    return this.addAttr.apply(this, args);
  }

  removeClass() {
    var args = SYS.args(arguments);

    args.unshift('class');
    return this.removeAttr.apply(this, args);
  }

  classes() {
    return this.getAttr('class');
  }

  render() {
    return Render.renderTpl(this.tpl(), this.renderVars());
  }

  renderVars() {
    var vars = {
      tag: this.tag(),
      attr: this._attributes,
      childs: [],
      content: this.content(),
    };

    var childs = this.childs();
    for (var index in childs) {
      vars.childs.push(childs[index].render());
    }
    return vars;
  }

}