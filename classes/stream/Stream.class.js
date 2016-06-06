'use strict';

const Pipe = SYS.use('stream/Pipe');
const Handler = SYS.use('handler/Handler');

module.exports = class Stream {

  constructor(source = null) {
    this._source = source;
    this._pipe = [];
    this._handler = new Handler(this);

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

  handler() {
    return this._handler;
  }

  run() {
    this._handler.trigger('start')._source.start(this);
  }

  runNext() {
    this._current = this._source.next();
    this._index = 0;
    if (this._source.done()) {
      this._handler.trigger('end');
      return;
    }
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