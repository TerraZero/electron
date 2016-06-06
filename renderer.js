'use strict';

const Stream = SYS.use('stream/Stream');
const User = SYS.use('entity/User');
const EntitySource = SYS.use('stream/source/EntitySource');

new Stream(User.source([1, 4])).pipe(function(value) {
  value.entity.name = 'hallo';
}).pipe(function(value) {
  console.log(value.entity);
}).run();
