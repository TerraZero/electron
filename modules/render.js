'use strict';

const Module = SYS.use('!Module');
const pug = SYS.node('pug');
const fs = SYS.node('fs');

module.exports = class Render extends Module {

  view(item, mode) {
    item._mode = mode;
    item._filename = this.file(item);

    var content = this.content(item);

    return pug.render(content, item);
  }

  file(item) {
    return (SYS.base + 'tpl/' + item.type() + '/' + item._mode + '.pug').toLowerCase();
  }

  content(item, include) {
    include = include || true;
    var content = fs.readFileSync(item._filename).toString();

    if (include) {
      content = 'include ../functions.pug \n' + content;
    }

    return content;
  }

};