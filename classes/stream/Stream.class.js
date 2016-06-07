'use strict';

const Handler = SYS.use('handler/Handler');
const StreamLine = SYS.use('stream/StreamLine');

module.exports = class Stream {

  constructor() {
    this._handler = new Handler(this);
    this._pipe = [];
  }

  handler() {
    return this._handler;
  }

  on(name, listener) {
    return this.handler().on(name, listener);
  }

  pipe(pipe) {
    this._pipe.push(pipe);
    return this;
  }

  create() {
    return new StreamLine(this.handler().trigger('create'));
  }

}