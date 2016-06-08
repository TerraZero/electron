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

}