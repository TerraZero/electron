'use strict';

const $ = SYS.get('jquery');

module.exports = {

  replace: function(selector, content) {
    var container = $(selector).addClass('loading');

    container.html(content);
    container.removeClass('loading');
  },

};