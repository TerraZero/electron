'use strict';

const EntityStream = SYS.use('stream/EntityStream');
const Frame = SYS.use('frame/Frame');
const User = SYS.use('entity/User');

var stream = new EntityStream().load().render('full');

var root = new Frame('root');

root.setLayout('simple', 'start').region('content', stream);

stream.create().run({ids: [3], struct: User});