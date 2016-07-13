'use strict';

const EventHandler = SYS.use('events/EventHandler');
const StreamLine = SYS.use('./StreamLine');

module.exports = class Stream {

  constructor() {
    this._handler = new EventHandler(this);
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

  run() {
    var line = this.create();

    return TOOLS.passOn(line, line.run, arguments);
  }

  args(vars) {
    return vars;
  }

}