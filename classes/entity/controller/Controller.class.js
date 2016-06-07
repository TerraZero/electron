'use strict';

const squel = SYS.module('squel');
const db = SYS.module('db');

let _instance = null;

// get primary keys as function

module.exports = class Controller {

  static instance() {
    if (_instance == null) {
      _instance = new Controller();
    }
    return _instance;
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

  multi(ids, struct, callback) {
    var query = squel.select()
      .from(this.table());

    if (ids) {
      query.where(this.sqlField(this.idField()) + ' in (' + ids.join(',') + ')');
    }

    this.execute('multi', null, query, function(err, rows) {
      if (err) throw err;
      var entities = [];

      for (var i in rows) {
        entities.push(new struct(rows[i]));
      }
      SYS.passOn(this, callback, [entities, rows]);
    });
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

  create(entity, row = null) {
    var fields = this.fields();

    if (row) {
      this.data(entity, row);
    }
    for (var field in fields) {
      if (!row) {
        // create default value for the field
        if (typeof fields[field]._value == 'function') {
          entity._fields[field] = fields[field]._value(entity);
        } else {
          entity._fields[field] = fields[field]._value;
        }
      }

      // create public properties for the field
      var handler = fields[field]._handler;
      if (handler) {
        Object.defineProperty(entity, field, handler(entity, field));
      }
    }

    // make the object not writable
    if (!this.isExtensible()) {
      Object.preventExtensions(entity);
    }
  }

  load(entity, id, callback) {
    var fields = this.fields();
    var query = squel.select()
      .from(this.table());

    this.idCondition(entity, query, id);
    this.execute('load', entity, query, function(err, rows) {
      if (err) throw err;

      for (var field in fields) {
        entity._fields[field] = rows[0][fields[field].name()];
      }
      SYS.passOn(this, callback, [entity, rows[0], query]);
    });
  }

  data(entity, row) {
    var fields = this.fields();

    for (var field in fields) {
      entity._fields[field] = row[fields[field].name()];
    }
  }

  save(entity, callback = null) {
    if (entity.isNew()) {
      this.insert(entity, callback);
    } else {
      this.update(entity, callback);
    }
  }

  insert(entity, callback = null) {
    var query = squel.insert()
      .into(this.table());

    this.insertFields(entity, query);

    this.execute('insert', entity, query, function(err, rows) {
      if (err) throw err;

      entity.id = rows.insertId;
      SYS.passOn(this, callback, [entity, rows, query]);
    });
  }

  insertFields(entity, query) {
    var fields = this.fields();

    for (var field in fields) {
      query.set(fields[field].name(), entity[field]);
    }
  }

  update(entity, callback = null) {
    var query = squel.update()
      .table(this.table());

    this.idCondition(entity, query);
    this.updateFields(entity, query);

    this.execute('update', entity, query, function(err, rows) {
      if (err) throw err;

      SYS.passOn(this, callback, [entity, rows, query]);
    });
  }

  updateFields(entity, query) {
    var fields = this.fields();

    for (var field in fields) {
      if (!fields[field]._primary) {
        query.set(fields[field].name(), entity[field]);
      }
    }
  }

  execute(type, entity, query, callback) {
    db.execute(query.toString(), callback);
  }

}