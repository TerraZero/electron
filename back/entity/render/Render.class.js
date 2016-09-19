'use strict';

const Module = SYS.route('base.module');
const pug = SYS.node('pug');
const fs = SYS.node('graceful-fs');

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
    return (SYS.base() + 'tpl/' + entity.type() + '/' + mode + '.pug').toLowerCase();
  }

  content(entity, mode, include = true) {
    var content = fs.readFileSync(entity._view[mode]._filename).toString();

    if (include) {
      content = 'include ../functions.pug \n' + content;
    }

    return content;
  }

  execute(filename, vars, include = true) {
    var content = fs.readFileSync(filename).toString();

    if (include) {
      content = 'include ../functions.pug \n' + content;
    }
    vars.filename = filename;
    return pug.render(content, vars);
  }

  layout(name, id, vars) {
    return this.execute((SYS.base() + 'tpl/layout/' + name + '.pug').toLowerCase(), {id: id, vars: vars});
  }

  path(dir, name) {
    return (SYS.base() + 'tpl/' + dir + '/' + name + '.pug').toLowerCase();
  }

  renderTpl(file, vars, include = true) {
    var filename = SYS.base() + 'tpl/' + file + '.pug';
    var content = fs.readFileSync(filename).toString();

    if (include) {
      content = 'include ../functions.pug \n' + content;
    }
    vars.filename = filename;
    return pug.render(content, vars);
  }

};