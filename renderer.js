'use strict';

const EntityStream = SYS.use('stream/EntityStream');
const User = SYS.use('entity/User');

var es = new EntityStream().load().render('full').log('test');

var line = es.create().run({ids: [1, 3, 4], struct: User});