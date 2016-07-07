'use strict';

const Arrays = SYS.module('arrays');
const Render = SYS.module('render');
const $ = SYS.get('jquery');

module.exports = class Element {

  constructor(element) {
    this._tag = 'div';
    this._content = null;
    this._attributes = {};
    this._tpl = null;
    this._childs = [];
    this._element = null;

    this.setElement(element);
  }

  setElement(element) {
    return SETGET(this, element, '_element');
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
    if (this._element) {
      SYS.context(this, 'tpl', 'Tpl can not read or write while element is in dom!').error();
    }
    if (ISDEF(tpl)) {
      this._tpl = tpl;
      return this;
    } else {
      return this._tpl || 'element/default';
    }
  }

  tag(tag) {
    if (!this._element) {
      return SETGET(this, tag, '_tag');
    }

    if (tag) {
      this._element.prop('tagName', tag);
      return this;
    } else {
      return this._element.prop('tagName');
    }
  }

  addAttr(attr) {
    var values = SYS.args(arguments, 1);

    if (this._element) {
      this._element.attr(attr, this._element.attr(attr) + ' ' + values.join(' '));
      return this;
    }

    this._attributes[attr] = this._attributes[attr] || [];

    for (var i in values) {
      this._attributes[attr].push(values[i]);
    }
    return this;
  }

  removeAttr(attr) {
    var values = SYS.args(arguments, 1);

    if (this._element) {
      var attrs = this.getAttr(attr);

      if (values.length == 0) {
        this._element.removeAttr(attr);
        return this;
      }

      attrs = Arrays.remove(attrs, values);
      this._element.attr(attr, attrs.join(' '));
      return this;
    }

    if (!this._attributes[attr]) return this;

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
    if (this._element) {
      this._element.attr(attr, attributes.join(' '));
      return this;
    }

    if (attributes == null) {
      this.removeAttr(attr);
      return this;
    }

    this._attributes[attr] = attributes;
    return this;
  }

  getAttr(attr) {
    if (!this._element) {
      return this._attributes[attr] || null;
    }
    return this._element.attr(attr).split('/\s/');
  }

  hasAttr(attr) {
    if (!this._element) {
      return this.getAttr(attr) != null;
    }
    var a = this._element.attr(attr);
    return typeof a !== typeof undefined && a !== false;
  }

  addChild(child) {
    if (!this._element) {
      this._childs.push(child);
      return this;
    }
    this._element.append(child.render());
  }

  content(content) {
    if (!this._element) {
      return SETGET(this, content, '_content');
    }
    if (ISDEF(content)) {
      this._element.html(content);
      return this;
    } else {
      return this._element.html();
    }
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
    if (!this._element) {
      return this.getAttr('class');
    }
    return this._element.attr('class').split('/\s/');
  }

  render() {
    if (!this._element) {
      this._element = $(Render.renderTpl(this.tpl(), this.renderVars()));
    }
    return this._element;
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