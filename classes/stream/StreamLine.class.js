'use strict';

const Stream = SYS.use('stream/Stream');

module.exports = class StreamLine {

  constructor(stream) {
    this._handler = stream._handler;
    this._pipe = stream._pipe;
    this._vars = null;

    this._index = 0;
  }

  handler() {
    return this._handler;
  }

  run() {
    this._vars = SYS.args(arguments);
    this.next();
  }

  next() {
    if (this._index < this._pipe.length) {
      this.call(this._index++);
    }
  }

  vars() {
    return this._vars;
  }

  call(index = null) {
    if (index == null) index = this._index;

    this._pipe[index].apply(this, this._vars);
  }

  callback(callback) {
    var pipe = this;

    return function() {
      return SYS.passOn(pipe, callback, arguments);
    };
  }

}