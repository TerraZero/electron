'use strict';

const EventHandler = SYS.use('events/EventHandler');

module.exports = class StreamLine {

  constructor(stream) {
    new EventHandler(this, stream.events());

    this._stream = stream;
    this._pipe = stream._pipe;
    this._vars = this._stream.args();

    this._index = 0;
    this._context = null;
  }

  run() {
    this.trigger('run').next();
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

    this._pipe[index].apply(this, this._vars);
  }

  callback(callback) {
    var pipe = this;

    return function() {
      pipe._context = this;
      return TOOLS.passOn(pipe, callback, arguments);
    };
  }

}