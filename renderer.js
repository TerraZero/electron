'use strict';

// var results = {};
// SYS.hook('config', results);
// console.log(results);

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

// const Form = SYS.use('forms/Form');
// const FormComponent = SYS.use('forms/FormComponent');

// var form = new Form('test-form');
// form.addClass('hey', 'cool', 'sadsadd').removeClass('cool');
// var test = new FormComponent('hallo');
// test.setAttr('type', 'checkbox');

// var t = new FormComponent('cool');
// t.setAttr('type', 'radio');
// t.content('hallo text');
// form.addChild(test);
// test.addChild(t);

// console.log(form.render());

// const Pack = SYS.use('handler/');

// var t = {};
// t.handler = new Pack.Handler(t);
// t.handler.on('test', function(e, name) {
//   console.log(e);
//   console.log(e.args());
//   console.log(name);
// });
// t.handler.trigger('test', 'cool');

// const User = SYS.use('bin/entity/User');
// var u = new User();

// const FrameMod = SYS.use('FrameMod.mod');

// var frame = FrameMod.resolve('core');

// frame.test();

// const Stream = SYS.use('bin/stream/Stream.class');
// const User = SYS.use('bin/entity/User.class');

// var s = new Stream();

// s.pipe(User.load([1, 3]))
// .pipe(function() {
//   console.log(arguments);
// });
// s.run();

const $ = use('lib.jquery');
const Node = use('entity.node');

$('#root').append(Node.load(5));

use('elements').init();