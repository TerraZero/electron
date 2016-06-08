'use strict';

const Runner = SYS.use('interface/Runner');
const User = SYS.use('entity/User');

var u = new User();
u.id = 5;
u.name = 'Test';

var root = Runner.root();

root.setLayout('simple', 'start').region('content', u.render('full'));