'use strict';

const Source = SYS.use('stream/source/Source');

module.exports = class EntitySource extends Source {

  constructor(struct, ids) {
    super();
    this._struct = struct;
    this._ids = ids;
    this._entities = [];
    this._index = 0;
  }

  start(stream) {
    var that = this;
    this._index = 0;

    this._struct.multi(this._ids, function(err, rows) {
      if (err) throw err;

      for (var row in rows) {
        var entity = new that._struct();

        entity.data(rows[row]);
        that._entities.push(entity);
      }
      stream.runNext();
    });
  }

  next() {
    return {
      entity: this._entities[this._index++],
      struct: this._struct,
    };
  }

  done() {
    return this._index > this._entities.length;
  }

}