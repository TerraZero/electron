'use strict';

module.exports = class Pipe {

  constructor(pipe) {
    this._pipe = pipe;
    this._stream = null;
    this._wait = false;
  }

  execute(stream, value) {
    this._stream = stream;
    this._pipe.call(this, value);
    if (!this._wait) {
      this.next();
    }
  }

  stream() {
    return this._stream;
  }

  next() {
    this._stream.next();
  }

  wait() {
    this._wait = true;
  }

  skip() {
    this.next();
    this.wait();
  }

  goon(callback) {
    var pipe = this;

    pipe.wait();
    return function() {
      SYS.passOn(pipe, callback, arguments);
      pipe.next();
    };
  }

}