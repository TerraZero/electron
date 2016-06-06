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

  static fieldGetter(entity, name) {
    return function() {
      return entity._fields[name];
    };
  }

  static fieldSetter(entity, name) {
    return function(value) {
      entity._fields[name] = value;
    };
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

  instanceInfo() {
    SYS.context(this, 'instanceInfo').abstract();
  }

  idCondition(entity, query, id = null) {
    var fields = this.fields();
    var field = this.idField();
    id = id || entity[field];

    query.where(fields[field].name() + ' = ' + id);
  }

  create(entity) {
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

    // make the object not writable
    if (!this.isExtensible()) {
      Object.preventExtensions(entity);
    }
  }

  load(entity, id) {
    var fields = this.fields();
    var query = squel.select()
      .from(this.table());

    this.idCondition(entity, query, id);
    this.execute('load', entity, query, function(err, rows) {
      if (err) throw err;

      for (var field in fields) {
        entity._fields[field] = rows[0][fields[field].name()];
      }
    });
  }

  data(entity, row) {
    var fields = this.fields();

    for (var field in fields) {
      entity._fields[field] = row[fields[field].name()];
    }
  }

  save(entity) {
    if (entity.isNew()) {
      this.insert(entity);
    } else {
      this.update(entity);
    }
  }

  insert(entity) {
    var query = squel.insert()
      .into(this.table());

    this.insertFields(entity, query);

    this.execute('insert', entity, query, function(err, rows) {
      if (err) throw err;

      // to prevent flushing
      entity._fields.id = rows.insertId;
    });
  }

  insertFields(entity, query) {
    var fields = this.fields();

    for (var field in fields) {
      query.set(fields[field].name(), entity[field]);
    }
  }

  update(entity) {
    var query = squel.update()
      .table(this.table());

    this.idCondition(entity, query);
    this.updateFields(entity, query);

    this.execute('update', entity, query, function(err) {
      if (err) throw err;
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