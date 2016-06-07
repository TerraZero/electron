'use strict';

const Stream = SYS.use('stream/Stream');

class Test extends Stream {

  test() {
    this.pipe(function(pipe, index, object) {
      console.log('idnex', index);
      console.log('object', object);
      pipe.vars().push({'test': 2});
      pipe.next();
    });
    return this;
  }

}

var ts = new Test();
ts.test().test();
var sl = ts.create();
sl.run(5, {'sdfhsf': 5});

