'use strict';

const Module = SYS.use('!Module');
const pug = SYS.node('pug');
const fs = SYS.node('fs');

module.exports = class Render extends Module {

  render(entity, mode, flush = false) {
    var viewed = entity._view[mode] != undefined;
    var rendered = viewed && entity._view[mode]._render != undefined;

    if (!viewed || !rendered || flush) {
      if (!viewed || flush) {
        this.view(entity, mode, flush);
      }
      entity._view[mode]._render = pug.render(entity._view[mode]._content, {entity: entity, mode: mode, flush: flush, filename: entity._view[mode]._filename});
    }
    return entity._view[mode]._render;
  }

  view(entity, mode, flush = false) {
    if (entity._view[mode] != undefined && !flush) return;
    entity._view[mode] = {};

    entity._view[mode]._filename = this.file(entity, mode);
    entity._view[mode]._content = this.content(entity, mode);
  }

  file(entity, mode) {
    return (SYS.base + 'tpl/' + entity.type() + '/' + mode + '.pug').toLowerCase();
  }

  content(entity, mode, include = true) {
    var content = fs.readFileSync(entity._view[mode]._filename).toString();

    if (include) {
      content = 'include ../functions.pug \n' + content;
    }

    return content;
  }

};