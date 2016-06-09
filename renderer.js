'use strict';

var results = {};
SYS.hook('config', results);
console.log(results);

// const EntityStream = SYS.use('stream/EntityStream');
// const Frame = SYS.use('frame/Frame');
// const User = SYS.use('entity/User');

// var stream = new EntityStream().load([3, 1], User).render('full');

// var root = new Frame('root');

// root.setLayout('simple', 'start').region('content', stream);

// stream.run();

// const File = SYS.module('file');

// File.list(SYS.base + 'classes', function(dir, results) {
//   console.log(results);
// }, 'Entity.class');