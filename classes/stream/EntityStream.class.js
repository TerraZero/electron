'use strict';

const Stream = SYS.use('stream/Stream');

module.exports = class EntityStream extends Stream {

  constructor() {
    super();
  }

  load(ids = null, struct = null) {
    this.pipe(function(vars) {
      struct = struct || vars.struct;
      ids = ids || vars.ids;

      struct.multi(ids, this.callback(function(entities) {
        vars.entities = entities;
        this.next();
      }));
    });
    return this;
  }

  render(mode) {
    this.pipe(function(vars) {
      vars.output = '';

      for (var entity in vars.entities) {
        vars.output += vars.entities[entity].render(mode);
      }
      this.next();
    });
    return this;
  }

}