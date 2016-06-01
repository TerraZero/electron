'use strict';

var pug = sys.node('pug');
var fs = sys.node('fs');

module.exports = {

  view: function(item, mode) {
    item.mode = mode;
    item.filename = this.file(item);

    var content = this.content(item);

    return pug.render(content, item);
  },

  file: function(item) {
    return sys.base + 'tpl/' + item.type + '/' + item.mode + '.pug';
  },

  content: function(item, include) {
    include = include || true;
    var content = fs.readFileSync(item.filename).toString();

    if (include) {
      content = 'include ../functions.pug \n' + content;
    }

    return content;
  },

};