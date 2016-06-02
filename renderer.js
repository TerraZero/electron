'use strict';

var User = SYS.use('entity/User');

var u = new User();
var uc = u.controller();
console.log(uc.info());