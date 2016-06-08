'use strict';

const Frame = SYS.use('frame/Frame');
const User = SYS.use('entity/User');

var u = new User();
u.id = 5;
u.name = 'Test';

Frame.root();

var root = new Frame('root');

root.setLayout('simple', 'start').region('content', u.render('full'));