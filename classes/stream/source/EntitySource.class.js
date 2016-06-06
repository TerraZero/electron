'use strict';

const Source = SYS.use('stream/source/Source');

module.exports = class EntitySource extends Source {

  constructor(struct, ids) {
    super();
    this._struct = struct;
    this._ids = ids;
    this._index = 0;
  }

  start() {
    this._index = 0;
  }

  next() {
    return {
      id: this._ids[this._index++],
      entity: new this._struct(),
      struct: this._struct,
    };
  }

  done() {
    return this._index > this._ids.length;
  }

}