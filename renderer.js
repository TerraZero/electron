'use strict';

const Stream = SYS.use('stream/Stream');
const User = SYS.use('entity/User');

new Stream(User.source([1, 4])).pipe(function(value) {
  value.entity.name = value.entity.id;
}).pipe(function(value) {
  console.log(value.entity.name);
}).pipe(function(value) {
  User.save(value.entity, this.goon(function() {
    this.next();
  }));
}).pipe(function(value) {
  console.log(value.entity.name);
}).run();

// test 2
