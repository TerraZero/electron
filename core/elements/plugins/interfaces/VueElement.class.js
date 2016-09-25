'use strict';

const Render = use('render');

/**
  * @Interface("VueElement")
  */
module.exports = class VueElement {

  static view() {
    return this.render.apply(this, TOOLS.args(arguments));
  }

  static vue(stream) {
    throw err('AbstractError', this, 'vue');
  }

  static renderID() {
    throw err('AbstractError', this, 'renderID');
  }

  static renderTemplate() {
    throw err('AbstractError', this, 'renderTemplates');
  }

  static renderData() {
    return {};
  }

  static render() {
    const args = TOOLS.args(arguments);
    const data = this.renderData.apply(this, args);

    data.vue = this.renderID.apply(this, args);
    data.template = this.renderTemplate.apply(this, args);
    return Render.render(data.template, data);
  }

  view() {
    throw err('AbstractError', this, 'view');
  }

};