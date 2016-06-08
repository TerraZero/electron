'use strict';

const Stream = SYS.use('stream/Stream');
const Handler = SYS.use('handler/Handler');

module.exports = class StreamLine {

  constructor(stream) {
    this._stream = stream;
    this._handler = new Handler(this, stream.handler());
    this._pipe = stream._pipe;
    this._vars = null;

    this._index = 0;
    this._context = null;
  }

  handler() {
    return this._handler;
  }

  on(name, listener) {
    return this.handler().on(name, listener);
  }

  run() {
    this._vars = this._stream.args(SYS.args(arguments));
    this.handler().trigger('run').next();
    return this;
  }

  context() {
    return this._context;
  }

  next() {
    this._context = null;
    if (this._index < this._pipe.length) {
      this.call(this._index++);
    }
  }

  vars() {
    return this._vars;
  }

  call(index = null) {
    if (index == null) index = this._index;

    this.handler().trigger('call', index);
    this._pipe[index].apply(this, this._vars);
  }

  callback(callback) {
    var pipe = this;

    return function() {
      pipe._context = this;
      return SYS.passOn(pipe, callback, arguments);
    };
  }

}