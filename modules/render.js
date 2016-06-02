'use strict';

const pug = SYS.node('pug');
const fs = SYS.node('fs');

module.exports = {

  view: function(item, mode) {
    item.mode = mode;
    item.filename = this.file(item);

    var content = this.content(item);

    return pug.render(content, item);
  },

  file: function(item) {
    return (SYS.base + 'tpl/' + item.type + '/' + item.mode + '.pug').toLowerCase();
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