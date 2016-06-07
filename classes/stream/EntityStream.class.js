'use strict';

const Stream = SYS.use('stream/Stream');

module.exports = class EntityStream extends Stream {

  constructor() {
    super();
  }

  load() {
    this.pipe(function(vars) {
      vars.struct.multi(vars.ids, this.callback(function(entities) {
        vars.entities = entities;
        this.next();
      }));
    });
    return this;
  }

  render(mode) {
    this.pipe(function(vars) {
      for (var i in vars.entities) {
        vars.entities[i].render(mode);
      }
      this.next();
    });
    return this;
  }

}