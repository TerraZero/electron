'use strict';

const Pipe = SYS.use('stream/Pipe');

module.exports = class Stream {

  constructor() {
    this._source = null;
    this._pipe = [];

    this._index = 0;
  }

  source(source) {
    this._source = source;
    return this;
  }

  pipe(pipe) {
    this._pipe.push(new Pipe(pipe));
    return this;
  }

  run() {
    this._source.start(this);
  }

  runNext() {
    this._current = this._source.next();
    this._index = 0;
    if (this._source.done()) return;
    this.next();
  }

  next() {
    if (this._index < this._pipe.length) {
      this._pipe[this._index++].execute(this, this._current);
    } else {
      this.runNext();
    }
  }

}