'use strict';

const Source = SYS.use('stream/source/Source');

module.exports = class ArraySource extends Source {

  constructor(array) {
    super();
    this._array = array;
    this._index = 0;
  }

  start() {
    this._index = 0;
  }

  next() {
    return this._array[this._index++];
  }

  done() {
    return this._index > this._array.length;
  }

}