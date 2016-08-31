'use strict';

// const Render = SYS.use('./render/Render.class');

/**
  * @Base("Entity")
  */
module.exports = class Entity {

  static initRoute(sysroute) {
    if (sysroute.annotation._name() == 'Base') return;
    this._routeController = sysroute.annotation.controller || 'entity.' + sysroute.annotation.name.toLowerCase() + '.controller';
  }

  static controller() {
    return SYS.get(this._routeController);
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

  static createRowCLI() {
    var fields = this.controller().fields();
    var row = {};

    for (var i in fields) {
      if (fields[i].type().startsWith('VARCHAR') && !fields[i]._primary) {
        row[fields[i].name()] = SYS.get('logger').input(fields[i].name() + ': ');
      }
    }
    return row;
  }

  static type() {
    SYS.context('Entity', 'static:type').abstract();
  }

  constructor(row = null) {
    this._fields = {};
    this._view = {};

    this.controller().build(this, row);
  }

  type() {
    return this.constructor.type();
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

  log() {
    var rows = [];
    var fields = this.fields();

    for (var i in fields) {
      rows.push([i, fields[i]]);
    }
    return rows;
  }

}