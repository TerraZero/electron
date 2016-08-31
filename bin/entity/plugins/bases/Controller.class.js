'use strict';

const Squel = SYS.use('bin/database/Squel.class');

/**
  * @Base("Controller")
  */
module.exports = class Controller {

  static getRoute(sysroute) {
    if (sysroute.annotation._name() == 'Base') return this;
    if (!this._instance) this._instance = new this();
    return this._instance;
  }

  constructor() {
    this._table = null;
    this._fields = {};
    this._primaries = {};
    this._extensible = false;

    this.instanceInfo();
  }

  isExtensible() {
    return this._extensible;
  }

  fields() {
    return this._fields;
  }

  primaries() {
    return this._primaries();
  }

  table() {
    return this._table;
  }

  idField() {
    return 'id';
  }

  sqlField(name) {
    return this.fields()[name].name();
  }

  load(ids, struct, callback, options = null) {
    var query = Squel.select()
      .from(this.table());

    if (ids) {
      query.where(this.sqlField(this.idField()) + ' in (' + ids.join(',') + ')');
    }

    this.execute('multi', null, query, function controllerLoadCallback(err, rows) {
      if (err) throw err;
      var entities = [];

      for (var i in rows) {
        entities.push(new struct(rows[i]));
      }
      TOOLS.passOn(this, callback, [entities, rows]);
    }, options);
  }

  instanceInfo() {
    SYS.context(this, 'instanceInfo').abstract();
  }

  idCondition(entity, query, id = null) {
    var fields = this.fields();
    var field = this.idField();
    id = id || entity[field];

    query.where(fields[field].name() + ' = ' + id);
  }

  build(entity, row = null) {
    var fields = this.fields();

    for (var field in fields) {
      // create default value for the field
      if (typeof fields[field]._value == 'function') {
        entity._fields[field] = fields[field]._value(entity);
      } else {
        entity._fields[field] = fields[field]._value;
      }

      // create public properties for the field
      var handler = fields[field]._handler;
      if (handler) {
        Object.defineProperty(entity, field, handler(entity, field));
      }
    }
    if (row) {
      this.data(entity, row);
    }

    // make the object not writable
    if (!this.isExtensible()) {
      Object.preventExtensions(entity);
    }
  }

  data(entity, row) {
    var fields = this.fields();

    for (var field in fields) {
      if (row[fields[field].name()]) {
        entity._fields[field] = row[fields[field].name()];
      }
    }
  }

  save(entities, callback = null) {
    var inserts = [];
    var updates = [];

    for (var index in entities) {
      if (entities[index].isNew()) {
        inserts.push(entities[index]);
      } else {
        updates.push(entities[index]);
      }
    }

    var sync = TOOLS.sync(callback);

    if (inserts.length) {
      this.insert(inserts, sync.sync());
    }

    if (updates.length) {
      this.update(updates, sync.sync());
    }
  }

  insert(entities, callback = null) {
    var query = Squel.insert()
      .into(this.table());

    this.insertFields(entities, query);

    SYS.get('database.connection').execute(query.toString(), function(err, rows) {
      if (err) throw err;
      var id = rows.insertId;

      for (var index in entities) {
        entities[index].id = id++;
      }
      TOOLS.passOn(this, callback, [entities, rows, query]);
    });
  }

  insertFields(entities, query) {
    var fields = this.fields();
    var rows = [];

    for (var index in entities) {
      var row = {};

      for (var field in fields) {
        row[fields[field].name()] = entities[index][field];
      }
      rows.push(row);
    }

    query.setFieldsRows(rows);
  }

  update(entities, callback = null) {
    var sync = TOOLS.sync(callback);

    for (var index in entities) {
      var entity = entities[index];
      var query = Squel.update()
        .table(this.table());

      this.idCondition(entity, query);
      this.updateFields(entity, query);

      this.execute('update', entity, query, sync.sync());
    }
  }

  updateFields(entity, query) {
    var fields = this.fields();

    for (var field in fields) {
      if (!fields[field]._primary) {
        query.set(fields[field].name(), entity[field]);
      }
    }
  }

  execute(type, entity, query, callback, options = null) {
    if (options) {
      if (options.offset) {
        query.offset(options.offset);
      }
      if (options.limit) {
        query.limit(options.limit);
      }
    }
    SYS.get('database.connection').execute(query.toString(), callback);
  }

}