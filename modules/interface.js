'use strict';

const Module = SYS.use('!Module');
const $ = SYS.get('jquery');

module.exports = class Interface extends Module {

  replace(selector, content) {
    var container = $(selector).addClass('loading');

    container.html(content);
    container.removeClass('loading');
  }

};