'use strict';

const DB = SYS.module('db');
const Stream = SYS.use('stream/Stream');
const User = SYS.use('entity/User');
const EntitySource = SYS.use('stream/source/EntitySource');

var s = new Stream();

s.source(new EntitySource(User, [1, 15, 3, 5])).pipe(function(value) {
  console.log(value.entity);
});
s.run();