'use strict';

const Render = SYS.use('./render/Render.class');

module.exports = class Entity {

  static controller() {
    SYS.context('Entity', 'static:controller').abstract();
  }

  static save(struct = null) {
    struct = struct || this;

    return function pipeSave(vars) {
      vars.entities = vars.entities || {};
      var entities = vars.entities[struct.type()];

      if (!ISDEF(entities)) {
        this.next();
        return;
      }

      struct.controller().save(entities, this.callback(function pipeSaveCallback() {
        this.next();
      }));
    };
  }

  static load(ids, struct = null) {
    struct = struct || this;

    return function pipeLoad(vars) {
      struct.controller().load(ids, struct, this.callback(function pipeLoadCallback(entities) {
        vars.entities = vars.entities || {};
        vars.entities[struct.type()] = vars.entities[struct.type()] || [];

        for (var index in entities) {
          vars.entities[struct.type()].push(entities[index]);
        }
        this.next();
      }));
    };
  }

  static create(entities) {
    var struct = this;

    return function pipeCreate(vars) {
      vars.entities = vars.entities || {};
      vars.entities[struct.type()] = vars.entities[struct.type()] || [];

      for (var index in entities) {
        vars.entities[struct.type()].push(entities[index]);
      }
      this.next();
    };
  }

  static type() {
    SYS.context('Entity', 'static:type').abstract();
  }

  constructor(row = null) {
    this._fields = {};
    this._view = {};

    this.controller().build(this, row);
  }

  controller() {
    return this.constructor.controller();
  }

  unique() {
    return this.id;
  }

  fields() {
    return this._fields;
  }

  isNew() {
    return this.id == null;
  }

  save(callback) {
    this.controller().save(this, callback);
    return this;
  }

  view(mode, flush = false) {
    Render.view(this, mode, flush);
    return this;
  }

  render(mode, flush = false) {
    return Render.render(this, mode, flush);
  }

  flush() {
    this._view = {};
    return this;
  }

  data(row) {
    this.controller().data(this, row);
  }

}