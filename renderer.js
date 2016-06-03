'use strict';

const User = SYS.use('entity/User');
const Entity = SYS.use('entity/Entity');

var u = new User(3);
console.log(u.name);

console.log(u);