'use strict';

const DB = SYS.module('db');
const Stream = SYS.use('stream/Stream');
const User = SYS.use('entity/User');
const EntitySource = SYS.use('stream/source/EntitySource');

var s = new Stream();

s.source(new EntitySource(User, [1, 15, 3, 5])).pipe(function(value) {
  DB.execute('SELECT * FROM user u WHERE id = ' + value.id, this.goon(function(err, rows) {
    if (err) throw err;

    if (rows.length) {
      value.entity.data(rows[0]);
    } else {
      value.empty = true;
    }
  }));
}).pipe(function(value) {
  if (value.empty) {
    this.skip();
  }
}).pipe(function(value) {
  console.log(value);
});
s.run();