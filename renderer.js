'use strict';

const Stream = SYS.use('stream/Stream');
const User = SYS.use('entity/User');

class Test extends Stream {

  test() {
    this.pipe(function(ids, struct) {
      struct.multi(ids, this.callback(function(entities, rows) {
        this.vars().push(entities);
        this.next();
      }));
    });
    return this;
  }

  log() {
    this.pipe(function(ids, struct, entities) {
      this.next();
    });
    return this;
  }

}