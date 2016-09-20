'use strict';

const EventHandler = SYS.use('core/events/EventHandler.class');
const StreamLine = SYS.use('./StreamLine.class');

module.exports = class Stream {

  constructor() {
    new EventHandler(this);

    this._pipe = [];
  }

  pipe(pipe) {
    this._pipe.push(pipe);
    return this;
  }

  create() {
    return new StreamLine(this.trigger('create'));
  }

  run() {
    var line = this.create();

    return TOOLS.passOn(line, line.run, arguments);
  }

  args() {
    return [{}];
  }

}